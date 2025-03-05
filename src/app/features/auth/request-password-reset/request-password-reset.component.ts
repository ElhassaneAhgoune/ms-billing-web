import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/authentication/auth.service';

@Component({
  selector: 'app-request-password-reset',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './request-password-reset.component.html',
  styleUrls: ['./request-password-reset.component.scss']
})
export class RequestPasswordResetComponent {
  resetForm: FormGroup;
  isLoading = false;
  isSuccess = false;
  isError = false;
  message = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.resetForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.isSuccess = false;
    this.isError = false;
    this.message = '';

    const email = this.resetForm.value.email;

    this.authService.requestResetPassword(email).subscribe({
      next: () => {
        this.isLoading = false;
        this.isSuccess = true;
        this.message = 'Password reset instructions have been sent to your email.';
        this.resetForm.reset();
      },
      error: (error) => {
        this.isLoading = false;
        this.isError = true;
        
        if (error.status === 404) {
          this.message = 'Email not found. Please check and try again.';
        } else if (error.status === 400) {
          this.message = 'Invalid email address. Please provide a valid email.';
        } else {
          this.message = 'Failed to request password reset. Please try again later.';
        }
        
        console.error('Password reset request error:', error);
      }
    });
  }
}