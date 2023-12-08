import { NgModule } from '@angular/core';
import { LogInComponent } from './log-in/log-in.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CoreRouting } from './core-routing.module';


@NgModule({
  declarations: [LogInComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CoreRouting,

  ],
  providers: [],
  exports: [LogInComponent],
})
export class CoreModule {}
