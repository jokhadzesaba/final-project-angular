import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class SharedService {
  private creatingPlanSource = new BehaviorSubject<boolean>(false);
  creatingPlan$: Observable<boolean> = this.creatingPlanSource.asObservable();

  setCreatingPlan(value: boolean): void {
    this.creatingPlanSource.next(value);
  }
}
