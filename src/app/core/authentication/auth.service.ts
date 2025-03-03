// src/app/core/authentication/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  // Load user from localStorage on service initialization
  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('accessToken');
    
    if (storedUser && storedToken) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
      } catch (e) {
        console.error('Error parsing stored user data', e);
        this.logout();
      }
    }
  }

  // Check if user is authenticated
  public get isAuthenticated(): boolean {
    return !!this.currentUserSubject.value && !!localStorage.getItem('accessToken');
  }

  // Get current user data
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // Login method
  login(username: string, password: string): Observable<any> {
    this.isLoadingSubject.next(true);
    
    return this.http.post<any>(`${environment.apiUrl}/api/auth/sign-in`, { username, password })
      .pipe(
        tap(response => {
          // Store token
          localStorage.setItem('accessToken', response.accessToken);
          if (response.refreshToken) {
            localStorage.setItem('refreshToken', response.refreshToken);
          }
          
          // If response has user data, use it, otherwise fetch user data
          if (response.user) {
            this.setUserData(response.user);
          }
        }),
        switchMap(response => {
          // If user data not included in response, fetch it
          if (!response.user) {
            return this.getUserProfile();
          }
          return of(response.user);
        }),
        catchError(error => {
          console.error('Login failed', error);
          throw error;
        }),
        tap(() => this.isLoadingSubject.next(false))
      );
  }

  // Fetch user profile
  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/api/user/me`)
      .pipe(
        tap(user => {
          this.setUserData(user);
        }),
        catchError(error => {
          console.error('Failed to fetch user profile', error);
          throw error;
        })
      );
  }

  // Set user data in storage and BehaviorSubject
  private setUserData(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  // Register new user
  register(userData: any): Observable<any> {
    this.isLoadingSubject.next(true);
    
    return this.http.post<any>(`${environment.apiUrl}/api/auth/sign-up`, userData)
      .pipe(
        tap(() => this.isLoadingSubject.next(false)),
        catchError(error => {
          this.isLoadingSubject.next(false);
          throw error;
        })
      );
  }

  // Verify email with OTP
  verifyEmail(email: string, otp: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/auth/verify-email`, { email, otp });
  }

  // Request password reset
  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/auth/forgot-password`, { email });
  }

  // Update user profile
  updateUserProfile(userData: Partial<User>): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/api/user/update`, userData)
      .pipe(
        tap(updatedUser => {
          // Update the stored user data with the new values
          const currentUser = this.currentUserValue;
          if (currentUser) {
            const mergedUser = { ...currentUser, ...updatedUser };
            this.setUserData(mergedUser);
          }
        })
      );
  }

  // Logout
  logout(): void {
    // Clear all stored data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    // Clear the user subject
    this.currentUserSubject.next(null);
    
    // Navigate to login page
    this.router.navigate(['/login']);
  }

  // Refresh the access token
  refreshToken(): Observable<string> {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      return of('');
    }
    
    return this.http.post<{ accessToken: string }>(`${environment.apiUrl}/api/auth/refresh`, { refreshToken })
      .pipe(
        tap(response => {
          localStorage.setItem('accessToken', response.accessToken);
        }),
        map(response => response.accessToken),
        catchError(error => {
          console.error('Token refresh failed', error);
          this.logout();
          throw error;
        })
      );
  }
}