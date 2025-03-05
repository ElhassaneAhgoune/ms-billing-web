import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import {AuthService  } from '../../core/authentication/auth.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-user-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-change-password.component.html',
  styleUrl: './user-change-password.component.scss'
})
export class UserChangePasswordComponent {
  resetForm: FormGroup;
  isLoading = false;
  isSuccess = false;
  isError = false;
  message = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.resetForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
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
    const oldPassword = this.resetForm.value.oldPassword;
    this.userService.changePassword(oldPassword, newPassword).subscribe({
      next: () => {
        this.isLoading = false;
        this.isSuccess = true;
        this.message = 'Password change successful! Redirecting to login...';
        setTimeout(() => {
          this.logout();
        }, 3000);
      },
      error: (error) => {
        this.isLoading = false;
        this.isError = true;
        if (error.status === 200) {
          this.isLoading = false;
          this.isSuccess = true;
          this.isError = false;
          this.message = 'Password change successful! Redirecting to login...';
    
          setTimeout(() => {
            this.logout();
          }, 3000);
        }
         else if (error.status === 401) {
          this.message = 'Invalid or expired token.';
        } else {
          this.message = 'Failed to change password. Please check your old password and try again.';
        }
        
        console.error('Password change error:', error);
      }
    });
  
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const oldPassword = formGroup.get('oldPassword')?.value;
    const password = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    if (oldPassword === password) {
      return  { passwordMatch: true };
    }

    if (password === confirmPassword && oldPassword !== password) {
      return null;
    }

    return { passwordMismatch: true };
  }

  logout(): void {
    this.authService.signOut().subscribe({
      next: () => {
        console.log('Successfully signed out');
      },
      error: (err) => {
        console.error('Error signing out:', err);
        this.authService.logout();
      }
    });
  }
}
