import { ChangeDetectionStrategy, ChangeDetectorRef, NgZone, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Plan } from 'src/app/shared/interfaces/plan';
import { RegistrationUpdateDeleteEditService } from '../sharedServices/registration-update-delete-edit.service';
import { Coach } from 'src/app/shared/interfaces/coach';
import { Observable, catchError, map, timeout } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-single-plan-page',
  templateUrl: './single-plan-page.component.html',
  styleUrls: ['./single-plan-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SinglePlanPageComponent implements OnInit {
  public coach!: Coach;
  public showFullDescription = false;
  public plan!: Plan;
  public loadingError?:boolean = false
  

  constructor(
    private route: ActivatedRoute,
    private service: RegistrationUpdateDeleteEditService,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    const planId = this.route.snapshot.queryParamMap.get('plan');
    console.log(planId);
    
    this.service.loadCoaches().subscribe((coch) => {
      const coaches = Object.values(coch);
      this.loadingError = false
      for (let coach of coaches) {
        for (let id of coach.plans!) {
          if (planId === id.planId) {
            this.plan = id;
            this.coach = coach
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
