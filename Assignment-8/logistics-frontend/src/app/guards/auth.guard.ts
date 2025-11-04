import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    // ✅ Get the current user
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const allowedRoles: string[] = route.data['roles'];

    // Debug logs for troubleshooting
    console.log('Current User:', user);  // Debugging current user data
    console.log('Allowed Roles:', allowedRoles);  // Debugging allowed roles from route

    // 🚫 User is not logged in
    if (!user || !user.role) {
      console.log('User not logged in or role not found. Redirecting to login...');
      this.router.navigate(['/login']);
      return false;
    }

    // 🚫 Role is not allowed for this route
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      console.log(`Role ${user.role} not allowed. Redirecting to home...`);
      this.router.navigate(['/home']);
      return false;
    }

    // ✅ Access allowed
    console.log('Access allowed!');
    return true;
  }
}
