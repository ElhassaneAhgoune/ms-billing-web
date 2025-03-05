import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/authentication/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../../theme/shared/components/footer/footer.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, FooterComponent],
  providers: [],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  returnUrl: string = '/dashboard/default';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get return url from route parameters or default to '/dashboard/default'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard/default';
    
    // Auto-navigate if already logged in
    if (this.authService.isAuthenticated) {
      this.router.navigate([this.returnUrl]);
    }
  }

  SignInOptions = [
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

  onLogin(): void {
    this.errorMessage = '';
    
    // Validate form inputs
    if (!this.username || !this.password) {
      this.errorMessage = 'Username and password are required.';
      return;
    }
    
    this.isLoading = true;
    
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.router.navigate([this.returnUrl]);
      },
      error: (error) => {
        if (error.status === 401) {
          this.errorMessage = 'Invalid username or password. Please try again.';
        } else if (error.status === 400) {
          this.errorMessage = 'Username and password are required.';
        } else {
          this.errorMessage = 'An error occurred. Please try again later.';
        }
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}