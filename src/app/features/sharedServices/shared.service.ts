import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Plan } from 'src/app/shared/interfaces/plan';

@Injectable()
export class SharedService {
  constructor(private router:Router){}
  public likedPlans: string[] = [];
  private creatingPlanSource = new BehaviorSubject<boolean>(false);
  creatingPlan$: Observable<boolean> = this.creatingPlanSource.asObservable();
  private addingExercise = new BehaviorSubject<boolean>(false);
  addingExercise$: Observable<boolean> = this.addingExercise.asObservable();
  private wasChanged = new BehaviorSubject<boolean>(false);
  wasChanged$: Observable<boolean> = this.wasChanged.asObservable();
  private makingPlanForUser = new BehaviorSubject<boolean>(false);
  makingPlanForUser$: Observable<boolean> = this.makingPlanForUser.asObservable();
  public images:string[] = [
    'assets/profile-pictures/default.png',
    'assets/profile-pictures/cat.png',
    'assets/profile-pictures/girl.png',
    'assets/profile-pictures/human.png',
    'assets/profile-pictures/meerkat.png',
    'assets/profile-pictures/man.png',
    'assets/profile-pictures/man2.png',
    'assets/profile-pictures/old-man.png',
    'assets/profile-pictures/panda.png',
    'assets/profile-pictures/woman.png',
    'assets/profile-pictures/woman1.png',
    'assets/profile-pictures/woman2.png',
  ]
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
  generateUniqueId(numberOfCharacters:number): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < numberOfCharacters; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  navigateToPlan(planId: string) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        plan: planId,
      },
    };
    this.router.navigate([`/plan/${planId}`], navigationExtras);
  }
}
