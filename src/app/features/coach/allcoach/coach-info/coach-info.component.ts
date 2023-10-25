import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RegistrationUpdateDeleteEditService } from 'src/app/features/sharedServices/registration-update-delete-edit.service';
import { Coach } from 'src/app/shared/interfaces/coach';
import { Plan } from 'src/app/shared/interfaces/plan';

@Component({
  selector: 'app-coach-info',
  templateUrl: './coach-info.component.html',
  styleUrls: ['./coach-info.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class CoachInfoComponent implements OnInit {
  public coach!: Coach;
  public selectedPlan:Plan|null = null;
  constructor(
    private route: ActivatedRoute,
    private service: RegistrationUpdateDeleteEditService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const coachId = +this.route.snapshot.paramMap.get('id')!;
    this.service.getUserOrCoach(coachId, 'coaches').subscribe((res: Coach) => {
      this.coach = res;
    });
  }
  showPlanDetails(plan: Plan) {
    if (this.selectedPlan && this.selectedPlan.name === plan.name) {
      this.selectedPlan = null;
    } else {
      this.selectedPlan = plan;
    }
  }
  sanitizeUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
  
}
