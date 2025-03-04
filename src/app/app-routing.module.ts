// angular import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Project import
import { AdminComponent } from './theme/layouts/admin-layout/admin-layout.component';
import { GuestLayoutComponent } from './theme/layouts/guest-layout/guest-layout.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard/default',
        pathMatch: 'full'
      },
      {
        path: 'dashboard/default',
        loadComponent: () => import('./features/dashboard/default/default.component').then((c) => c.DefaultComponent)
      },
      // {
      //   path: 'typography',
      //   loadComponent: () => import('./features/component/basic-component/color/color.component').then((c) => c.ColorComponent)
      // },
      // {
      //   path: 'color',
      //   loadComponent: () => import('./features/component/basic-component/typography/typography.component').then((c) => c.TypographyComponent)
      // },
      {
        path: 'sample-page',
        loadComponent: () => import('./features/others/sample-page/sample-page.component').then((c) => c.SamplePageComponent)
      }
    ]
  },
  {
    path: '',
    component: GuestLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then((c) => c.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () =>  import('./features/auth/signup/signup.component').then((c) => c.SignupComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
