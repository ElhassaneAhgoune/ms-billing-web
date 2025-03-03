// src/app/core/services/http.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * GET request
   * @param endpoint - API endpoint
   * @param params - Optional HTTP parameters
   * @param options - Optional HTTP options
   */
  get<T>(endpoint: string, params?: HttpParams | Record<string, string>, options = {}): Observable<T> {
    const url = this.buildUrl(endpoint);
    
    // Handle params
    let httpParams = new HttpParams();
    if (params) {
      if (params instanceof HttpParams) {
        httpParams = params;
      } else {
        Object.keys(params).forEach(key => {
          if (params[key] !== null && params[key] !== undefined) {
            httpParams = httpParams.set(key, params[key]);
          }
        });
      }
    }

    return this.http.get<T>(url, { ...options, params: httpParams })
      .pipe(catchError(error => this.handleError(error)));
  }

  /**
   * POST request
   * @param endpoint - API endpoint
   * @param data - Request payload
   * @param options - Optional HTTP options
   */
  post<T>(endpoint: string, data: any, options = {}): Observable<T> {
    const url = this.buildUrl(endpoint);
    return this.http.post<T>(url, data, options)
      .pipe(catchError(error => this.handleError(error)));
  }

  /**
   * PUT request
   * @param endpoint - API endpoint
   * @param data - Request payload
   * @param options - Optional HTTP options
   */
  put<T>(endpoint: string, data: any, options = {}): Observable<T> {
    const url = this.buildUrl(endpoint);
    return this.http.put<T>(url, data, options)
      .pipe(catchError(error => this.handleError(error)));
  }

  /**
   * DELETE request
   * @param endpoint - API endpoint
   * @param options - Optional HTTP options
   */
  delete<T>(endpoint: string, options = {}): Observable<T> {
    const url = this.buildUrl(endpoint);
    return this.http.delete<T>(url, options)
      .pipe(catchError(error => this.handleError(error)));
  }

  /**
   * Build the full URL
   * @private
   */
  private buildUrl(endpoint: string): string {
    // If the endpoint already starts with http, assume it's a full URL
    if (endpoint.startsWith('http')) {
      return endpoint;
    }
    
    // Remove leading slash if present
    const path = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    return `${this.apiUrl}/${path}`;
  }

  /**
   * Global error handler
   * @private
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = 'Could not connect to the server. Please check your internet connection.';
      } else if (error.status === 401) {
        errorMessage = 'Unauthorized access. Please log in again.';
        // You might want to redirect to login or trigger a refresh token here
      } else if (error.status === 403) {
        errorMessage = 'Access forbidden. You do not have permission to access this resource.';
      } else if (error.status === 404) {
        errorMessage = 'The requested resource was not found.';
      } else if (error.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }
    
    console.error('API Error:', error);
    
    return throwError(() => new Error(errorMessage));
  }
}