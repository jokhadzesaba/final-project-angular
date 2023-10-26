import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class SharedService {
  private creatingPlanSource = new BehaviorSubject<boolean>(false);
  creatingPlan$: Observable<boolean> = this.creatingPlanSource.asObservable();
  private addingExercise = new BehaviorSubject<boolean>(false);
  addingExercise$: Observable<boolean> = this.addingExercise.asObservable();
  private wasChanged = new BehaviorSubject<boolean>(false);
  wasChanged$: Observable<boolean> = this.wasChanged.asObservable();
  private makingPlanForUser = new BehaviorSubject<boolean>(false);
  makingPlanForUser$: Observable<boolean> = this.makingPlanForUser.asObservable();
  makingplanForUser(value: boolean): void {
    this.makingPlanForUser.next(value);
  }
  setCreatingPlan(value: boolean): void {
    this.creatingPlanSource.next(value);
  }
  addexercise(value: boolean): void {
    this.addingExercise.next(value);
  }
  ifchanged(value:boolean):void{
    this.wasChanged.next(value)
  }
  generateUniqueId(): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
