import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { RegistrationUpdateDeleteEditService } from '../sharedServices/registration-update-delete-edit.service';
import { Observable } from 'rxjs';
import { Plan } from 'src/app/shared/interfaces/plan';
import { Router, NavigationExtras } from '@angular/router';
import { SharedService } from '../sharedServices/shared.service';
import { planWithCoachInfo } from 'src/app/shared/interfaces/coachPlanType';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainPageComponent implements OnInit {
  public data: planWithCoachInfo[] = [];
  public status$!: Observable<String>;
  public selectedSortOption = ''
  constructor(
    private service: RegistrationUpdateDeleteEditService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private sharedService:SharedService
  ) {}

  ngOnInit() {
    this.status$ = this.service.status;
      this.service.loadCoaches().subscribe((coaches) => {
         for(let i of Object.values(coaches)){
          for(let j of i.plans!){
            if (j.planId!== 'placeholder') {
              const planAndCoach:planWithCoachInfo = {coach: {...i}, plan:{...j} }
              this.data.push(planAndCoach)
            }
          }
         }
         this.service.getUserOrCoach(this.service.firebaseId, 'users').subscribe((user)=>{
            user.likedPlans?.forEach(plan => this.sharedService.likedPlans.push(plan.planId))
         })
        this.sortBy('recent')     
        this.cd.detectChanges();
      });

  }
  sortPlans(){
    if (this.selectedSortOption === 'popular') {
      this.sortBy('ascending')
    }else if(this.selectedSortOption === 'unpopular'){
      this.sortBy('descending')
    }else if(this.selectedSortOption === 'recent'){
      this.sortBy('recent')
    }else if(this.selectedSortOption === 'oldest'){
      this.sortBy('oldest')
    }
    this.cd.detectChanges()
  }
  sortBy(direction:"ascending" | "descending" | "recent" | "oldest"){
    if (direction === 'ascending') {
      this.data.sort((a,b) => b.plan.likes! - a.plan.likes!)
    }else if(direction === 'descending'){
      this.data.sort((a,b) => a.plan.likes! - b.plan.likes!)
    }else if(direction === 'recent'){
      this.data.sort((a,b) => new Date(b.plan.creationDate).getTime() - new Date(a.plan.creationDate).getTime())
    }else{
      this.data.sort((a,b) => new Date(a.plan.creationDate).getTime() - new Date(b.plan.creationDate).getTime())
    }
  }

  isPlanLiked(plan: Plan) {
    return this.sharedService.likedPlans.some((e) => e === plan.planId);
  }
  likePlan(plan: Plan, coachId:string) {
    this.service.likePlan(plan,coachId).subscribe(() => {
      this.sharedService.likedPlans.push(plan.planId);
      this.cd.detectChanges();
    });
  }

  unlikePlan(plan: Plan, coachId:string) {
    this.service.unlikePlan(plan, coachId).subscribe(() => {
      this.sharedService.likedPlans = this.sharedService.likedPlans.filter((e) => e !== plan.planId);
      this.cd.detectChanges();
    });
  }
  navigate(plan: Plan) {
    this.sharedService.navigateToPlan(plan.planId)
  }
  timeConvert(date:Date):String{
    return this.sharedService.convertTime(date)

  }
}
