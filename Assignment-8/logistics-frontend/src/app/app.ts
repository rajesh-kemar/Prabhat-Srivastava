import { Component } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  user: any = null;
  showNavbar = true;

  constructor(public router: Router) {}

  ngOnInit() {
    this.loadUser();

    // Watch route changes to hide/show navbar on specific pages
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects;
      // Hide navbar on login/register
      this.showNavbar = !(url.includes('/login') || url.includes('/register'));
      this.loadUser();
    });
  }

  // ✅ Load current user from localStorage
  loadUser() {
    this.user = JSON.parse(localStorage.getItem('currentUser') || 'null');
  }

  // ✅ Logout and clear session
  logout() {
    localStorage.removeItem('currentUser');
    this.user = null;
    this.router.navigate(['/login']);
  }

  // ✅ Go to home page (brand name click)
  navigateHome() {
    this.router.navigate(['/home']);
  }

  // ✅ Navigate to Profile page (username click)
  goToProfile() {
    console.log('Navigating to Profile page...', this.user);
    if (this.user) {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
