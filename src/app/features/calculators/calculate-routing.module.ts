import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BMRCalculatorComponent } from './bmr-calculator/bmr-calculator.component';
import { OneRepMaxComponent } from './one-rep-max/one-rep-max.component';
import { BMIComponent } from './bmi/bmi.component'; 

const routes: Routes = [
  { path: 'one-rep-max', component: OneRepMaxComponent },
  { path: 'bmr', component: BMRCalculatorComponent },
  { path: 'bmi', component: BMIComponent }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalculatorRoutingModule {}
