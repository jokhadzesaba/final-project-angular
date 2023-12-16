import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegistrationUpdateDeleteEditService } from '../../sharedServices/registration-update-delete-edit.service';
import { CalculateService } from '../service/calculate.service';
import { User } from 'src/app/shared/interfaces/user';
import { Coach } from 'src/app/shared/interfaces/coach';

@Component({
  selector: 'app-bmr-calculator',
  templateUrl: './bmr-calculator.component.html',
  styleUrls: ['./bmr-calculator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BMRCalculatorComponent implements OnInit {
  bmrForm: FormGroup;
  bmr: number = 0;
  public id?: string;
  public status?: string;
  public adding:boolean = false
  constructor(
    private formBuilder: FormBuilder,
    private service: RegistrationUpdateDeleteEditService,
    private calculateService: CalculateService
  ) {
    this.bmrForm = this.formBuilder.group({
      weight: ['', [Validators.required, Validators.min(0)]],
      height: ['', [Validators.required, Validators.min(0)]],
      age: ['', [Validators.required, Validators.min(0)]],
      gender: ['', Validators.required],
      activityLevel: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.service.loggedUser.subscribe((res: User | Coach) => {
      this.id = '';
      if (res.status === 'user') {
        this.status = 'users';
      } else if (res.status === 'coach') {
        this.status = 'coaches';
      } else {
        this.status = 'guest';
      }
    });
  }

  calculateBMR(): void {
    const weight = this.bmrForm.value.weight;
    const heightInCm = this.bmrForm.value.height;
    const heightInM = heightInCm / 100;
    const age = this.bmrForm.value.age;
    const gender = this.bmrForm.value.gender;
    const activityLevel = this.bmrForm.value.activityLevel;
    let bmr: number;

    if (gender === 'male') {
      bmr = 88.362 + 13.397 * weight + 4.799 * heightInM * 100 - 5.677 * age;
    } else {
      bmr = 447.593 + 9.247 * weight + 3.098 * heightInM * 100 - 4.33 * age;
    }

    switch (activityLevel) {
      case 'sedentary':
        bmr *= 1.2;
        break;
      case 'lightlyActive':
        bmr *= 1.375;
        break;
      case 'moderatelyActive':
        bmr *= 1.55;
        break;
      case 'veryActive':
        bmr *= 1.725;
        break;
      case 'superActive':
        bmr *= 1.9;
        break;
    }
    this.bmr = bmr;
    if (this.status === 'user' || 'coach') {
      this.adding = true
    }
  }
  addToUserData() {
    this.calculateService.addToUser(
      'bmr',
      this.bmr,
      this.status! as 'coaches' | 'users'
    );
    this.adding = false
  }
}
