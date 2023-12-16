
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormControl,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { RegistrationUpdateDeleteEditService } from 'src/app/features/sharedServices/registration-update-delete-edit.service';
import { SharedService } from 'src/app/features/sharedServices/shared.service';
import { User } from 'src/app/shared/interfaces/user';
export const matchPassword: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  if (password?.value !== confirmPassword?.value) {
    return { passwordMatch: true };
  }
  return null;
};
@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserRegistrationComponent {
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
      nickName: ['', [Validators.required, Validators.minLength(4)]],
    },
    { validators: matchPassword }
  );
  password = this.form.get('password') as FormControl;
  email = this.form.get('email') as FormControl;
  nickName = this.form.get('nickName') as FormControl;
  
  public submit() {
    const employee: User = {
      nickName: this.form.getRawValue().nickName!,
      email: this.form.getRawValue().email!,
      password: this.form.getRawValue().password!,
      id: this.sharedService.generateUniqueId(8),
      profileImgUrl:'assets/profile-pictures/default.png',
      bmi: '',
      orm: '',
      bmr: '',
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
            },
          ],
        },
      ],
      likedPlans: [
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
            },
          ],
        },
      ],
      status: 'user',
      requestedPlans: [
        {
          coachId: "-1",
          description: 'placeholder',
          planId: 'placeholder',
          planName: 'placeholder',
          exercises: [
            {
              bodyPart: 'idk',
              equipment: '`idk',
              gifUrl: 'idk',
              id: -1,
              name: 'idk',
              target: 'idk',
            },
          ],
        },
      ],
    };
    this.service.addUserOrCoaches(employee, 'users');
  }
}
