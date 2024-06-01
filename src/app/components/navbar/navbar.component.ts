import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/_service/auth.service';
import { CardsComponent } from 'src/app/shopping-cart/cards/cards.component';
import { PanierComponent } from 'src/app/shopping-cart/cards/panier/panier.component';
import { EnchersServiceService } from 'src/app/enchers-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoriesService } from 'src/app/categories.service';
import { PanierService } from 'src/app/shopping-cart/cards/panier.service';
import { PartEnService, Part_En } from 'src/app/part-en.service';
import html2canvas from 'html2canvas';
import { Database, getDatabase, ref, set, onValue  } from "firebase/database";
import jsPDF from 'jspdf';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Message, MessageService } from 'src/app/message.service';
import { User } from 'src/app/_service/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Chat } from 'src/app/message/message.component';
import { FirebaseApp } from '@angular/fire/app';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/app/environments/environment';
import { NotFoundComponent } from 'src/app/pages/not-found/not-found.component';
interface Enchere {
  id?: number;
  dateDebut: string;
  dateFin: string;
  parten: Part_En[];
  admin: { id: number };
  articles: { id: number }[];
  etat:string;
 
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
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showMessages = false;
    }
  }
  panierDetails: any[] = [];
  chats: Chat[] = [];
  public categoryArticles: Article[] = [];
  token = new BehaviorSubject<string | null>(null);
  public collapsed = true;
  showMessagePanel: boolean = false;
  
  encheres: Enchere[] = []; // Initialisez le tableau des enchères
  loading: boolean = false; // Initialisez le chargement des données
  showCart: boolean = false;
  orderFinished = false;
  @ViewChild('productsC')
  productsC!: CardsComponent;
  cheminImage: string = '';
  @ViewChild('shoppingCartC')
  shoppingCartC!: PanierComponent;
  showMessages: boolean = false;
  images: string[] = ['assets/image1.jpg', 'assets/image2.jpg', 'assets/image3.jpg'];
  currentImageIndex: number = 0;
    searchValue: string | null = null;
    menuOpened: boolean = false;
    currentPath: string | null = '';
  userData: User | null = null;
    userMenu: boolean = false;
    showUserInfo = false;
    urlPattern = new RegExp('^(https?:\\/\\/)?' + // Protocole
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // Nom de domaine
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // Ou une adresse IP (v4) 
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // Port et chemin
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // Paramètres de requête
    '(\\#[-a-z\\d_]*)?$', 'i'); // Fragment
    photoNom: string = '';
    userType: string | string[] | null;
    public panierItems: any[] = [];
    showCartDetails: boolean = false;
    nomImage$: Observable<string> | undefined;
    nom: string | null = null; // Définissez le nom de l'utilisateur ici
    photoUrl: string = '';
    messages: Message[] = [];
    firstThreeMessages = this.chats.slice(0, 3);
    form: FormGroup;
    app: FirebaseApp;
    db: Database;
    username = ''; // Contient le nom de l'utilisateur connecté
    message = '';
    capitalizedPassword: string = '';
  constructor(
    public authService: AuthService,
    private router: Router,public panierService: PanierService,private elementRef: ElementRef,
    private authenticationService: AuthService, private encherService :  EnchersServiceService,
    private snackBar: MatSnackBar, private  partEnService : PartEnService,
    private enchereService: EnchersServiceService,private categoriesService:CategoriesService,
    private messageService: MessageService , private formBuilder: FormBuilder,
  ) {
    this.app = initializeApp(environment.firebaseConfig);
    this.db = getDatabase(this.app);
    this.form = this.formBuilder.group({
      'message': [],
      'username': [this.username], // Définir le nom d'utilisateur par défaut
      'userreceive': [null], // Initialiser userreceive à null
    });
   
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
    this.form = this.formBuilder.group({
      'message': ['', Validators.required],
    });
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      console.log("storedTokennnn",storedToken);
      const tokenPayload = JSON.parse(atob(storedToken.split('.')[1]));
      console.log(tokenPayload);
      if (tokenPayload.sub) {
        const username = tokenPayload.sub;
        console.log('Nom utilisateur :', username);
    } else {
        console.log('Aucun nom d\'utilisateur trouvé dans le token');
    }
      this.token.next(storedToken);

    }
  }
  
  isAdmin: boolean = false;
  isLoggedInn: boolean = false;
  ngOnInit() {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      console.log("storedTokennnn",storedToken);
      const tokenPayload = JSON.parse(atob(storedToken.split('.')[1]));
      console.log(tokenPayload);
      if (tokenPayload.sub) {
        const username = tokenPayload.sub;
        console.log('Nom utilisateur :', username);
    } else {
        console.log('Aucun nom d\'utilisateur trouvé dans le token');
    }
      this.token.next(storedToken);
      //this.decodeToken();
    }
    setInterval(() => {
      this.changeImage();
    }, 5000); 
    this.getAllEncheres();
    this.getUserPhoto();
    //this.getPartenIdByUserId();
    console.log("this.nom", this.nom);
    this.capitalizeFirstLetter();
    const chatsRef = ref(this.db, 'chats');
    onValue(chatsRef, (snapshot: any) => {
      const data = snapshot.val();
      for (let id in data) {
        if (!this.chats.map(chat => chat.id).includes(id)) {
          this.chats.push(data[id])
        }
      }
    });
   
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
          this.updateUserStatusAndRedirect();
      }
  });
  }
 /* updateUserStatusAndRedirect() {
    this.isLoggedInn = this.authService.isLoggedIn();
    this.isAdmin = this.authService.isAdmin();
    this.userType = this.authService.getUserType();
    this.currentPath = this.router.url;

    console.log("vvv", this.userType);

    // Vérifiez que userType est une chaîne avant de faire la comparaison
    if (typeof this.userType === 'string' && this.userType === 'user' && (
        this.currentPath === '/article' || 
        this.currentPath === '/categorie' || 
        this.currentPath === '/demande-vendeur' ||
        this.currentPath === '/commentaires' || 
        this.currentPath === '/signalisation' || 
        this.currentPath === '/header' ||
        this.currentPath === '/overview' || 
        this.currentPath === '/users' ||
        this.currentPath.startsWith('/admin'))) {
            this.router.navigate(['/']);
    } else if (this.isAdmin && this.isOnAdminDashboard() ) {
        // Laissez les administrateurs accéder à tous les chemins dans la méthode isOnAdminDashboard
        return;
    } else   if (typeof this.userType === 'string' && this.userType === 'vendeur' && (
        this.currentPath === '/article' || 
        this.currentPath === '/categorie' || 
        this.currentPath === '/demande-vendeur' ||
        this.currentPath === '/commentaires' || 
        this.currentPath === '/signalisation' || 
        this.currentPath === '/header' ||
        this.currentPath === '/overview' || 
        this.currentPath === '/users'||
        this.currentPath.startsWith('/admin'))) {
        this.router.navigate(['/']);
    }
}*/
updateUserStatusAndRedirect() {
  this.isLoggedInn = this.authService.isLoggedIn();
  this.isAdmin = this.authService.isAdmin();
  this.userType = this.authService.getUserType();
  this.currentPath = this.router.url;

  console.log("vvv", this.userType);

  // Vérifiez que userType est une chaîne avant de faire la comparaison
  if (typeof this.userType === 'string') {
      if ((this.userType === 'user' || this.userType === 'vendeur') && (
          this.currentPath === '/article' || 
          this.currentPath === '/categorie' || 
          this.currentPath === '/demande-vendeur' ||
          this.currentPath === '/commentaires' || 
          this.currentPath === '/signalisation' || 
          this.currentPath === '/header' ||
          this.currentPath === '/overview' || 
          this.currentPath === '/users' ||
          this.currentPath.startsWith('/admin'))) {
              this.router.navigate(['/home']);
              return;
      } else if (!this.isAdmin && !this.isOnAllowedPaths()) {
          this.router.navigate(['/not-found']);
          return;
      }
  }

  if (this.isAdmin && this.isOnAdminDashboard()) {
      // Laissez les administrateurs accéder à tous les chemins dans la méthode isOnAdminDashboard
      return;
  }
}
isOnAllowedPaths(): boolean {
  return !!this.currentPath && (
      this.currentPath.startsWith('/home') || 
      this.currentPath.startsWith('/profile') || 
      this.currentPath.startsWith('/about') 
      // Ajoutez ici d'autres chemins accessibles à tous les utilisateurs
  );
}
  notFound: boolean = false;
  currentRouteIsNotCategoryOrArticle(): boolean {
    const currentRoute = this.router.url;
    return !currentRoute.includes('/categorie') && !currentRoute.includes('/article');
  }
  
  isLoginOrSignup(): boolean {
    return this.currentPath === '/register' || this.currentPath === '/login';
  }
  
  
  isOnAdminDashboard(): boolean {
    return !!this.currentPath && (
           this.currentPath.startsWith('/admin') || 
           this.currentPath.startsWith('/overview') || 
           this.currentPath.startsWith('/users') || 
           this.currentPath.startsWith('/header') || 
           this.currentPath.startsWith('/enchers') || 
           this.currentPath.startsWith('/article') || 
           this.currentPath.startsWith('/categorie') || 
           this.currentPath.startsWith('/demande-vendeur') || 
           this.currentPath.startsWith('/commentaires') ||
           this.currentPath.startsWith('/signalisation')||
           this.currentPath.startsWith('/**')
          );
  }
  toggleMessages() {
    this.showMessages = !this.showMessages;
  }
  capitalizeFirstLetter(): void {
    const password = this.authService.getUserPassword();
    // Vérifiez si la valeur est définie et non vide
    if (password) {
      // Capitalisez la première lettre de la chaîne de caractères
      this.capitalizedPassword = password.charAt(0).toUpperCase() + password.slice(1);
    }
  }

  
  showAllMessages() {
    // Modifier le nombre de messages affichés
    this.showMessages = false;
  }
  
  sendMessage() {
    if (this.form.valid) {
      const message = this.form.value.message;
      // Envoyez le message (ou implémentez la logique appropriée)
      console.log("Sending message:", message);
      // Réinitialisez le formulaire
      this.form.reset();
    }
  }
  
  getMessages() {
    const chatsRef = ref(this.db, 'chats');
    onValue(chatsRef, (snapshot: any) => {
      const data = snapshot.val();
      for (let id in data) {
        if (!this.chats.map(chat => chat.id).includes(id)) {
          this.chats.push(data[id]);
        }
      }
      this.getFirstThreeMessages();
    });
  }

  getFirstThreeMessages() {
    this.firstThreeMessages = this.chats.slice(0, 3);
  }
  

 getUserPhoto(): void {
  console.log("this.nom : ", this.nom);
  this.nom = this.authService.getUserPassword();
  if (this.nom !== null) {
    this.authService.getPhotoByName(this.nom).subscribe(
      (photoUrl: string) => {
        console.log("l'image récupéréeee:", this.photoUrl);
        this.photoUrl = photoUrl;
        console.log("l'image récupérée:", this.photoUrl);
      },
      (error: any) => {
        console.error('Erreur lors de la récupération de l\'URL de l\'image:', error);
      }
    );
  } else {
    console.error('La valeur de this.nom est null. Impossible de récupérer l\'URL de l\'image.');
  }
}

  
  // Méthode pour vérifier si une URL est valide
  isValidURL(url: string): boolean {
    const urlPattern = new RegExp('^(https?:\\/\\/)?([a-z0-9-]+\\.)+[a-z]{2,}([\\/\\?#].*)?$', 'i');
    return urlPattern.test(url);
  }
  
  getPanierDetails(partenId: number) {
    this.panierService.getPanierAvecIdPartenaire(partenId).subscribe(
      (panier: any[]) => {
        console.log("Panier reçu du backend :", panier); // Ajout d'un message de débogage pour afficher le panier reçu
  
        if (panier && panier.length > 0) {
          this.panierDetails = panier;
        } else {
          console.error("Le panier est indéfini ou vide.");
        }
  
        // Vérifier également si les articles sont définis
        if (panier && panier.length > 0 && panier[0].parten && panier[0].parten.panier) {
          console.log("Articles du panier reçus du backend :", panier[0].parten.panier); // Ajout d'un message de débogage pour afficher les articles du panier
        } else {
          console.error("Les articles du panier sont indéfinis.");
        }
      },
      (error: any) => {
        console.error("Erreur lors de la récupération du panier :", error);
      }
    );
  }
  
  getPanierAvecIdPartenaire(partenId: number) {
    this.panierService.getPanierAvecIdPartenaire(partenId).subscribe(
      (panier: any) => {
        if (panier && panier.items) {
          console.log("this.panierDetails =", panier);
          console.log("this.panierDetails.items =", panier.items);
          this.panierDetails = panier;
        } else {
          // Gérer le cas où 'panier' ou 'panier.items' est undefined
          console.error("Le panier ou les articles du panier sont indéfinis.");
        }
      },
      (error: any) => {
        console.error("Erreur lors de la récupération du panier :", error);
      }
    );
  }
  
  showCartModal: boolean = false;
  
  getPartenIdByUserId() {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const tokenPayload = JSON.parse(atob(storedToken.split('.')[1]));
      if (tokenPayload.sub) {
        const username = tokenPayload.sub;
        this.encherService.findUserIdByNom(username).subscribe(
          userId => {
            console.log('ID de l\'utilisateur trouvé :', userId);
            // Maintenant, vous avez l'ID de l'utilisateur, vous pouvez récupérer le partenaire ID
            this.partEnService.getPartenIdByUserId(userId).subscribe(
              partenId => {
                console.log('ID du partenaire trouvé :', partenId);
                // Une fois que vous avez récupéré l'ID du partenaire, vous pouvez appeler la méthode pour récupérer le panier avec cet ID
                this.getPanierDetails(partenId);
              },
              error => {
               // console.error('Erreur lors de la récupération de l\'ID du partenaire :', error);
              }
            );
          },
          error => {
            console.error('Erreur lors de la récupération de l\'ID de l\'utilisateur :', error);
          }
        );
      }
    }
  }
  nombreEncheresEnCours: number = 0;
  nombreEncheresTerminer: number = 0;
  countEncheresEnCours() {
    const encheresEnCours = this.encheres.filter((enchere: Enchere) => enchere.etat === 'en cours');
    this.nombreEncheresEnCours = encheresEnCours.length;
  }
  countEncheresTerminer() {
    // Filtrer les enchères pour ne garder que celles qui sont terminées
    const encheresTerminer = this.encheres.filter((encheree: Enchere) => encheree.etat === 'termine');
    
    // Mettre à jour le nombre d'enchères terminées
    this.nombreEncheresTerminer = encheresTerminer.length;
  }
  

