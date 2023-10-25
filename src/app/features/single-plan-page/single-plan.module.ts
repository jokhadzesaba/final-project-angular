import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { SinglePlanPageComponent } from './single-plan-page.component';
import { SinglePageRoutingModule } from './single-plan-routing.module';


@NgModule({
  declarations: [SinglePlanPageComponent
  ],
  imports: [CommonModule, SinglePageRoutingModule],
  providers: [],
  exports: [],
})
export class SinglePageModule {}
