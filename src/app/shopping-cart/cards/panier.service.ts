import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
providedIn: 'root'
})
export class PanierService {
private apiURL = "http://localhost:3004/lignepanier";
httpOptions = {
headers: new HttpHeaders({
'Content-Type': 'application/json'
})
}

constructor(private httpClient: HttpClient) { }

getLignePanierById(id: number): Observable<any> {
    return this.httpClient.get<any>(`${this.apiURL}/getLignePanierById/${id}`);
  }
}