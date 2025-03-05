// angular import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Project import
import { AdminComponent } from './theme/layouts/admin-layout/admin-layout.component';
import { GuestLayoutComponent } from './theme/layouts/guest-layout/guest-layout.component';
import { authGuardFn } from './core/authentication/auth.guard';
<<<<<<< HEAD
import { noAuthGuardFn } from './core/authentication/no-auth.guard';

// Define which paths should redirect to login when accessed while not authenticated
const securedPaths = [
  '/dashboard',
  '/invoices',
  '/csv-files',
  '/profile',
  '/sample-page'
];
=======
>>>>>>> 56f6fac8b75807f7fd3dee5d92ce0c814333995d

const routes: Routes = [
  // Guest routes should be placed BEFORE admin routes to ensure proper prioritization
  {
    path: '',
<<<<<<< HEAD
    component: GuestLayoutComponent,
    children: [
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
    redirectTo: '/dashboard/default',
=======
    redirectTo: '/login',
>>>>>>> 56f6fac8b75807f7fd3dee5d92ce0c814333995d
    pathMatch: 'full'
  },
  {
    path: '',
    component: AdminComponent,
    canActivate: [authGuardFn],
    children: [
      {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
      },
      {
        path: 'dashboard/default',
        loadComponent: () => import('./features/dashboard/default/default.component').then((c) => c.DefaultComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/user-profile/user-profile.component').then((c) => c.UserProfileComponent)
      },
      {
        path: 'invoices',
<<<<<<< HEAD
        canActivate: [authGuardFn], // Extra protection for invoices route
=======
>>>>>>> 56f6fac8b75807f7fd3dee5d92ce0c814333995d
        children: [
          {
            path: 'visa',
            children: [
              {
                path: '',
                loadComponent: () => import('./features/invoices/visa/visa-invoice-list/visa-invoice-list.component').then((c) => c.VisaInvoiceListComponent)
              },
              {
                path: ':id',
                loadComponent: () => import('./features/invoices/visa/visa-invoice-detail/visa-invoice-detail.component').then((c) => c.VisaInvoiceDetailComponent)
              },
              {
                path: 'upload',
                loadComponent: () => import('./features/invoices/visa/visa-invoice-upload/visa-invoice-upload.component').then((c) => c.VisaInvoiceUploadComponent)
              },
              {
                path: 'csv-upload',
                loadComponent: () => import('./features/invoices/visa/visa-invoice-upload/visa-invoice-upload.component').then((c) => c.VisaInvoiceUploadComponent)
              },
              {
                path: 'summary',
                loadComponent: () => import('./features/invoices/visa/visa-summary/visa-summary.component').then((c) => c.VisaSummaryComponent)
              },
              {
                path: 'breakdown',
                loadComponent: () => import('./features/invoices/visa/visa-summary/visa-summary.component').then((c) => c.VisaSummaryComponent)
              }
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
                path: ':id',
                loadComponent: () => import('./features/invoices/mastercard/mastercard-invoice-detail/mastercard-invoice-detail.component').then((c) => c.MastercardInvoiceDetailComponent)
              },
              {
                path: 'upload',
                loadComponent: () => import('./features/invoices/mastercard/mastercard-invoice-upload/mastercard-invoice-upload.component').then((c) => c.MastercardInvoiceUploadComponent)
              },
              {
                path: 'csv-upload',
                loadComponent: () => import('./features/invoices/mastercard/mastercard-invoice-upload/mastercard-invoice-upload.component').then((c) => c.MastercardInvoiceUploadComponent)
              },
              {
                path: 'summary',
                loadComponent: () => import('./features/invoices/mastercard/mastercard-invoice-list/mastercard-invoice-list.component').then((c) => c.MastercardInvoiceListComponent)
              },
              {
                path: 'breakdown',
                loadComponent: () => import('./features/invoices/mastercard/mastercard-invoice-list/mastercard-invoice-list.component').then((c) => c.MastercardInvoiceListComponent)
              }
            ]
          }
        ]
      },
      {
        path: 'csv-files',
<<<<<<< HEAD
        canActivate: [authGuardFn], // Extra protection for csv-files route
=======
>>>>>>> 56f6fac8b75807f7fd3dee5d92ce0c814333995d
        children: [
          {
            path: '',
            loadComponent: () => import('./features/csv/csv-file-list/csv-file-list.component').then((c) => c.CsvFileListComponent)
          },
          {
            path: 'visa/:csvName',
            loadComponent: () => import('./features/csv/csv-file-list/csv-file-list.component').then((c) => c.CsvFileListComponent)
          },
          {
            path: 'mastercard/:csvName',
            loadComponent: () => import('./features/csv/csv-file-list/csv-file-list.component').then((c) => c.CsvFileListComponent)
          }
        ]
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./features/others/sample-page/sample-page.component').then((c) => c.SamplePageComponent)
      }
    ]
  },
  {
    path: '**',
    component: AdminComponent,
    canActivate: [authGuardFn],
    children: [
      {
<<<<<<< HEAD
        path: '',
        redirectTo: '/dashboard/default',
        pathMatch: 'full'
=======
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then((c) => c.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/signup/signup.component').then((c) => c.SignupComponent)
      },
      {
        path: 'verify-email',
        loadComponent: () => import('./features/auth/verify-email/verify-email.component').then((c) => c.VerifyEmailComponent)
      },
      {
        path: 'reset-password',
        loadComponent: () => import('./features/auth/reset-password/reset-password.component').then((c) => c.ResetPasswordComponent)
      },
      {
        path: 'request-password-reset',
        loadComponent: () => import('./features/auth/request-password-reset/request-password-reset.component').then((c) => c.RequestPasswordResetComponent)
>>>>>>> 56f6fac8b75807f7fd3dee5d92ce0c814333995d
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
