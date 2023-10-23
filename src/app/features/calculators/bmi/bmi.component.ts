import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-bmi',
  templateUrl: './bmi.component.html',
  styleUrls: ['./bmi.component.scss'],
  // changeDetection:ChangeDetectionStrategy.OnPush
})
export class BMIComponent {
  bmiForm!: FormGroup; // Add non-null assertion operator
  bmiResult: number | null = null;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.bmiForm = this.formBuilder.group({
      height: ['', Validators.required],
      weight: ['', Validators.required]
    });
  }

  calculateBMI(): void {
    const height = this.bmiForm.get('height')!.value; // Add non-null assertion operator
    const weight = this.bmiForm.get('weight')!.value; // Add non-null assertion operator

    if (height && weight) {
      const heightInMeters = height / 100;
      this.bmiResult = weight / (heightInMeters * heightInMeters);
    } else {
      this.bmiResult = null;
    }
  }
}
