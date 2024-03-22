import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Vendeur } from 'src/app/vendeur-dashboard/vendeur';
import { VendeurService } from 'src/app/vendeur.service';

@Component({
  selector: 'app-demandevendeuradmin',
  templateUrl: './demandevendeuradmin.component.html',
  styleUrls: ['./demandevendeuradmin.component.css']
})
export class DemandevendeurAdminComponent implements OnInit {
  vendeurs: Vendeur[] = [];
  vendorForm: FormGroup; // Ajouter un type pour vendorForm
  activeRoute: string = ''; 
  constructor(private fb: FormBuilder, private router:Router, private route: ActivatedRoute, private vendeurService: VendeurService) {
    // Initialiser vendorForm dans le constructeur
    this.vendorForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    this.loadPendingVendors();
    this.route.url.subscribe(url => {
      // Extraire la route active des segments d'URL
      this.activeRoute = url[0].path;
    });
  }

  loadPendingVendors() {
    this.vendeurService.getAllVendeurs()
      .subscribe(vendeurs => this.vendeurs = vendeurs);
  }

  approveVendor(vendeur: Vendeur) {
    this.vendeurService.updateVendeur(vendeur.id.toString(), vendeur)
      .subscribe(() => {
        this.vendeurs = this.vendeurs.filter(v => v.id !== vendeur.id);
      });
  }

  rejectVendor(vendeur: Vendeur) {
    this.vendeurService.deleteVendeur(vendeur.id.toString())
      .subscribe(() => {
        this.vendeurs = this.vendeurs.filter(v => v.id !== vendeur.id);
      });
  }

  public currentPath: string | undefined;

  public navigateTo(item: string) {
    this.router.navigate(['/', item]);
  }
   public links: any = [
    {
      title: 'Dashboard',
      items: [
        {
          name: 'overview',
          icon: 'fa-solid fa-house',
        }, {
          name: 'billboards',
          icon: 'fa-brands fa-bandcamp',
        }
      ],
    },

    {
      title: 'Pages',
      items: [
        {
          name: 'users',
          icon: 'fa-solid fa-users',
        }, {
          name: 'enchers',
          icon: 'fa-solid fa-bag-shopping',
        },
        {
          name: 'categorie',
          icon: 'fa-solid fa-dumpster-fire',
        },
        {
          name: 'article',
          icon: 'fa-solid fa-dumpster-fire',
        },
        {
          name: 'demande-vendeur',
          icon: 'fa-solid fa-users',
        },
        {
          name: 'commentaire',
          icon: 'fa-solid fa-comment',
        },
       {
          name: 'tags',
          icon: 'fa-solid fa-tag'
        }
      ],
    },

  ];
}
