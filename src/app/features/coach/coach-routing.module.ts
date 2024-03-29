import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllcoachComponent } from './allcoach/allcoach.component';
import { CoachRegistrationComponent } from './coach-registration/coach-registration.component';
import { SingleCoachInfoComponent } from './single-coach-info/single-coach-info.component';
import { CoachPageGuard } from './coach-page.guard';



const routes: Routes = [
  { path: 'coach-list', component: AllcoachComponent },  
  { path: 'coach-registration', component: CoachRegistrationComponent },  
  { path: 'single-coach-info/:id', component: SingleCoachInfoComponent },//  canActivate:[CoachPageGuard]

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoachRoutingModule {}
