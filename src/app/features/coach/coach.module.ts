import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CoachRoutingModule } from './coach-routing.module';
import { AllcoachComponent } from './allcoach/allcoach.component';
import { SingleCoachInfoComponent } from './single-coach-info/single-coach-info.component';
import { CoachInfoComponent } from './allcoach/coach-info/coach-info.component';
import { CoachRegistrationComponent } from './coach-registration/coach-registration.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoachPageGuard } from './coach-page.guard';



@NgModule({
  declarations: [AllcoachComponent,SingleCoachInfoComponent,CoachInfoComponent,CoachRegistrationComponent],
  imports: [ReactiveFormsModule, CommonModule, CoachRoutingModule,SharedModule],
  providers: [CoachPageGuard],
  exports: [],
})
export class CoachModule {}
