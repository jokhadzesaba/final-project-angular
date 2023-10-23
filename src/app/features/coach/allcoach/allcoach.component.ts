import { Component, OnInit } from '@angular/core';
import { RegistrationUpdateDeleteEditService } from '../../sharedServices/registration-update-delete-edit.service';
import { Coach } from 'src/app/shared/interfaces/coach';
import { Router } from '@angular/router';

@Component({
  selector: 'app-allcoach',
  templateUrl: './allcoach.component.html',
  styleUrls: ['./allcoach.component.scss']
})
export class AllcoachComponent implements OnInit{
  public allCoach:Coach[] =[]
  constructor(private service:RegistrationUpdateDeleteEditService, private router:Router){}
  ngOnInit(): void {
    this.service.loadCoaches().subscribe((res:Coach[])=>{
      this.allCoach = res
    })
  }
  navigateToCoach(coachId: number) {
    this.router.navigate(['/coach-info', coachId]);
}
}
