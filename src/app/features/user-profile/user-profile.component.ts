<<<<<<< HEAD
import { Component, OnInit, OnDestroy } from '@angular/core';
=======
import { Component, OnInit } from '@angular/core';
>>>>>>> 56f6fac8b75807f7fd3dee5d92ce0c814333995d
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/authentication/auth.service';
<<<<<<< HEAD
import { ConnexionFollowUpDto, UserProfileDto, UpdateProfileRequestDto } from '../../core/models/auth.models';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
=======
import { UserProfileDto, UpdateProfileRequestDto } from '../../core/models/auth.models';
import { RouterModule } from '@angular/router';
>>>>>>> 56f6fac8b75807f7fd3dee5d92ce0c814333995d

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
<<<<<<< HEAD
export class UserProfileComponent implements OnInit, OnDestroy {
=======
export class UserProfileComponent implements OnInit {
>>>>>>> 56f6fac8b75807f7fd3dee5d92ce0c814333995d
  profileForm: FormGroup;
  userProfile: UserProfileDto | null = null;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
<<<<<<< HEAD
  
  // Connection follow-up data
  connexionHistory: ConnexionFollowUpDto[] = [];
  loadingConnexion = false;
  connexionError = '';
  
  private subscriptions: Subscription[] = [];
=======
>>>>>>> 56f6fac8b75807f7fd3dee5d92ce0c814333995d

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phoneNumber: [''],
      timezone: [''],
      locale: ['']
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
<<<<<<< HEAD
    this.loadConnectionHistory();
  }
  
  ngOnDestroy(): void {
    // Clean up subscriptions to prevent memory leaks
    this.subscriptions.forEach(sub => sub.unsubscribe());
=======
>>>>>>> 56f6fac8b75807f7fd3dee5d92ce0c814333995d
  }

  loadUserProfile(): void {
    this.isLoading = true;
<<<<<<< HEAD
    this.errorMessage = '';
    
    const sub = this.userService.getUserProfile().subscribe({
=======
    this.userService.getUserProfile().subscribe({
>>>>>>> 56f6fac8b75807f7fd3dee5d92ce0c814333995d
      next: (profile) => {
        this.userProfile = profile;
        this.profileForm.patchValue({
          username: profile.username,
          email: profile.email,
          firstName: profile.firstName,
          lastName: profile.lastName,
          phoneNumber: profile.phoneNumber || '',
          timezone: profile.timezone || '',
          locale: profile.locale || ''
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this.errorMessage = 'Failed to load user profile. Please try again.';
        this.isLoading = false;
      }
    });
<<<<<<< HEAD
    
    this.subscriptions.push(sub);
  }
  
  loadConnectionHistory(): void {
    this.loadingConnexion = true;
    this.connexionError = '';
    
    const sub = this.userService.getConnectionFollowUp().subscribe({
      next: (history) => {
        this.connexionHistory = history;
        this.loadingConnexion = false;
      },
      error: (error) => {
        console.error('Error loading connection history:', error);
        this.connexionError = 'Failed to load connection history. Please try again.';
        this.loadingConnexion = false;
      }
    });
    
    this.subscriptions.push(sub);
=======
>>>>>>> 56f6fac8b75807f7fd3dee5d92ce0c814333995d
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const updateData: UpdateProfileRequestDto = {
      username: this.profileForm.value.username,
      email: this.profileForm.value.email,
      firstName: this.profileForm.value.firstName,
      lastName: this.profileForm.value.lastName,
      phoneNumber: this.profileForm.value.phoneNumber,
      timezone: this.profileForm.value.timezone,
      locale: this.profileForm.value.locale
    };

<<<<<<< HEAD
    const sub = this.userService.updateUserProfile(updateData).subscribe({
=======
    this.userService.updateUserProfile(updateData).subscribe({
>>>>>>> 56f6fac8b75807f7fd3dee5d92ce0c814333995d
      next: (updatedProfile) => {
        this.userProfile = updatedProfile;
        this.successMessage = 'Profile updated successfully';
        this.isLoading = false;

        // Update the stored user data
        this.authService.getUserProfile().subscribe();
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.errorMessage = 'Failed to update profile. Please try again.';
        this.isLoading = false;
      }
    });
<<<<<<< HEAD
    
    this.subscriptions.push(sub);
  }
  
  refreshConnectionHistory(): void {
    this.loadConnectionHistory();
=======
>>>>>>> 56f6fac8b75807f7fd3dee5d92ce0c814333995d
  }
}