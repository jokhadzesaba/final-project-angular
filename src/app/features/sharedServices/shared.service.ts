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
  public topBarFooterImg:string[] = [
    'assets/fbLogo.jpg',
    'assets/instaLogo.avif',
    'assets/linkedinLogo.png',
    'assets/logo.jpg',
    'assets/menuicon.png'
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
  convertTime(date: Date): String {
    const currentDate = new Date();
    const diff = currentDate.getTime() - new Date(date).getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(weeks / 4.345); // 4.345 weeks in a month on average
    const years = Math.floor(months / 12);
    
    if (years > 0) {
      return years === 1 ? 'a year ago' : `${years} years ago`;
    } else if (months > 0) {
      return months === 1 ? 'a month ago' : `${months} months ago`;
    } else if (weeks > 0) {
      return weeks === 1 ? 'a week ago' : `${weeks} weeks ago`;
    } else if (days > 0) {
      return days === 1 ? 'a day ago' : `${days} days ago`;
    } else if (hours > 0) {
      return hours === 1 ? 'an hour ago' : `${hours} hours ago`;
    } else if (minutes > 0) {
      return minutes === 1 ? 'a minute ago' : `${minutes} minutes ago`;
    } else {
      return 'just now';
    }
  }
}
