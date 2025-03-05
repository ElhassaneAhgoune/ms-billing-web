// angular import
import { Component, OnInit, inject, input, output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

// project import
import { UserService } from 'src/app/core/services/user.service';
import { UserProfileDto, ConnexionFollowUpDto } from 'src/app/core/models/auth.models';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/core/authentication/auth.service';

// icon
import { IconService, IconDirective } from '@ant-design/icons-angular';
import {
  BellOutline,
  SettingOutline,
  GiftOutline,
  MessageOutline,
  PhoneOutline,
  CheckCircleOutline,
  LogoutOutline,
  EditOutline,
  UserOutline,
  ProfileOutline,
  WalletOutline,
  QuestionCircleOutline,
  LockOutline,
  CommentOutline,
  UnorderedListOutline,
  ArrowRightOutline,
  GithubOutline,
  HistoryOutline
} from '@ant-design/icons-angular/icons';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgScrollbarModule } from 'ngx-scrollbar';

@Component({
  selector: 'app-nav-right',
  standalone: true,
  imports: [IconDirective, RouterModule, NgScrollbarModule, NgbNavModule, NgbDropdownModule, CommonModule],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent implements OnInit {
  private iconService = inject(IconService);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  public router = inject(Router);

  styleSelectorToggle = input<boolean>();
  Customize = output();
  windowWidth: number;
  screenFull: boolean = true;
  
  // User profile data
  userProfile: UserProfileDto | null = null;
  connectionHistory: ConnexionFollowUpDto[] = [];
  isLoading = true;
  error: string | null = null;
  
  Math = Math;
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  constructor() {
    this.windowWidth = window.innerWidth;
    this.iconService.addIcon(
      ...[
        CheckCircleOutline,
        GiftOutline,
        MessageOutline,
        SettingOutline,
        PhoneOutline,
        LogoutOutline,
        UserOutline,
        EditOutline,
        ProfileOutline,
        QuestionCircleOutline,
        LockOutline,
        CommentOutline,
        UnorderedListOutline,
        ArrowRightOutline,
        BellOutline,
        GithubOutline,
        WalletOutline,
        HistoryOutline
      ]
    );
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadConnectionHistory();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.userService.getUserProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading user profile:', err);
        this.error = 'Failed to load user profile.';
        this.isLoading = false;
      }
    });
  }

  loadConnectionHistory(): void {
    this.userService.getConnectionFollowUp().subscribe({
      next: (data) => {
        if (data && typeof data === 'object' && !Array.isArray(data) &&
        'content' in data && 'totalElements' in data && 'totalPages' in data) {
        const paginatedData = data as { content: ConnexionFollowUpDto[], totalElements: number, totalPages: number };
        this.totalElements = paginatedData.totalElements;
        this.connectionHistory = paginatedData.content;
        this.totalPages = paginatedData.totalPages;
         } else{
        this.connectionHistory = data;
      }},
      error: (err) => {
        console.error('Error loading connection history:', err);
      }
    });
  }

  navigateToEditProfile(): void {
    this.router.navigate(['/profile']);
  }

  get userFullName(): string {
    if (this.userProfile) {
      return `${this.userProfile.firstName} ${this.userProfile.lastName}`;
    }
    return 'User';
  }

  get userRole(): string {
    return this.userProfile?.role || 'User';
  }

  profile = [
    {
      icon: 'edit',
      title: 'Edit Profile',
      action: () => this.navigateToEditProfile()
    },
    {
      icon: 'user',
      title: 'View Profile',
      action: () => this.router.navigate(['/profile'])
    },
    {
      icon: 'user',
      title: 'Change Password',
      action: () => this.router.navigate(['/change-password'])
    },
    {
      icon: 'wallet',
      title: 'Billing',
      action: () => this.router.navigate(['/invoices/mastercard'])
    }
  ];

  setting = [
    {
      icon: 'question-circle',
      title: 'Support',
      action: () => window.open('https://github.com/ElhassaneAhgoune/ms-billing-web/issues', '_blank')
    },
    {
      icon: 'user',
      title: 'Account Settings',
      action: () => this.router.navigate(['/profile'])
    },
    {
      icon: 'lock',
      title: 'Privacy Center',
      action: () => this.router.navigate(['/profile'])
    },
    {
      icon: 'comment',
      title: 'Feedback',
      action: () => window.open('https://github.com/ElhassaneAhgoune/ms-billing-web/issues/new', '_blank')
    },
    {
      icon: 'history',
      title: 'Connection History',
      action: () => this.router.navigate(['/profile'])
    }
  ];

  logout(): void {
    // Use the signOut method from AuthService which properly revokes the token and redirects
    this.authService.signOut().subscribe({
      next: () => {
        console.log('Successfully signed out');
      },
      error: (err) => {
        console.error('Error signing out:', err);
        // Even if API call fails, use the local logout as fallback
        this.authService.logout();
      }
    });
  }
}
