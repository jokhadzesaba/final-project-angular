import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExercisesComponent } from './features/exercises/exercises.component';
import { MainPageComponent } from './features/main-page/main-page.component';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./core/components/core.module').then((m) => m.CoreModule),
  },

  {
    path: 'calculate',
    loadChildren: () =>
      import('./features/calculators/calculate.module').then(
        (m) => m.CalculatorModule
      ),
  },
  {
    path: 'coach-feeature',
    loadChildren: () =>
      import('./features/coach/coach.module').then((m) => m.CoachModule),
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./features/user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./features/main-page/main.module').then((m) => m.MainModule),
  },
  {
    path: 'exercises',
    loadChildren: () =>
      import('./features/exercises/exercises.module').then((m) => m.ExercisesModule),
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