getAllEncheres() {
  this.loading = true;
  this.enchereService.getAllEncheres().subscribe(
    (encheres: Enchere[]) => {
      this.encheres = encheres;
      this.loading = false;
      this.countEncheresEnCours();
      this.countEncheresTerminer();
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
addToCart(article: any) {
  // Récupérer l'ID de l'utilisateur
  const storedToken = localStorage.getItem('token');
  if (storedToken) {
      const tokenPayload = JSON.parse(atob(storedToken.split('.')[1]));
      if (tokenPayload.sub) {
          const username = tokenPayload.sub;
          // Trouver l'ID de l'utilisateur par son nom d'utilisateur
          this.encherService.findUserIdByNom(username).subscribe(
              userId => {
                  console.log('ID utilisateur trouvé :', userId);
                  // Une fois que vous avez l'ID de l'utilisateur, récupérez l'ID du partenaire
                  this.partEnService.getPartenIdByUserId(userId).subscribe(
                      partnerId => {
                          console.log('ID partenaire trouvé :', partnerId);
                          // Appelez votre service pour obtenir les paniers associés au partenaire
                          this.panierService.getPaniersByPartenaire(partnerId).subscribe(
                              (carts: any[]) => {
                                  // Vérifiez si les paniers existent
                                  if (carts && carts.length > 0) {
                                      // Sélectionnez le premier panier du tableau
                                      const cart = carts[0];
                                      console.log("Quantité de l'article :", article.quantite);
                                      
                                      // Vérifiez si la quantité dans le panier ne dépasse pas la quantité disponible
                                      this.panierService.containsArticle(cart.id, article.id).subscribe(
                                        (articleExists: boolean) => {
                                          if (articleExists) {
                                            console.log("L'article existe dans le panier.");

                                            // Mettez à jour le panier avec la quantité et le prix de l'article
                                            cart.quantitecde++;
                                            cart.totalP = article.prixvente + cart.totalP;

                                            // Appelez votre service pour mettre à jour le panier
                                            this.panierService.updatePanier(cart.id, cart).subscribe(
                                                (response) => {
                                                    console.log("Panier mis à jour avec succès :", response);
                                                    this.getPanierDetails;
                                            
                                                },
                                                (error) => {
                                                    console.error("Erreur lors de la mise à jour du panier :", error);
                                                }
                                            );
                                          } else {
                                            console.log("L'article n'existe pas dans le panier. Création d'un nouveau panier.",partnerId,cart.id,article);
                                            cart.quantitecde++;
                                            cart.totalP = article.prixvente + cart.totalP;
                                            console.log("existingCart.id",cart.id);
                                            // Appeler le service pour ajouter l'article au panier
                                            this.panierService.addToCart(article.id, cart.id, partnerId).subscribe(
                                              (response) => {
                                                console.log("Article ajouté au panier avec succès:", response);
                                                this.getPanierDetails;
                                     
                                              },
                                              (error) => {
                                                console.error("Erreur lors de l'ajout de l'article au panier:", error);
                                              }
                                            );
              
                                          }
                                        },
                                        (error) => {
                                          console.error("Erreur lors de la vérification de l'article dans le panier :", error);
                                        }
                                      );
                                  } else {
                                      // Créez un nouveau panier pour le partenaire et ajoutez l'article
                                      console.log("L'article n'existe pas dans le panier. Création d'un nouveau panier.",partnerId,article);
                                      this.createCart(partnerId, article);
                                  }
                              },
                              (error) => {
                                  console.error("Erreur lors de la récupération des paniers :", error);
                              }
                          );
                      },
                      error => {
                          //console.error('Erreur lors de la récupération de l\'ID partenaire:', error);
                      }
                  );
              },
              error => {
                  console.error('Erreur lors de la récupération de l\'ID utilisateur:', error);
              }
          );
      }
  }
}

createCart(partnerId: any, article: any) {
  // Créer un nouveau panier pour le partenaire
  this.panierService.addPanier(partnerId).subscribe(
      (newCartId: number) => {
          console.log("Nouveau panier créé avec l'ID :", newCartId);

          // Récupérer le nouveau panier créé depuis le serveur
          this.panierService.getPanierById(newCartId).subscribe(
              (newCart: any) => {
                  console.log("Détails du nouveau panier :", newCart);
                  //  if (newCart.quantitecde < article.quantiter) {
                  newCart.quantitecde++ || 0;
                  // Définir la quantité initiale à 1 et calculer le prix total
                  newCart.quantitecde++;
                  newCart.totalP = article.prixvente + newCart.totalP;

                  // Ajouter l'article au nouveau panier
                  this.panierService.addToCart(article.id, newCartId, partnerId).subscribe(
                      (response) => {
                          console.log("Article ajouté au panier avec succès :", response);
                          this.getPanierDetails;
                      },
                      (error) => {
                          console.error("Erreur lors de l'ajout de l'article au panier :", error);
                      }
                      
                  );
         
              },
              (error) => {
                  console.error("Erreur lors de la récupération des détails du nouveau panier :", error);
              }
          );
      },
      (error) => {
          console.error("Erreur lors de la création du nouveau panier :", error);
      }
  );
}
// Dans NavbarComponent
toggleCartDetails(): void {
  this.showCart = !this.showCart;
}
hideCart() {
  this.showCart = false;
}
openCart() {
  this.showCart = true; // Ouvrir le panier
}


reset() {
this.orderFinished = false;
}

ArticleAdded :any[]=[]


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
  }
  

}