import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BMRCalculatorComponent } from './bmr-calculator/bmr-calculator.component';
import { OneRepMaxComponent } from './one-rep-max/one-rep-max.component';
import { BMIComponent } from './bmi/bmi.component';
import {
  ReactiveFormsModule,
} from '@angular/forms';
import { CalculatorRoutingModule } from './calculate-routing.module';
import { CalculateService } from './service/calculate.service';


@NgModule({
  declarations: [
    BMRCalculatorComponent,
    OneRepMaxComponent,
    BMIComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    CalculatorRoutingModule,
  ],
  providers: [CalculateService],
  exports: [BMRCalculatorComponent, OneRepMaxComponent, BMIComponent],
})
export class CalculatorModule {}
