// Angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators,AbstractControl, ValidationErrors } from '@angular/forms';
import { FooterComponent } from '../../../theme/shared/components/footer/footer.component';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/authentication/auth.service'; 
import { RegistrationRequestDto } from '../../../core/models/auth.models';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, FooterComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signupForm: FormGroup;
  isLoading = false;  
  successMessage = '';
  errorMessage = '';
  SignUpOptions = [
    {
      image: 'assets/images/authentication/google.svg',
      name: 'Google'
    },
    {
      image: 'assets/images/authentication/twitter.svg',
      name: 'Twitter'
    },
    {
      image: 'assets/images/authentication/facebook.svg',
      name: 'Facebook'
    }
  ];
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      password: ['', [Validators.required, this.passwordStrengthValidator]],
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      phoneNumber: ['', [Validators.required,Validators.maxLength(20)]],
      timezone: ['', [Validators.required,Validators.maxLength(50)]],
      locale: ['', [Validators.required,Validators.maxLength(10)]],
      roleId: [{ value: 1, disabled: true }]
    });
  }
  onSubmit() {
    if (this.signupForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = null;

    const userData: RegistrationRequestDto = this.signupForm.value;
    //TODO Mis par défaut 1 pour le roleId
    userData.roleId=this.signupForm.get('roleId').value;
    console.log(userData);

    this.authService.register(userData).subscribe({
      next: (response) => {
        this.successMessage = 'Account created successfully!';
        setTimeout(() => {
          this.router.navigate(['/verify-email']);
          sessionStorage.setItem('email', userData.email); 
        }, 2000);
       
      },
      error: (error) => {
        if (error.status === 409) {
          this.errorMessage = 'This Username or Email are already used. Please choose another one.';
        } else if (error.status === 400) {
          this.errorMessage = 'All fields are required';
        } else {
          this.errorMessage = 'An error occurred. Please try again later.';
        }
      }
    });
  }

  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value || '';
    const errors: any = {};  
  
    if (value.length < 8) {
      errors.minLength = 'Min 8 chars.';
    }
    if (!/[A-Z]/.test(value)) {
      errors.uppercase = 'Add an uppercase.';
    }
    if (!/[a-z]/.test(value)) {
      errors.lowercase = 'Add a lowercase.';
    }
    if (!/[0-9]/.test(value)) {
      errors.digit = 'Add a number.';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      errors.specialChar = 'Add a special char.';
    }
  
    return Object.keys(errors).length ? errors : null;
  }  
}
