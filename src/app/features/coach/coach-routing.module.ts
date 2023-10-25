import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllcoachComponent } from './allcoach/allcoach.component';
import { CoachRegistrationComponent } from './coach-registration/coach-registration.component';
import { SingleCoachInfoComponent } from './single-coach-info/single-coach-info.component';
import { CoachInfoComponent } from './allcoach/coach-info/coach-info.component';
import { CoachPageGuard } from './coach-page.guard';



const routes: Routes = [
  { path: 'coach-list', component: AllcoachComponent },  
  { path: 'coach-registration', component: CoachRegistrationComponent },  
  { path: 'single-coach-info', component: SingleCoachInfoComponent, canActivate:[CoachPageGuard] },  
  { path: 'coach-info/:id', component: CoachInfoComponent },  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoachRoutingModule {}