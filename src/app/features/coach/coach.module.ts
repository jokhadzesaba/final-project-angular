import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoachRoutingModule } from './coach-routing.module';
import { AllcoachComponent } from './allcoach/allcoach.component';
import { SingleCoachInfoComponent } from './single-coach-info/single-coach-info.component';
import { CoachRegistrationComponent } from './coach-registration/coach-registration.component';
import { CoachPageGuard } from './coach-page.guard';
import { Router, RouterModule } from '@angular/router';



@NgModule({
  declarations: [AllcoachComponent,SingleCoachInfoComponent, CoachRegistrationComponent],
  imports: [ReactiveFormsModule, CommonModule, CoachRoutingModule,FormsModule,RouterModule],
  providers: [CoachPageGuard],
  exports: [],
})
export class CoachModule {}
