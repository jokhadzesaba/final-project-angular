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
  public selectedSortOption: string = '';

  sortCoaches() {
    if (this.selectedSortOption === 'popular') {
      this.sortBy('ascending');
    } else if (this.selectedSortOption === 'unpopular') {
      this.sortBy('descending');
    } else if (this.selectedSortOption === 'newest') {
      this.sortBy('recent');
    } else if (this.selectedSortOption === 'oldest') {
      this.sortBy('oldest');
    }
  }
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
  }
  sortBy(order: 'ascending' | 'descending' | 'recent' | 'oldest') {
    this.service.loadCoaches().subscribe((coaches: Coach[]) => {
      let sortedCoaches: [string, Coach][];
      if (order === 'ascending') {
        sortedCoaches = Object.entries(coaches).sort(
          ([, coachA], [, coachB]) => coachB.totalLikes! - coachA.totalLikes!
        );
      } else if (order === 'descending') {
        sortedCoaches = Object.entries(coaches).sort(
          ([, coachA], [, coachB]) => coachA.totalLikes! - coachB.totalLikes!
        );
      } else if (order === 'recent') {
        sortedCoaches = Object.entries(coaches).sort(
          ([, coachA], [, coachB]) =>
            new Date(coachA.registrationDate).getTime() -
            new Date(coachB.registrationDate).getTime()
        );
      } else {
        sortedCoaches = Object.entries(coaches).sort(
          ([, coachA], [, coachB]) =>
            new Date(coachB.registrationDate).getTime() -
            new Date(coachA.registrationDate).getTime()
        );
      }
      this.allCoachKeys = sortedCoaches.map(([key]) => key);
      this.allCoachValues = sortedCoaches.map(([, value]) => value);
      this.cd.detectChanges();
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
  convertTime(date: Date): String {
    return this.sharedService.convertTime(date);
  }
}
