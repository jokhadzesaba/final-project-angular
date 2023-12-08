import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DisplayExercisesService {

  private url = 'https://exercise-app-9b873-default-rtdb.europe-west1.firebasedatabase.app';
  

  constructor(private http: HttpClient) { }

  getExercises(bodyPart: string) {
    return this.http.get(`${this.url}/exercises/${bodyPart}.json`);
  }
}
