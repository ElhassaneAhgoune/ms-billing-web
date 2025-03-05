import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpService } from './services/http.service';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { AuthService } from './authentication/auth.service';
import { AuthGuard } from './authentication/auth.guard';
<<<<<<< HEAD
import { NoAuthGuard } from './authentication/no-auth.guard';
=======
>>>>>>> 56f6fac8b75807f7fd3dee5d92ce0c814333995d
import { RbacService } from './services/rbac.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    HttpService,
    AuthService,
    AuthGuard,
<<<<<<< HEAD
    NoAuthGuard,
=======
>>>>>>> 56f6fac8b75807f7fd3dee5d92ce0c814333995d
    RbacService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
})
export class CoreModule { }
