import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { UserInfoPageComponent } from './components/user-info-page/user-info-page.component';
import { UserRegistrationComponent } from './components/user-registration/user-registration.component';
import { UserRoutingModule } from './user-routing.module';
import { UserPageGuard } from './user-page.guard';
import {AngularFireModule} from '@angular/fire/compat'
import { enviroments } from 'src/app/enviroments/enviroments';



@NgModule({
  declarations: [UserInfoPageComponent,UserRegistrationComponent],
  imports: [ReactiveFormsModule, CommonModule, UserRoutingModule,AngularFireModule.initializeApp(enviroments.firebaseConfig)],
  providers: [UserPageGuard],
  exports: [],
})
export class UserModule {}
