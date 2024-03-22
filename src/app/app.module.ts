import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExercisesComponent } from './features/exercises/exercises.component';
import { TopBarComponent } from './core/components/top-bar/top-bar.component';
import { CommonModule } from '@angular/common';
import { CoreModule } from './core/components/core.module';
import { CalculatorModule } from './features/calculators/calculate.module';
import { CoachModule } from './features/coach/coach.module';
import { UserModule } from './features/user/user.module';
import { MainModule } from './features/main-page/main.module';
import { ErrorPageComponent } from './shared/sharedComponent/error-page/error-page.component';
import { SharedService } from './features/sharedServices/shared.service';
import { SinglePageModule } from './features/single-plan-page/single-plan.module';
import { CostumValidators } from './shared/validators';





@NgModule({
  declarations: [
    AppComponent,
    ExercisesComponent,
    TopBarComponent,
    ErrorPageComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    CoreModule,
    CalculatorModule,
    CoachModule,
    UserModule,
    MainModule,
    SinglePageModule,
    
    
  ],
  providers: [SharedService,CostumValidators],
  bootstrap: [AppComponent]
})
export class AppModule { }
