import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-one-rep-max',
  templateUrl: './one-rep-max.component.html',
  styleUrls: ['./one-rep-max.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class OneRepMaxComponent {
  oneRepMaxForm: FormGroup;
  oneRepMax: number = 0;

  constructor(private formBuilder: FormBuilder) {
    this.oneRepMaxForm = this.formBuilder.group({
      weight: ['', [Validators.required, Validators.min(0)]],
      repetitions: ['', [Validators.required, Validators.min(0)]]
    });
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
}
