import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DisplayExercisesService {

  private url = 'https://zylalabs.com/api/392/exercise+database+api/310/list+exercise+by+body+part';
  private headers = new HttpHeaders({
    'Authorization': 'Bearer 2534|6WH4CN6n9hDlwnkqosySDzFJEABNRXw3yrexkquh'
  });

  constructor(private http: HttpClient) { }

  getExercises(bodyPart: string) {
    return this.http.get(`${this.url}?bodyPart=${bodyPart}`, {headers:this.headers});
  }
}
