import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { RegistrationUpdateDeleteEditService } from '../../sharedServices/registration-update-delete-edit.service';
import { Coach } from 'src/app/shared/interfaces/coach';
import { Router } from '@angular/router';
import { SharedService } from '../../sharedServices/shared.service';

@Component({
  selector: 'app-allcoach',
  templateUrl: './allcoach.component.html',
  styleUrls: ['./allcoach.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllcoachComponent implements OnInit {
  public allCoach!: Coach[];
  public showPlanRequestForm: boolean = false;
  constructor(
    private service: RegistrationUpdateDeleteEditService,
    private router: Router,
    private sharedService: SharedService,
    private cd: ChangeDetectorRef
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
    this.service.loadCoaches().subscribe((coaches: Coach[]) => {
      this.allCoach = coaches;
      console.log(this.allCoach);
      this.cd.detectChanges();
    });
  }
  // navigateToCoach(coachId: number) {
  //   this.router.navigate(['/coach-info', coachId]);
  // }
  requestPlan(coachId: string, description: string) {
    const requestId = this.sharedService.generateUniqueId(6);
    this.service.sendPlanRequest(
      this.service.firebaseId,
      coachId,
      description,
      requestId
    );
    this.showPlanRequestForm = false;
  }
}
