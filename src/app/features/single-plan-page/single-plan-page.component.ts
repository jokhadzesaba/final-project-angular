import { ChangeDetectionStrategy, NgZone, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Plan } from 'src/app/shared/interfaces/plan';
import { RegistrationUpdateDeleteEditService } from '../sharedServices/registration-update-delete-edit.service';
import { Coach } from 'src/app/shared/interfaces/coach';
import { Observable, map } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-single-plan-page',
  templateUrl: './single-plan-page.component.html',
  styleUrls: ['./single-plan-page.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class SinglePlanPageComponent implements OnInit{
  plan$!: Observable<Plan>;
  coach$!: Observable<Coach>;
  showFullDescription = false;

  constructor(private route: ActivatedRoute, private service: RegistrationUpdateDeleteEditService,
    private sanitizer: DomSanitizer,) {}

  ngOnInit() {
    const coachId = Number(this.route.snapshot.queryParamMap.get('coach'));
    const planId = this.route.snapshot.queryParamMap.get('plan');

    this.coach$ = this.service.getUserOrCoach(coachId, 'coaches');
    this.plan$ = this.coach$.pipe(
      map((coach: Coach) => coach.plans?.find(e => e.planId === planId)!)
    );
  }
  sanitizeUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
    
  }
  
}
