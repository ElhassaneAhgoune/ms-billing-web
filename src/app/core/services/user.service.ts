import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ConnexionFollowUpDto, UpdateProfileRequestDto, UserProfileDto } from '../models/auth.models';
import { ConnexionFollowUpQueryParams } from '../models/invoice.models';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  /**
   * Get current user profile
   * Endpoint: GET /api/user/me
   */
  getUserProfile(): Observable<UserProfileDto> {
  
    return this.http.get<UserProfileDto>(`${environment.apiUrl}/api/user/me`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
      }
    })
      .pipe(
        tap(response => console.log('Profile fetched successfully:', response)),
        catchError(error => {
          console.error('Error fetching user profile:', error);
          throw error;
        })
      );

  }

  /**
   * Update user profile
   * Endpoint: POST /api/user/update
   */
  updateUserProfile(userData: UpdateProfileRequestDto): Observable<UserProfileDto> {
    return this.http.post<UserProfileDto>(`${environment.apiUrl}/api/user/update`, userData, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
      }
    })
      .pipe(
        tap(response => console.log('Profile updated successfully:', response)),
        catchError(error => {
          console.error('Error updating user profile:', error);
          throw error;
        })
      );

  }

  /**
   * Get connection follow-up history

   * Endpoint: GET /api/user/connexion-follow-up

   */
  getConnectionFollowUp(params: ConnexionFollowUpQueryParams = {}): Observable<ConnexionFollowUpDto[]> {
    let httpParams = new HttpParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key].toString());
      }
    });
    
    return this.http.get<ConnexionFollowUpDto[]>(
      `${environment.apiUrl}/api/user/connexion-follow-up`,
      { params: httpParams,
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
        }
       }
    )
    .pipe(
      tap(response => console.log('Connection follow-up fetched successfully:', response)),
      catchError(error => {
        console.error('Error fetching connection follow-up:', error);
        throw error;
      })

    );
  }
}
