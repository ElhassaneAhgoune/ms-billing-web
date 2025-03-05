// src/app/core/authentication/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { User } from '../models/User';
import {
  AuthenticationRequestDto,
  AuthenticationResponseDto,
  EmailVerificationRequestDto,
  RegistrationRequestDto,
  RegistrationResponseDto,
  ResetPasswordRequestDto,
  UpdateProfileRequestDto,
  UserProfileDto,
  ConnexionFollowUpDto
} from '../models/auth.models';

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

  /**
   * Login with username and password
   */
  login(username: string, password: string): Observable<UserProfileDto> {
    this.isLoadingSubject.next(true);
    
    const authRequest: AuthenticationRequestDto = { username, password };
    
    console.log(`Attempting login for user: ${username}`);
    
    return this.http.post<AuthenticationResponseDto>(`${environment.apiUrl}/api/auth/sign-in`, authRequest)
      .pipe(
        tap(response => {
          console.log('Sign-in successful, received token:', response.accessToken?.substring(0, 10) + '...');
          // Store token
          localStorage.setItem('accessToken', response.accessToken);
        }),
        switchMap(() => {
          console.log('Token stored, fetching user profile...');
          return this.getUserProfile(); // Get user profile after successful login
        }),
        catchError(error => {
          console.error('Login failed', error);
          
          // Clean up stored token on error
          if (error.status === 401) {
            console.log('Removing invalid token due to 401 error');
            localStorage.removeItem('accessToken');
          }
          
          throw error;
        }),
        tap(() => this.isLoadingSubject.next(false))
      );
  }

  /**
   * Fetch user profile information
   */
  getUserProfile(): Observable<UserProfileDto> {
    console.log('Fetching user profile with token:', localStorage.getItem('accessToken'));
    
    return this.http.get<UserProfileDto>(`${environment.apiUrl}/api/user/me`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
      .pipe(
        tap(userProfile => {
          console.log('Successfully fetched user profile:', userProfile);
          // Convert the UserProfileDto to User model as needed by the application
          const user: User = {
            username: userProfile.username,
            email: userProfile.email,
            firstName: userProfile.firstName,
            lastName: userProfile.lastName,
            phoneNumber: userProfile.phoneNumber,
            timezone: userProfile.timezone,
            locale: userProfile.locale,
            role: userProfile.role
          };
          
          this.setUserData(user);
        }),
        catchError(error => {
          console.error('Failed to fetch user profile', error);
          
          if (error.status === 401) {
            console.error('Authentication error (401) when fetching profile. Token might be invalid or expired.');
            // Clear invalid token
            localStorage.removeItem('accessToken');
          }
          
          throw error;
        })
      );
  }

  // Set user data in storage and BehaviorSubject
  private setUserData(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  /**
   * Register new user
   */
  register(userData: RegistrationRequestDto): Observable<RegistrationResponseDto> {
    this.isLoadingSubject.next(true);
    
    return this.http.post<RegistrationResponseDto>(`${environment.apiUrl}/api/auth/sign-up`, userData)
      .pipe(
        tap(() => this.isLoadingSubject.next(false)),
        catchError(error => {
          this.isLoadingSubject.next(false);
          throw error;
        })
      );
  }

  /**
   * Verify email with OTP
   */
  verifyEmail(email: string, otp: string): Observable<AuthenticationResponseDto> {
    const verificationData: EmailVerificationRequestDto = { email, otp };
    return this.http.post<AuthenticationResponseDto>(
      `${environment.apiUrl}/api/auth/verify-email`,
      verificationData
    ).pipe(
      tap(response => {
        if (response.accessToken) {
          localStorage.setItem('accessToken', response.accessToken);
        }
      })
    );
  }

  /**
   * Request password reset
   */
  requestResetPassword(email: string): Observable<boolean> {
    const params = new HttpParams().set('email', email);
    return this.http.post<boolean>(
      `${environment.apiUrl}/api/auth/request-reset-password`,
      null,
      { params }
    );
  }

  /**
   * Reset password with token
   */
  resetPassword(token: string, newPassword: string): Observable<object> {
    const resetData: ResetPasswordRequestDto = { token, newPassword };
    return this.http.post<object>(
      `${environment.apiUrl}/api/auth/reset-password`,
      resetData
    );
  }

  /**
   * Request email verification resend
   */
  requestVerificationEmail(email: string): Observable<void> {
    const params = new HttpParams().set('email', email);
    return this.http.post<void>(
      `${environment.apiUrl}/api/auth/request-verification-email`,
      null,
      { params }
    );
  }

  /**
   * Update user profile
   */
  updateUserProfile(userData: UpdateProfileRequestDto): Observable<UserProfileDto> {
    return this.http.post<UserProfileDto>(`${environment.apiUrl}/api/user/update`, userData)
      .pipe(
        tap(updatedProfile => {
          // Convert to User model and update stored user data
          const userModel: User = {
            username: updatedProfile.username,
            email: updatedProfile.email,
            firstName: updatedProfile.firstName || '',
            lastName: updatedProfile.lastName || '',
            phoneNumber: updatedProfile.phoneNumber,
            timezone: updatedProfile.timezone,
            locale: updatedProfile.locale,
            role: updatedProfile.role
          };
          
          // Update the stored user data with the new values
          const currentUser = this.currentUserValue;
          if (currentUser) {
            const mergedUser = { ...currentUser, ...userModel };
            this.setUserData(mergedUser);
          }
        })
      );
  }

  /**
   * Get user connection follow-up history
   */
  getConnectionFollowUp(params: {
    userName?: string;
    date?: string;
    action?: string;
    page?: number;
    size?: number;
  } = {}): Observable<ConnexionFollowUpDto[]> {
    const httpParams = new HttpParams({ fromObject: params as any });
    
    return this.http.get<ConnexionFollowUpDto[]>(
      `${environment.apiUrl}/api/user/connexion-follow-up`,
      { params: httpParams }
    );
  }

  // Logout
  logout(): void {
    // Clear all stored data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    
    // Clear the user subject
    this.currentUserSubject.next(null);
    
    // Navigate to login page
    this.router.navigate(['/login']);
  }

  /**
   * Refresh the access token using refresh token cookie
   */
  refreshToken(): Observable<string> {
    console.log('Attempting to refresh token');
    
    // Get the current token to include in refresh request
    const currentToken = localStorage.getItem('accessToken');
    
    if (!currentToken) {
      console.error('No token found to refresh');
      return throwError(() => new Error('No token available for refresh'));
    }
    
    return this.http.post<AuthenticationResponseDto>(
      `${environment.apiUrl}/api/auth/refresh`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${currentToken}`
        }
      }
    ).pipe(
      tap(response => {
        console.log('Token refresh successful');
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

  /**
   * Sign out and revoke token
   */
  signOut(): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/api/auth/sign-out`, {})
      .pipe(
        tap(() => this.logout()),
        catchError(error => {
          console.error('Sign out failed', error);
          // Still perform local logout even if server request fails
          this.logout();
          throw error;
        })
      );
  }
}