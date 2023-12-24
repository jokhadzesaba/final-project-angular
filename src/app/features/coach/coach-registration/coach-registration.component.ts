import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

import { RegistrationUpdateDeleteEditService } from '../../sharedServices/registration-update-delete-edit.service';
import { CostumValidators } from 'src/app/shared/validators';
import { SharedService } from '../../sharedServices/shared.service';
import { Coach } from 'src/app/shared/interfaces/coach';
import { Router } from '@angular/router';
@Component({
  selector: 'app-coach-registration',
  templateUrl: './coach-registration.component.html',
  styleUrls: ['./coach-registration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoachRegistrationComponent {

  constructor(
    private fb: FormBuilder,
    private service: RegistrationUpdateDeleteEditService,
    private sharedService: SharedService,
    private router:Router,
    public costumValidators: CostumValidators,
  ) {}

  public form = this.fb.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9]+$/),
          Validators.minLength(8),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
      nickName: ['', [Validators.required,Validators.minLength(4)]],
    },
  );
  password = this.form.get('password') as FormControl;
  email = this.form.get('email') as FormControl;
  nickName = this.form.get('nickName') as FormControl;

  public submit() {
    const coach: Coach = {
      nickName: this.form.getRawValue().nickName!,
      email: this.form.getRawValue().email!,
      password: this.form.getRawValue().password!,
      id: this.sharedService.generateUniqueId(8),
      profileImgUrl: 'assets/profile-pictures/default.png',
      bmi: '',
      orm: '',
      bmr: '',
      status: 'coach',
      registrationDate: new Date(),
      totalLikes: 0,
      plans: [
        {
          creationDate: new Date(),
          name: 'placeholder',
          description: 'placeholder',
          planId: 'placeholder',
          creatorId: '-1',
          planImg: '',
          exercises: [
            {
              bodyPart: 'idk',
              equipment: '`idk',
              gifUrl: 'idk',
              id: -1,
              name: 'idk',
              target: 'idk',
              selected: false,
            },
          ],
        },
      ],
      requests: [
        { description: 'placeholder', userId: '-1', requestId: 'placeholder' },
      ],
    };
    this.costumValidators.EmailRepetition(coach.email).subscribe((res) => {
      if (res) {
        this.service.addUserOrCoaches(coach, 'coaches');
        this.router.navigate(["/login/login"])
      }
    });
  }
}
