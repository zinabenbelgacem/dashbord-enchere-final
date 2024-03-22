import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_service/auth.service';

import { ArticleService } from 'src/app/article.service'; // Assurez-vous d'importer le service ArticleService approprié

interface Article {
  id: number;
  titre: string;
  description: string;
  photo: string;
  prix: string;
  livrable: boolean;
  statut: string;
  quantiter: number;
  
}

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesVendeurComponent implements OnInit {
  vendeurId: number = 0; // Initialisation de l'ID du vendeur
  nomVendeur: string = ''; // Ajout de la variable pour le nom du vendeur
  articleForm: FormGroup;
  articles: Article[] = [];
  nomUtilisateur: string | null = null;
  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService, // Utilisation du service ArticleService
    private snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService
  ) {
    this.articleForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      photo: ['', Validators.required],
      prix: ['', Validators.required],
      livrable: [false],
      statut: [''],
      quantiter: [0],
    });
  }

  ngOnInit(): void {
    // Appelez la fonction pour récupérer le nom de l'utilisateur
    this.nomUtilisateur = this.authService.getUserPassword();
  }

  submitArticle() {
    if (this.articleForm.valid) {
      // Ajoutez l'ID du vendeur aux données de l'article
      const articleData = { ...this.articleForm.value, vendeur_id: this.vendeurId };

      this.articleService.addArticle(articleData).subscribe(
        () => {
          this.snackBar.open('Article ajouté avec succès !', 'Fermer', { duration: 3000 });
          this.getAllArticles();
          this.articleForm.reset();
        },
        (error: HttpErrorResponse) => {
          console.error('Erreur lors de l\'ajout de l\'article :', error);
          this.snackBar.open('Erreur lors de l\'ajout de l\'article !', 'Fermer', { duration: 3000 });
        }
      );
    } else {
      this.snackBar.open('Veuillez remplir tous les champs du formulaire.', 'Fermer', { duration: 3000 });
    }
  }

  getAllArticles() {
    this.articleService.getAllArticles().subscribe(
      (articles: Article[]) => {
        this.articles = articles;
      },
      (error: HttpErrorResponse) => {
        console.error('Erreur lors du chargement des articles:', error);
        this.snackBar.open('Erreur lors du chargement des articles!', 'Fermer', {
          duration: 3000
        });
      }
    );
  }

  cancel() {
    this.articleForm.reset();
  }



}
