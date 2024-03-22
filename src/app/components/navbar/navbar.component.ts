import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from 'src/app/interfaces/user';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/_service/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  images: string[] = ['assets/image1.jpg', 'assets/image2.jpg', 'assets/image3.jpg'];
currentImageIndex: number = 0;
  searchValue: string | null = null;
  menuOpened: boolean = false;
  currentPath: string | null = '';
  userData: User | null = null;
  userMenu: boolean = false;
  showUserInfo = false;
  userType: string | string[] | null;
  constructor(
    public authService: AuthService,
    private router: Router,
    private authenticationService: AuthService,
    private toastrService: ToastrService
    
  ) {
    this.userType = this.authService.getUserType();
    this.router.events.subscribe((path: any) => {
      this.currentPath = path?.routerEvent?.url;
      this.menuOpened = false;
    });
    this.authenticationService.userDataObs$.subscribe({
      next: (value) => {
        this.userData = value;
      },
    });
  }
  
ngOnInit() {
  setInterval(() => {
    this.changeImage();
  }, 5000); // Change image every 5 seconds
}

  toggleUserInfo() {
    this.showUserInfo = !this.showUserInfo;
    console.log('showUserInfo:', this.showUserInfo);
  }
  changeImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
  }
  toggleMenu() {
    this.menuOpened = !this.menuOpened;
  }

  isLoginOrSignup(): boolean {
    return this.currentPath === '/register' || this.currentPath === '/login';
  }

  isLoggedIn() {
    return this.authenticationService.isLoggedIn();
    
  }

  toggleUserMenu() {
    this.userMenu = !this.userMenu;
  }


  logout() {
    // Clear user data
    localStorage.removeItem('token');
    localStorage.removeItem('type');
    // Refresh the page
    window.location.reload();
    // Optional: Navigate to the login page
    // this.router.navigate(['/login']);
  }
}
