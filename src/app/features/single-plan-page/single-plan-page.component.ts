import { ChangeDetectionStrategy, ChangeDetectorRef, NgZone, OnInit } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SinglePlanPageComponent implements OnInit {
  coach!: Coach;
  showFullDescription = false;
  plan!: Plan;

  constructor(
    private route: ActivatedRoute,
    private service: RegistrationUpdateDeleteEditService,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    const planId = this.route.snapshot.queryParamMap.get('plan');
    this.service.loadCoaches().subscribe((coch) => {
      const coaches = Object.values(coch);
      console.log(coaches);
      
      for (let coach of coaches) {
        for (let id of coach.plans!) {
          if (planId === id.planId) {
            this.plan = id;
            this.coach = coach
            console.log(id);
            console.log(coach);
            this.cd.detectChanges()
            break
          }
        }
      }
    });
  }
  sanitizeUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
}
