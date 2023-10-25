import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RegistrationUpdateDeleteEditService } from '../../sharedServices/registration-update-delete-edit.service';
import { Coach } from 'src/app/shared/interfaces/coach';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-allcoach',
  templateUrl: './allcoach.component.html',
  styleUrls: ['./allcoach.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllcoachComponent implements OnInit {
  public allCoach?: Observable<Coach[]>;
  public userId?: number;
  public showPlanRequestForm: boolean = false;
  constructor(
    private service: RegistrationUpdateDeleteEditService,
    private router: Router
  ) {}
  ngOnInit(): void {
      this.allCoach = this.service.loadCoaches()
      this.service.loggedUser.subscribe((res) => (this.userId = res.id));
      console.log(this.allCoach);
      
  
  }
  navigateToCoach(coachId: number) {
    this.router.navigate(['/coach-info', coachId]);
  }
  openPlanRequestForm() {
    this.showPlanRequestForm = true;
  }
  requestPlan(coachId: number, description: string) {
    const requestId = this.generateUniqueId(); 
    this.service.sendPlanRequest(this.userId!, coachId, description, requestId);
    this.showPlanRequestForm = false;
  }
  generateUniqueId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  
}
