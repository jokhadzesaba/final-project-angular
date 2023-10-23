import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserInfoPageComponent } from './components/user-info-page/user-info-page.component';
import { UserRegistrationComponent } from './components/user-registration/user-registration.component';
import { UserRoutingModule } from './user-routing.module';



@NgModule({
  declarations: [UserInfoPageComponent,UserRegistrationComponent],
  imports: [ReactiveFormsModule, CommonModule, UserRoutingModule,SharedModule],
  providers: [],
  exports: [],
})
export class UserModule {}
