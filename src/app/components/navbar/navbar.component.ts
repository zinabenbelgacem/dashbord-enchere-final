import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from 'src/app/interfaces/user';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/_service/auth.service';
import { CardsComponent } from 'src/app/shopping-cart/cards/cards.component';
import { PanierComponent } from 'src/app/shopping-cart/cards/panier/panier.component';
import { EnchersServiceService } from 'src/app/enchers-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoriesService } from 'src/app/categories.service';
interface Enchere {
  id?: number;
  dateDebut: string;
  dateFin: string;
  parten: { id: number };
  admin: { id: number };
  articles: { id: number }[];
  meetingId?: string; 
}
interface Article {
  id: number;
  titre: string;
  description: string;
  photo: string;
  prix: string;
 // livrable: boolean;
  statut: string; 
 // quantiter: number;

}
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  public categoryArticles: Article[] = [];
public collapsed = true;
nombreEncheresEnCours: number = 0;
encheres: Enchere[] = []; // Initialisez le tableau des enchères
loading: boolean = false; // Initialisez le chargement des données
showCart = false;
orderFinished = false;
@ViewChild('productsC')
productsC!: CardsComponent;

@ViewChild('shoppingCartC')
 shoppingCartC!: PanierComponent;
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
    private toastrService: ToastrService, private snackBar: MatSnackBar,
    private enchereService: EnchersServiceService,private categoriesService:CategoriesService
    
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
  
  this.getAllEncheres();
}

countEncheresEnCours() {
  const now = new Date(); // Obtenez la date actuelle

  // Filtrez les enchères pour ne garder que celles dont la date de début est antérieure à la date actuelle
  const encheresEnCours = this.encheres.filter((enchere: Enchere) => new Date(enchere.dateDebut) < now);

  // Mettez à jour le nombre d'enchères en cours
  this.nombreEncheresEnCours = encheresEnCours.length;
}

getAllEncheres() {
  this.loading = true;
  this.enchereService.getAllEncheres().subscribe(
    (encheres: Enchere[]) => {
      this.encheres = encheres;
      this.loading = false;

      // Comptez le nombre d'enchères en cours
      this.countEncheresEnCours();
    },
    (error: HttpErrorResponse) => {
      console.error('Error fetching encheres:', error);
      this.loading = false;
      this.snackBar.open('Error loading encheres!', 'Close', {
        duration: 3000
      });
    }
  );
}

finishOrder(orderFinished: any) {
  this.orderFinished = orderFinished;
  if (this.orderFinished===false){
  this.ArticleAdded.map((p)=>{
  p.quantiter=0;
  })
  this.ArticleAdded =[]
  }
}


// Dans NavbarComponent
toggleCartDetails(): void {
  this.showCart = !this.showCart;
}



reset() {
this.orderFinished = false;
}

ArticleAdded :any[]=[]

addProductToCart(product:any) {
let existe=false;
this.ArticleAdded.map((p)=>{
if(p.product._id===product.product._id) {existe=true}
})
if(existe===false) this.ArticleAdded.push(product);
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
