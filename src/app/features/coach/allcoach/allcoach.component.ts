import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { RegistrationUpdateDeleteEditService } from '../../sharedServices/registration-update-delete-edit.service';
import { Coach } from 'src/app/shared/interfaces/coach';
import { NavigationExtras, Router } from '@angular/router';
import { SharedService } from '../../sharedServices/shared.service';

@Component({
  selector: 'app-allcoach',
  templateUrl: './allcoach.component.html',
  styleUrls: ['./allcoach.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllcoachComponent implements OnInit {
  public allCoachValues!: Coach[];
  public allCoachKeys!: string[];
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
      this.allCoachValues = Object.values(coaches);
      this.allCoachKeys = Object.keys(coaches);
      this.cd.detectChanges();
    });
    this.service.loadCoaches().subscribe((coach) => {

    });
  }
  navigateToCoach(coachId: string) {
    this.router.navigate([`/single-coach-info/${coachId}`]);
  }
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
