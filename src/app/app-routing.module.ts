// angular import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Project import
import { AdminComponent } from './theme/layouts/admin-layout/admin-layout.component';
import { GuestLayoutComponent } from './theme/layouts/guest-layout/guest-layout.component';
import { authGuardFn } from './core/authentication/auth.guard';
import { noAuthGuardFn } from './core/authentication/no-auth.guard';

// Define which paths should redirect to login when accessed while not authenticated
const securedPaths = [
  '/dashboard',
  '/invoices',
  '/csv-files',
  '/profile',
  '/sample-page'
];

const routes: Routes = [
  // Guest routes should be placed BEFORE admin routes to ensure proper prioritization
  {
    path: '',
    component: GuestLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        canActivate: [noAuthGuardFn],
        loadComponent: () => import('./features/auth/login/login.component').then((c) => c.LoginComponent)
      },
      {
        path: 'register',
        canActivate: [noAuthGuardFn],
        loadComponent: () => import('./features/auth/signup/signup.component').then((c) => c.SignupComponent)
      },
      {
        path: 'verify-email',
        loadComponent: () => import('./features/auth/verify-email/verify-email.component').then((c) => c.VerifyEmailComponent)
      },
      {
        path: 'reset-password',
        canActivate: [noAuthGuardFn],
        loadComponent: () => import('./features/auth/reset-password/reset-password.component').then((c) => c.ResetPasswordComponent)
      },
      {
        path: 'request-password-reset',
        canActivate: [noAuthGuardFn],
        loadComponent: () => import('./features/auth/request-password-reset/request-password-reset.component').then((c) => c.RequestPasswordResetComponent)
      }
    ]
  },
  {
    path: '',
    component: AdminComponent,
    canActivate: [authGuardFn],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/user-profile/user-profile.component').then((c) => c.UserProfileComponent)
      },
      {
        path: 'change-password',
        loadComponent: () => import('./features/user-change-password/user-change-password.component').then((c) => c.UserChangePasswordComponent)
      },
      {
        path: 'invoices',
        children: [
          {
            path: 'visa',
            children: [
              {
                path: '',
                loadComponent: () => import('./features/invoices/visa/visa-invoice-list/visa-invoice-list.component').then((c) => c.VisaInvoiceListComponent)
              },
              {
                path: 'upload',
                loadComponent: () => import('./features/invoices/visa/visa-invoice-upload/visa-invoice-upload.component').then((c) => c.VisaInvoiceUploadComponent)
              },
              {
                path: 'summary',
                loadComponent: () => import('./features/invoices/visa/visa-summary/visa-summary.component').then((c) => c.VisaSummaryComponent)
              },
              {
                path: 'breakdown',
                loadComponent: () => import('./features/invoices/visa/visa-breakdown/visa-breakdown.component').then((c) => c.VisaBreakdownComponent)
              },
              {
                path: ':id',
                loadComponent: () => import('./features/invoices/visa/visa-invoice-detail/visa-invoice-detail.component').then((c) => c.VisaInvoiceDetailComponent)
              },


              // {
              //   path: 'summary',
              //   loadComponent: () => import('./features/invoices/visa/visa-summary/visa-summary.component').then((c) => c.VisaSummaryComponent)
              // },
              // {
              // path: 'breakdown',
              //loadComponent: () => import('./features/invoices/visa/visa-summary/visa-summary.component').then((c) => c.VisaSummaryComponent)
              //}
            ]
          },
          {
            path: 'mastercard',
            children: [
              {
                path: '',
                loadComponent: () => import('./features/invoices/mastercard/mastercard-invoice-list/mastercard-invoice-list.component').then((c) => c.MastercardInvoiceListComponent)
              },
              {
                path: 'upload',
                loadComponent: () => import('./features/invoices/mastercard/mastercard-invoice-upload/mastercard-invoice-upload.component').then((c) => c.MastercardInvoiceUploadComponent)
              },
              {
                path: 'summary',
                loadComponent: () => import('./features/invoices/mastercard/mastercard-summary/mastercard-summary.component').then((c) => c.MastercardSummaryComponent)
              },
              {
                path: 'breakdown',
                loadComponent: () => import('./features/invoices/mastercard/mastercard-breakdown/mastercard-breakdown.component').then((c) => c.MastercardBreakdownComponent)
              },
              {
                path: ':id',
                loadComponent: () => import('./features/invoices/mastercard/mastercard-invoice-detail/mastercard-invoice-detail.component').then((c) => c.MastercardInvoiceDetailComponent)
              },
              //{
              //path: 'csv-upload',
              //loadComponent: () => import('./features/invoices/mastercard/mastercard-invoice-upload/mastercard-invoice-upload.component').then((c) => c.MastercardInvoiceUploadComponent)
              //},

            ]
          }
        ]
      },
      {
        path: 'csv-files',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/csv/csv-file-list/csv-file-list.component').then((c) => c.CsvFileListComponent)
          },
          {
            path: 'visa/:csvName',
            loadComponent: () => import('./features/csv/visa-csv-detail/visa-csv-detail.component').then((c) => c.VisaCsvDetailComponent)
          },
          {
            path: 'mastercard/:csvName',
            loadComponent: () => import('./features/csv/mastercard-csv-detail/mastercard-csv-detail.component').then((c) => c.MastercardCsvDetailComponent)
          }

        ]
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./features/others/sample-page/sample-page.component').then((c) => c.SamplePageComponent)
      },
      {
        path: 'data-table',
        loadComponent: () => import('./features/data-table-demo/data-table-demo.component').then((c) => c.DataTableDemoComponent)
      },
      {
        path: 'analytics',
        loadChildren: () => import('./features/analytics/analytics.module').then(m => m.AnalyticsModule)
      },
      {
        path: 'follow-up',
        loadComponent: () => import('./features/user-follow-up/user-follow-up.component').then(m => m.UserFollowUpComponent)
      },
      {
        path: 'users-list',
        loadComponent: () => import('./features/user-list/user-list.component').then(m => m.UserListComponent)
      },
      {
        path: 'bank-list',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/bank-info/bank-info-list/bank-info-list.component').then(m => m.BankInfoListComponent)
          },
          {
            path: 'create',
            loadComponent: () => import('./features/bank-info/bank-info-creation/bank-info-creation.component').then(m => m.BankInfoCreationComponent)
          },
          {
            path: ':id',
            loadComponent: () => import('./features/bank-info/bank-info-update/bank-info-update.component').then(m => m.BankInfoUpdateComponent)
          }
        ]
      },
    ]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }