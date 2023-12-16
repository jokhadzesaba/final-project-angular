import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegistrationUpdateDeleteEditService } from '../../sharedServices/registration-update-delete-edit.service';
import { CalculateService } from '../service/calculate.service';
import { Coach } from 'src/app/shared/interfaces/coach';
import { User } from 'src/app/shared/interfaces/user';

@Component({
  selector: 'app-bmi',
  templateUrl: './bmi.component.html',
  styleUrls: ['./bmi.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BMIComponent {
  public bmiForm!: FormGroup;
  public bmiResult: number | null = null;
  public id?: string;
  public status?: string = 'guest';
  public adding:boolean = false

  constructor(
    private formBuilder: FormBuilder,
    private service: RegistrationUpdateDeleteEditService,
    private calculateService: CalculateService,
    private cd:ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.service.loggedUser.subscribe((res: User | Coach) => {
      if (res.status === 'user') {
        this.status = 'users'
      }else if(res.status === 'coach'){
        this.status = 'coaches'
      }else{
        this.status = 'guest'
      }
      this.bmiForm = this.formBuilder.group({
        height: ['', Validators.required],
        weight: ['', Validators.required],
      });      
      this.cd.detectChanges()
    });
  }

  calculateBMI(): void {
    const height = this.bmiForm.get('height')!.value;
    const weight = this.bmiForm.get('weight')!.value;

    if (height && weight) {
      const heightInMeters = height / 100;
      this.bmiResult = weight / (heightInMeters * heightInMeters);
    } else {
      this.bmiResult = null;
    }
    if (this.status === 'user' || 'coach') {
      this.adding = true
    }
  }
  addToUserData() {
    this.calculateService.addToUser(
      'bmi',
      this.bmiResult!,
      this.status! as 'coaches' | 'users'
    );
    this.adding = false
  }
}
