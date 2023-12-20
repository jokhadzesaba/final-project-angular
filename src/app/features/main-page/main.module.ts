import { NgModule } from '@angular/core';
import { MainPageComponent } from './main-page.component';
import { MainRoutingModule } from './main-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [MainPageComponent],
  imports: [CommonModule, MainRoutingModule, FormsModule],
  providers: [],
  exports: [],
})
export class MainModule {}
