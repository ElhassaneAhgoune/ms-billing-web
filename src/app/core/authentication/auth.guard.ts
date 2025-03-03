import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateFn } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  // Implementation as a method that returns a CanActivateFn
  canActivate: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
    // Check if the user is authenticated
    if (this.authService.isAuthenticated) {
      return true;
    }

    // User is not authenticated, redirect to login page with the return url
    this.router.navigate(['/'], {
      queryParams: { returnUrl: state.url }
    });
    
    return false;
  }
}

// Function to use the guard in Angular 19 functional style
export function authGuardFn(
  router: Router,
  authService: AuthService
): CanActivateFn {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    if (authService.isAuthenticated) {
      return true;
    }

    router.navigate(['/'], {
      queryParams: { returnUrl: state.url }
    });
    
    return false;
  };
}