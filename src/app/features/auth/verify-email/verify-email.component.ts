import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/authentication/auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {
  verifyForm: FormGroup;
  email: string = '';
  isLoading = false;
  isSuccess = false;
  isError = false;
  message = '';
  resendRequested = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.verifyForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Get email from query params
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.email = params['email'];
      }
      else {
        this.email = sessionStorage.getItem('email') || '';
      }
    });
  }

  onSubmit(): void {
    if (this.verifyForm.invalid || !this.email) {
      return;
    }

    this.isLoading = true;
    this.isSuccess = false;
    this.isError = false;
    this.message = '';

    const otp = this.verifyForm.value.otp;

    this.authService.verifyEmail(this.email, otp).subscribe({
      next: () => {
        this.isLoading = false;
        this.isSuccess = true;
        this.message = 'Email verified successfully! Redirecting to login...';
        sessionStorage.removeItem('email');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        this.isError = true;
        if (error.status === 400) {
          this.message = 'Invalid verification code. Please try again.';
        } else {
          this.message = 'Failed to verify email. Please try again.';
        }
        console.error('Email verification error:', error);
      }
    });
  }

  requestNewCode(): void {
    if (!this.email) {
      this.isError = true;
      this.message = 'Email is required to request a new verification code.';
      return;
    }

    this.isLoading = true;
    this.isSuccess = false;
    this.isError = false;
    this.message = '';
    this.resendRequested = true;

    this.authService.requestVerificationEmail(this.email).subscribe({
      next: () => {
        this.isLoading = false;
        this.isSuccess = true;
        this.message = 'A new verification code has been sent to your email.';
      },
      error: (error) => {
        this.isLoading = false;
        this.isError = true;
        this.message = 'Failed to request a new verification code. Please try again.';
        console.error('Request new verification code error:', error);
      }
    });
  }
}