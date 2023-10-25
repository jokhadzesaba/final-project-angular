import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SinglePlanPageComponent } from './single-plan-page.component';


const routes: Routes = [
  { path: '', component: SinglePlanPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SinglePageRoutingModule {}
