import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/authentication/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  token: string = '';
  isLoading = false;
  isSuccess = false;
  isError = false;
  message = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Get token from query params
    this.route.queryParams.subscribe(params => {
      if (params['token']) {
        this.token = params['token'];
      }
      else {
        // No token OR no Email provided, redirect to request password reset
        this.router.navigate(['/request-password-reset']);
      }
    });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password === confirmPassword) {
      return null;
    }

    return { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.resetForm.invalid ) {
      return;
    }

    this.isLoading = true;
    this.isSuccess = false;
    this.isError = false;
    this.message = '';

    const newPassword = this.resetForm.value.newPassword;
    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: () => {
        this.isLoading = false;
        this.isSuccess = true;
        this.message = 'Password reset successful! Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        this.isError = true;
        if (error.status === 200) {
        // TODO BACKEND Le staus est 200 mais corp vide donc ERROR ANGULAR 
          this.isLoading = false;
          this.isSuccess = true;
          this.isError = false;
          this.message = 'Password reset successful! Redirecting to login...';
    
          setTimeout(() => {
            this.router.navigateByUrl('/login');
          }, 4000);
        }
         else if (error.status === 401) {
          this.message = 'Invalid or expired token. Please request a new password reset link.';
        } else {
          this.message = 'Failed to reset password. Please try again.';
        }
        
        console.error('Password reset error:', error);
      }
    });
  }
}