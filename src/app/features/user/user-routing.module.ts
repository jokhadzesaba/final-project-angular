import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserRegistrationComponent } from './components/user-registration/user-registration.component';
import { UserInfoPageComponent } from './components/user-info-page/user-info-page.component';
import { UserPageGuard } from './user-page.guard';



const routes: Routes = [
  { path: 'user-registration', component: UserRegistrationComponent },  
  { path: 'user-info', component: UserInfoPageComponent, canActivate: [UserPageGuard] },  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
