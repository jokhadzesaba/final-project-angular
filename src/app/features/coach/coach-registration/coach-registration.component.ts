import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';

import { RegistrationUpdateDeleteEditService } from '../../sharedServices/registration-update-delete-edit.service';
import { matchPassword } from '../../user/components/user-registration/user-registration.component';
import { SharedService } from '../../sharedServices/shared.service';

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
    private sharedService:SharedService

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
      nickName: ['', [Validators.required]],
    },
    { validators: matchPassword }
  );
  password = this.form.get('password') as FormControl;
  email = this.form.get('email') as FormControl;
  nickName = this.form.get('nickName') as FormControl;

  public submit() {
    const coach = {
      nickName: this.form.getRawValue().nickName!,
      email: this.form.getRawValue().email!,
      password: this.form.getRawValue().password!,
      id: this.sharedService.generateUniqueId(8),
      profileImgUrl:'assets/profile-pictures/default.png',
      bmi: '',
      orm: '',
      bmr: '',
      status: 'coach',
      plans: [
        {
          name: 'placeholder',
          description: 'placeholder',
          planId: 'placeholder',
          creatorId: "-1",
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
      requests: [{ description: 'placeholder', userId: -1, id: 'placeholder' }],
    };
    this.service.addUserOrCoaches(coach, 'coaches');
  }
}
