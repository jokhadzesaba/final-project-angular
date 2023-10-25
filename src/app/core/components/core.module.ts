import { NgModule } from '@angular/core';
import { LogInComponent } from './log-in/log-in.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CoreRouting } from './core-routing.module';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [LogInComponent],
  imports: [CommonModule, FormsModule,ReactiveFormsModule,CoreRouting,SharedModule],
  providers: [],
  exports:[LogInComponent]
})
export class CoreModule {}
