import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserRegistrationComponent } from './components/user-registration/user-registration.component';
import { UserInfoPageComponent } from './components/user-info-page/user-info-page.component';



const routes: Routes = [
  { path: 'user-registration', component: UserRegistrationComponent },  
  { path: 'user-info', component: UserInfoPageComponent },  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
