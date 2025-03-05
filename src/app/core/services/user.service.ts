import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ConnexionFollowUpDto, UpdateProfileRequestDto, UserProfileDto,UsersListDto } from '../models/auth.models';
import { ConnexionFollowUpQueryParams,UsersListQueryParams } from '../models/invoice.models';
import { HttpService } from './http.service';
import { changePasswordRequestDto } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpService: HttpService, private http: HttpClient) { }

    private toHttpParams(params: any): HttpParams {
      let httpParams = new HttpParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
      return httpParams;
    }

  /**
   * Get current user profile
   * Endpoint: GET /api/user/me
   */
  getUserProfile(): Observable<UserProfileDto> {
  
    return this.httpService.get<UserProfileDto>('api/user/me');

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
    return this.httpService.get<ConnexionFollowUpDto[]>(
      'api/user/connexion-follow-up', this.toHttpParams(params));
  }
  
  getUsersList(params: UsersListQueryParams = {}): Observable<UsersListDto[]> {
    return this.httpService.get<UsersListDto[]>(
      'api/user/list-users', this.toHttpParams(params));
  }

  changePassword(oldPassword: string, newPassword: string): Observable<object> {
      const resetData: changePasswordRequestDto = { oldPassword, newPassword };
      return this.http.post<object>(
        `${environment.apiUrl}/api/user/reset-password`, resetData,{  headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
          }
  });
    }
  
       
}
