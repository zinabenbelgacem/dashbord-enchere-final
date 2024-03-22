import { Component } from '@angular/core';
import { AuthService } from '../_service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form: any = {
    email: '',
    password: ''
  };

  isLoginFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    this.authService.login(this.form).subscribe(
      (data: any) => {
        this.isLoginFailed = false;
        // Check if the user is an admin
        if (data.type && data.type.includes('admin')) {
          // Redirect to admin dashboard
          this.router.navigate(['/admin']);
        } 
        // Check if the user is a vendeur (vendor)
        else if (data.type && data.type.includes('vendeur')) {
          // Redirect to vendeur dashboard
          this.router.navigate(['/vendeur']);
        }
        else {
          // Redirect to home page for regular users
          this.router.navigate(['/']);
        }
      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }
  

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  reloadPage(): void {
    window.location.reload();
  }
  
}
