import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
<<<<<<< HEAD
import { Observable, catchError, tap } from 'rxjs';
=======
import { Observable } from 'rxjs';
>>>>>>> 56f6fac8b75807f7fd3dee5d92ce0c814333995d
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
<<<<<<< HEAD
   * Endpoint: GET /api/user/me
   */
  getUserProfile(): Observable<UserProfileDto> {
    return this.http.get<UserProfileDto>(`${environment.apiUrl}/api/user/me`)
      .pipe(
        tap(response => console.log('Profile fetched successfully:', response)),
        catchError(error => {
          console.error('Error fetching user profile:', error);
          throw error;
        })
      );
=======
   */
  getUserProfile(): Observable<UserProfileDto> {
    return this.http.get<UserProfileDto>(`${environment.apiUrl}/api/user/me`);
>>>>>>> 56f6fac8b75807f7fd3dee5d92ce0c814333995d
  }

  /**
   * Update user profile
<<<<<<< HEAD
   * Endpoint: POST /api/user/update
   */
  updateUserProfile(userData: UpdateProfileRequestDto): Observable<UserProfileDto> {
    return this.http.post<UserProfileDto>(`${environment.apiUrl}/api/user/update`, userData)
      .pipe(
        tap(response => console.log('Profile updated successfully:', response)),
        catchError(error => {
          console.error('Error updating user profile:', error);
          throw error;
        })
      );
=======
   */
  updateUserProfile(userData: UpdateProfileRequestDto): Observable<UserProfileDto> {
    return this.http.post<UserProfileDto>(`${environment.apiUrl}/api/user/update`, userData);
>>>>>>> 56f6fac8b75807f7fd3dee5d92ce0c814333995d
  }

  /**
   * Get connection follow-up history
<<<<<<< HEAD
   * Endpoint: GET /api/user/connexion-follow-up
=======
>>>>>>> 56f6fac8b75807f7fd3dee5d92ce0c814333995d
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
      { params: httpParams }
<<<<<<< HEAD
    )
    .pipe(
      tap(response => console.log('Connection follow-up fetched successfully:', response)),
      catchError(error => {
        console.error('Error fetching connection follow-up:', error);
        throw error;
      })
=======
>>>>>>> 56f6fac8b75807f7fd3dee5d92ce0c814333995d
    );
  }
}
