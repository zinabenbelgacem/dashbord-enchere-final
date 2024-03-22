import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Route, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { FeatureComponent } from './components/feature/feature.component';
import { FooterComponent } from './components/footer/footer.component';
import { FilterComponent } from './components/filter/filter.component';
import { SearchComponent } from './components/search/search.component';
//import { ProductCardComponent } from './components/product-card/product-card.component';
import { CartComponent } from './components/cart/cart.component';
import { HeaderComponent } from './admin-dashboard/header/header.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { ToastComponent } from './components/toast/toast.component';
import { JwtModule } from '@auth0/angular-jwt';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ArticlesComponent } from './articles/articles.component';
import { CategoriesComponent } from './categories/categories.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AboutComponent } from './about/about.component';

import { VendeurDashboardComponent } from './vendeur-dashboard/vendeur-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { SidebarComponent } from './admin-dashboard/sidebar/sidebar.component'; 
import { UserEditComponent } from './admin-dashboard/users-routes/edit/edit.component';
import { UserDetailComponent } from './admin-dashboard/users-routes/users-detail/user-detail.component';
import { UtulisateursComponent } from './admin-dashboard/users-routes/users/users.component';
import { NewUserComponent } from './admin-dashboard/users-routes/new-user/new-user.component';
import { OverviewComponent } from './admin-dashboard/overview/overview.component';
import { EnchersComponent } from './admin-dashboard/enchers/enchers.component';
import { EnchersuserComponent } from './enchers/enchers.component';
import { CategoriesAdminComponent } from './admin-dashboard/categories/categories.component';
import { ArticlesAdminComponent } from './admin-dashboard/articles/articles.component';

import { DemandevendeurAdminComponent } from './admin-dashboard/demandevendeur/demandevendeuradmin.component';
import { DemandevendeurComponent } from './vendeur-dashboard/demandevendeur/demandevendeur.component';
import { ArticlesVendeurComponent } from './vendeur-dashboard/articles/articles.component';

const routes: Route[] = [
  {
    path: '',
    component: HomeLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'login', component: LoginComponent },
      { path: 'navbar', component: NavbarComponent },
       {path: 'register',component: RegisterComponent},
      { path: 'articles', component: ArticlesComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'enchere', component: EnchersuserComponent },
      { path: 'about', component: AboutComponent },
      { path: 'demandevendeur', component: DemandevendeurComponent },
    ],
  },
  {
    path: 'vendeur',
    component: HomeLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'login', component: LoginComponent },
      { path: 'navbar', component: NavbarComponent },
      {path: 'register',component: RegisterComponent},
      { path: 'articles', component: ArticlesComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'enchere', component: EnchersuserComponent },
      { path: 'about', component: AboutComponent },
      { path: 'articlesvendeur', component: ArticlesVendeurComponent },
    ],
  },
  {
    path: 'admin',
    component: AdminDashboardComponent,
  },  

      { path: 'overview', component: OverviewComponent },
      { path: 'users', component: UtulisateursComponent}, 
      { path: 'users/:userId/edit', component: UserEditComponent },
      { path: 'users/:id', component: UserDetailComponent },    
      { path: 'admin/users/new', component: NewUserComponent},   
      { path: 'header', component: HeaderComponent },    
      { path: 'enchers', component: EnchersComponent },
      { path: 'article', component: ArticlesAdminComponent },
      { path: 'categorie', component: CategoriesAdminComponent },
     { path: 'demande-vendeur', component: DemandevendeurAdminComponent}, 
    //{ path: '**', component: NotFoundComponent }, // Wildcard route for 404
];

@NgModule({
  declarations: [
    AppComponent,
    ArticlesVendeurComponent,
    ArticlesAdminComponent,
    NotFoundComponent,
    CategoriesAdminComponent,
    LoginComponent,
    ArticlesComponent,
    DemandevendeurAdminComponent,
    CategoriesComponent,
    HomeComponent,
    RegisterComponent,
    NavbarComponent,
    SidebarComponent,
    DemandevendeurComponent,
    NewUserComponent,
    UtulisateursComponent,
    CategoriesComponent,
    OverviewComponent,
    HeaderComponent,
    UserDetailComponent,
    UserEditComponent,
    CarouselComponent,
    FeatureComponent,
    FooterComponent,
    FilterComponent,
    SearchComponent,
   // ProductCardComponent,
    CartComponent,
    ToastComponent,
    DashboardComponent,
    HomeLayoutComponent,
    AdminLayoutComponent,
    AboutComponent,   
    VendeurDashboardComponent,
    AdminDashboardComponent,
    EnchersComponent,
    EnchersuserComponent,
    ArticlesComponent,
    CategoriesComponent,
  ],
  imports: [
    MatSnackBarModule,
    BrowserModule,
    MatCardModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
   //CarouselModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      closeButton: true,
      enableHtml: true,
      easing: 'ease-in-out',
      progressBar: true,
      tapToDismiss: true,
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('token');
        },
      },
    }),
    BreadcrumbModule,
  ],
  providers: [],
  exports: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
