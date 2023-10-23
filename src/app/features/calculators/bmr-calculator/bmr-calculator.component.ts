import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-bmr-calculator',
  templateUrl: './bmr-calculator.component.html',
  styleUrls: ['./bmr-calculator.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class BMRCalculatorComponent {
  bmrForm: FormGroup;
  bmr: number = 0;

  constructor(private formBuilder: FormBuilder) {
    this.bmrForm = this.formBuilder.group({
      weight: ['', [Validators.required, Validators.min(0)]],
      height: ['', [Validators.required, Validators.min(0)]],
      age: ['', [Validators.required, Validators.min(0)]],
      gender: ['', Validators.required],
      activityLevel: ['', Validators.required]
    });
  }

  calculateBMR(): void {
    const weight = this.bmrForm.value.weight;
    const heightInCm = this.bmrForm.value.height;
    const heightInM = heightInCm / 100; // Convert height from cm to meters
    const age = this.bmrForm.value.age;
    const gender = this.bmrForm.value.gender;
    const activityLevel = this.bmrForm.value.activityLevel;
    let bmr: number;

    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * heightInM * 100) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * heightInM * 100) - (4.330 * age);
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
  }

}
