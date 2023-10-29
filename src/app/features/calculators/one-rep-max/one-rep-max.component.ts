import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistrationUpdateDeleteEditService } from '../../sharedServices/registration-update-delete-edit.service';
import { CalculateService } from '../service/calculate.service';
import { User } from 'src/app/shared/interfaces/user';
import { Coach } from 'src/app/shared/interfaces/coach';

@Component({
  selector: 'app-one-rep-max',
  templateUrl: './one-rep-max.component.html',
  styleUrls: ['./one-rep-max.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OneRepMaxComponent implements OnInit{
  oneRepMaxForm: FormGroup;
  oneRepMax: number = 0;
  public id?: number;
  public status?: string;

  constructor(
    private formBuilder: FormBuilder,
    private service: RegistrationUpdateDeleteEditService,
    private calculateService: CalculateService
  ) {
    this.oneRepMaxForm = this.formBuilder.group({
      weight: ['', [Validators.required, Validators.min(0)]],
      repetitions: ['', [Validators.required, Validators.min(0)]],
    });
  }
  ngOnInit(): void {
    this.service.loggedUser.subscribe((res:User|Coach)=>{
      this.id = res.id;
      if (res.status === 'user') {
        this.status = 'users'
      }else if(res.status === 'coach'){
        this.status = 'coaches'
      }else{
        this.status = 'guest'
      }
    })
  }

  calculateOneRepMax(): void {
    const weight = this.oneRepMaxForm.value.weight;
    const repetitions = this.oneRepMaxForm.value.repetitions;
    let oneRepMax: number;

    if (repetitions === 1) {
      oneRepMax = weight;
    } else {
      oneRepMax = weight * (1 + repetitions / 30);
    }
    this.oneRepMax = oneRepMax;
  }
  addToUserData() {
    this.calculateService.addToUser(
      'orm',
      this.oneRepMax,
      this.status! as 'coaches' | 'users',
      this.id!
    );
  }
}
