import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RegistrationUpdateDeleteEditService } from '../../sharedServices/registration-update-delete-edit.service';
import { Coach } from 'src/app/shared/interfaces/coach';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedService } from '../../sharedServices/shared.service';

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
    private router: Router,
    private sharedService:SharedService
  ) {}

  public selectedCoachId?: number;


  openPlanRequestForm(coachId: number) {
    this.selectedCoachId = coachId;
    this.showPlanRequestForm = true;
  }

  cancelPlanRequest() {
    this.selectedCoachId = undefined;
    this.showPlanRequestForm = false;
  }

  ngOnInit(): void {
      this.allCoach = this.service.loadCoaches()
      this.service.loggedUser.subscribe((res) => (this.userId = res.id));
      console.log(this.allCoach);
      
  
  }
  navigateToCoach(coachId: number) {
    this.router.navigate(['/coach-info', coachId]);
  }
  requestPlan(coachId: number, description: string) {
    const requestId = this.sharedService.generateUniqueId(); 
    this.service.sendPlanRequest(this.userId!, coachId, description, requestId);
    this.showPlanRequestForm = false;
  }
  
}
