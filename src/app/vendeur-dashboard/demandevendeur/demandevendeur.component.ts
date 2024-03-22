import { Component } from '@angular/core';
import { Vendeur } from '../vendeur';
import { VendeurService } from 'src/app/vendeur.service';

@Component({
  selector: 'app-demandevendeur',
  templateUrl: './demandevendeur.component.html',
  styleUrls: ['./demandevendeur.component.css']
})
export class DemandevendeurComponent {

  vendeur = new Vendeur();
  messageSuccessVisible: boolean = false;
  messageErreurVisible: boolean = false;
  messageErreur: string = '';

  constructor(private vendeurService: VendeurService) {} // Injection de VendeurService

  envoyerDemandeVendeur() {
    if (this.validerFormulaire()) {
      console.log('Validation du formulaire réussie. Envoi des données du formulaire...');
      this.vendeurService.sendVendeurRequestToAdmin(this.vendeur)
        .subscribe(
          () => {
            console.log('Soumission du formulaire réussie.');
            // Réinitialiser le formulaire et afficher un message de succès
            this.vendeur = new Vendeur();
            this.messageSuccessVisible = true;
          },
          error => {
            console.error('Erreur lors de l\'envoi de la demande :', error);
            // Afficher un message d'erreur approprié à l'utilisateur
            this.messageErreur = 'Une erreur s\'est produite lors de l\'envoi du formulaire. Veuillez réessayer plus tard.';
            this.messageErreurVisible = true;
          }
        );
    } else {
      console.log('Échec de la validation du formulaire. Abandon de la soumission du formulaire.');
    }
  }
  

  validerFormulaire(): boolean {
    // Effectuer la validation du formulaire ici
    if (!this.vendeur.nom || !this.vendeur.prenom || !this.vendeur.type ||
        !this.vendeur.password || !this.vendeur.email || !this.vendeur.tel ||
        !this.vendeur.codePostal || !this.vendeur.pays || !this.vendeur.ville ||
        !this.vendeur.cin || !this.vendeur.longitude || !this.vendeur.latitude ||
        !this.vendeur.photo) {
      this.messageErreur = 'Veuillez remplir tous les champs requis.';
      this.messageErreurVisible = true;
      return false;
    }
    return true;
  }

  annulerFormulaire() {
    this.vendeur = new Vendeur();
  }
}
