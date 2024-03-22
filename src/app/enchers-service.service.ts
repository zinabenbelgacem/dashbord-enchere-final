import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { User } from './_service/user'; // Assurez-vous d'importer correctement le modèle User
interface Enchere {
  id?: number;
  dateDebut: string;
  dateFin: string;
  parten: { id: number };
  admin: { id: number };
  articles: { id: number }[];
}
interface Article {
  id: number; // Assurez-vous que le type correspond à votre base de données
  titre: string;
  description: string;
  photo: string;
  prix:string;
  livrable:boolean;
  statut:string;
  quantiter:number;
}
@Injectable({
  providedIn: 'root'
})
export class EnchersServiceService {

 
  constructor(private http: HttpClient) { }

  getAllArticles(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3002/article/getAll`);
  }
  getArticleById(id: number): Observable<Article> {
    return this.http.get<Article>(`http://localhost:3002/article/${id}`);
  }
  getAllPartens(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3002/parten/all`);
  }

  getAllAdmins(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3003/admins`);
  }


  addEnchere(enchere: Enchere): Observable<Enchere> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<Enchere>('http://localhost:3002/enchere/addenchere', enchere)
    .pipe(
      catchError(this.handleError)
    );
  }
  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError('Something bad happened; please try again later.');
  }
  updateEnchere(iden: number, enchere: Enchere): Observable<Enchere> {
    return this.http.post<Enchere>(`http://localhost:3002/enchere/UpdateEnchere/${iden}`, enchere);
  }

  deleteEnchere(iden: number): Observable<string> {
    return this.http.delete<string>(`http://localhost:3002/enchere/deleteEnchere/${iden}`).pipe(
      catchError(this.handleError)
    );
  }
  getAllEncheres(): Observable<Enchere[]> {
    return this.http.get<Enchere[]>('http://localhost:3002/enchere/getallEncheres');
  }

  getEnchereById(id: number): Observable<Enchere> {
    return this.http.get<Enchere>(`http://localhost:3002/enchere/${id}`);
  }

  getEncheresByArticleId(articleId: number): Observable<Enchere[]> {
    return this.http.get<Enchere[]>(`http://localhost:3002/enchere/article/${articleId}`);
  }

  getEncheresByDateFinAfter(date: Date): Observable<Enchere[]> {
    return this.http.get<Enchere[]>(`http://localhost:3002/enchere/datefin/after/${date}`);
  }

  getEncheresByDateDebutBefore(date: Date): Observable<Enchere[]> {
    return this.http.get<Enchere[]>(`http://localhost:3002/enchere/datedebut/before/${date}`);
  }

  getEncheresByDateDebutBetween(dateDebut1: Date, dateDebut2: Date): Observable<Enchere[]> {
    return this.http.get<Enchere[]>(`http://localhost:3002/enchere/datedebut/between/${dateDebut1}/${dateDebut2}`);
  }
}
