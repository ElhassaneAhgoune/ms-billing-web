import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../authentication/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip token for authentication endpoints
    if (this.isAuthRequest(request)) {
      return next.handle(request);
    }

    // Add token to request if available and needed
    const token = localStorage.getItem('accessToken');
    if (token && this.needsAuthToken(request)) {
      console.log(`Adding token to request: ${request.url}`);
      request = this.addToken(request, token);
    }

    // Handle the request with error handling for token expiration
    return next.handle(request).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          console.log(`Received 401 for ${request.url}, attempting to handle`);
          // Try to refresh token if unauthorized
          return this.handle401Error(request, next);
        }
        
        return throwError(() => error);
      })
    );
  }

  /**
   * Adds authentication token to the request
   * @private
   */
  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  /**
   * Checks if the request is an authentication request
   * @private
   */
  private isAuthRequest(request: HttpRequest<any>): boolean {
    return (
      request.url.includes('/api/auth/sign-in') ||
      request.url.includes('/api/auth/sign-up') ||
      request.url.includes('/api/auth/refresh') ||
      request.url.includes('/api/auth/forgot-password')
    );
  }

  /**
   * Check if we need to attach the token for specific requests
   * This helps troubleshoot issues with endpoints that may require special treatment
   */
  private needsAuthToken(request: HttpRequest<any>): boolean {
    // Always return true for now, which means always attach token when available
    return true;
  }

  /**
   * Handles 401 error (unauthorized) by trying to refresh the token
   * @private
   */
  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      console.log(`Starting token refresh due to 401 on: ${request.url}`);

      // Get the access token from storage
      const accessToken = localStorage.getItem('accessToken');
      
      if (accessToken) {
        console.log('Access token found, attempting refresh');
        // Try to refresh the token
        return this.authService.refreshToken().pipe(
          switchMap(token => {
            console.log('Token refresh successful, retrying request with new token');
            this.isRefreshing = false;
            this.refreshTokenSubject.next(token);
            
            // Retry the request with the new token
            return next.handle(this.addToken(request, token));
          }),
          catchError(error => {
            console.error('Token refresh failed, logging out', error);
            this.isRefreshing = false;
            
            // If refresh fails, log out and redirect to login
            this.authService.logout();
            this.router.navigate(['/login']);
            
            return throwError(() => error);
          }),
          finalize(() => {
            this.isRefreshing = false;
          })
        );
      } else {
        // No access token available, log out and redirect
        console.error('No access token available for refresh');
        this.isRefreshing = false;
        this.authService.logout();
        this.router.navigate(['/login']);
        
        return throwError(() => new Error('No access token available'));
      }
    } else {
      console.log('Token refresh already in progress, waiting for completion');
      // If refresh is already in progress, wait for it to complete
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => {
          console.log('Refresh complete, using new token for queued request');
          return next.handle(this.addToken(request, token));
        })
      );
    }
  }
}