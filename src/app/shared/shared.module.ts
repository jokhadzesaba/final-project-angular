import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistrationErrorHandlingComponent } from '../sharedComponent/registration-error-handling/registration-error-handling.component';


@NgModule({
  declarations: [RegistrationErrorHandlingComponent,],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [RegistrationErrorHandlingComponent,] // Export the component to be shared
})
export class SharedModule {}
