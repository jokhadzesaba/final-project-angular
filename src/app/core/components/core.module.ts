import { NgModule } from '@angular/core';
import { LogInComponent } from './log-in/log-in.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CoreRouting } from './core-routing.module';
import { FooterComponent } from './footer/footer.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';

@NgModule({
  declarations: [LogInComponent, FooterComponent, WelcomePageComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CoreRouting],
  providers: [],
  exports: [LogInComponent, FooterComponent, WelcomePageComponent],
})
export class CoreModule {}
