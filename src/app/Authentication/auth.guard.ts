import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const access = localStorage.getItem('access');

    if (access === '1') {
      return true; // Allow access if access level is 1
    } else {
      this.router.navigate(['/user-orders']); // Redirect to home if access is 0
      return false;
    }
  }
}
