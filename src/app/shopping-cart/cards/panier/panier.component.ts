import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PaiementService } from '../paiement.service';
import { ArticleService } from 'src/app/article.service';
import { PanierService } from '../panier.service';

@Component({
  selector: 'app-panier',
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.css']
})
export class PanierComponent implements OnInit {
  idRequis: number;
  lignePanier: any[] = [];
  collapsed: boolean = true;
  constructor(private ecommService: PaiementService, private panierService: PanierService) { 
    this.idRequis = 0; 
  }
  @Input() ArticleAdded: any;
  total = 0;
  addTotal(prix: number, qte: number) {
    this.total += prix * qte;
  }
  @ViewChild('htmlData') htmlData!: ElementRef;
  @Output() onOrderFinished = new EventEmitter();
  paymentHandler: any = null;
  stripeAPIKey: any =
    'pk_test_51N3okJAtYSZefbGPPzDxn721BdagE4SahC951XgF9EMVF4mcDEibV9FedHowP0S7zxhWKpKs40Yz6qcF59fPxrNJ00XYcmk1cy';

  ngOnInit() {
    this.invokeStripe();
    this.getLignePanierDetails();
  }

  getLignePanierDetails() {
    this.panierService.getLignePanierById(this.idRequis).subscribe((data: any[]) => {
      this.lignePanier = data;
      // Extraire les détails supplémentaires
      this.lignePanier.forEach((item: any) => {
        const lignepanieris = item.lignepanieris;
        const userid = item.userid;
        const date = item.date;
        const totalp = item.totalp;
        console.log(this.lignePanier); 
      });
    });
  }

  checkoutProduct() {
    this.makePayment(this.total, this.ArticleAdded);
  }

  makePayment(total: number, articles: any[]) {
    let amount = total;
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: this.stripeAPIKey,
      locale: 'auto',
      token: (stripeToken: any) => {
        this.processPayment(amount, stripeToken, articles);
      },
    });
    paymentHandler.open({
      name: 'ItSolutionStuff.com',
      description: '3 widgets',
      amount: amount * 100,
    });
  }

  invokeStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: 'pk_test_51H7bbSE2RcKvfXD4DZhu',
          locale: 'auto',
          token: function (stripeToken: any) {
            console.log(stripeToken);
            alert('Payment has been successful!');
          },
        });
      };
      window.document.body.appendChild(script);
    }
  }

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }

  processPayment(amount: any, stripeToken: any, articles: any[]) {
    console.log(stripeToken);
    const data = {
      amount: amount * 100,
      token: stripeToken,
      articles: articles, // Envoyer les détails des articles commandés
      lignepanier: articles.map((article: any) => ({
        id: article.lignepanier.id, // Supposons que lignepanier contient l'ID
        quantitecde: article.quantitecde // Supposons que quantitecde est la quantité commandée
      }))
    }
  }

  openPDF() {
    let Data: any = document.getElementById('htmlData');
    html2canvas(Data).then((canvas) => {
      let fileWidth = 100;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 20;
      PDF.addImage(FILEURI, 'PNG', 50, position, fileWidth, fileHeight);
      PDF.save('cart.pdf');
    });
    this.ecommService.sendPayment(Data).subscribe({
      next: (res: any) => {
        console.log(res);
        alert("Opération effectuée avec succès");
        // imprimer
        this.openPDF();
        // signaler au composant ecommerce que la commande est finie
        this.onOrderFinished.emit(false);
        // Réinitialiser total à 0
        this.total = 0;
      },
      error: (e) => {
        console.log(e);
        alert("Erreur : Opération non effectuée");
      }
    });
  }
}
