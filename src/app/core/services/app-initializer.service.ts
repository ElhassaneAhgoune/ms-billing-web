import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../authentication/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AppInitializerService {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Initialize the application, checking auth state
   * This will be used as an APP_INITIALIZER factory
   */
  initializeApp(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      // If we have a token, try to get the user profile
      if (localStorage.getItem('accessToken')) {
        console.log('Found token at startup, verifying validity...');
        
        this.authService.getUserProfile().subscribe({
          next: (userProfile) => {
            console.log('Token valid, user authenticated at startup');
            resolve(true);
          },
          error: (error) => {
            console.error('Invalid token at startup, redirecting to login', error);
            this.authService.logout();
            resolve(false);
          }
        });
      } else {
        console.log('No token found at startup');
        resolve(false);
      }
    });
  }
}