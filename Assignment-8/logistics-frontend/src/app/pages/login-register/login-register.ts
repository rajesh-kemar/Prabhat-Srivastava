import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

interface AuthResponse {
  token: string;
  username: string;
  role: string;
  id?: number; // ✅ Added this to capture DriverId
}

@Component({
  selector: 'app-login-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './login-register.html',
  styleUrls: ['./login-register.css']
})
export class LoginRegisterComponent {
  username = '';
  password = '';
  role = 'Driver';
  isRegisterMode = false;

  apiUrl = 'http://localhost:5023/api/Auth';

  constructor(private http: HttpClient, private router: Router) {}

  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
  }

  submit() {
    if (this.isRegisterMode) {
      this.registerUser();
    } else {
      this.loginUser();
    }
  }

  private registerUser() {
    this.http.post(`${this.apiUrl}/register`, {
      username: this.username,
      password: this.password,
      role: this.role
    }).subscribe({
      next: () => {
        alert('Registration successful! Please login.');
        this.isRegisterMode = false;
        this.username = '';
        this.password = '';
      },
      error: (err) => alert(err.error || 'Error registering user')
    });
  }

  private loginUser() {
    this.http.post<AuthResponse>(`${this.apiUrl}/login`, {
      username: this.username,
      password: this.password
    }).subscribe({
      next: (res) => {
        if (!res || !res.token) {
          alert('Login failed: no token received');
          return;
        }

        // ✅ Save DriverId (if available) in localStorage
        localStorage.setItem('currentUser', JSON.stringify({
          id: res.id,
          username: res.username,
          role: res.role,
          token: res.token
        }));

        // ✅ Navigate to dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (err) => alert(err.error || 'Invalid login')
    });
  }
}
