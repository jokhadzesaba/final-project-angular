import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, Validators, FormControl, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { RegistrationUpdateDeleteEditService } from 'src/app/features/sharedServices/registration-update-delete-edit.service';
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
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class UserRegistrationComponent {
  constructor(private fb: FormBuilder, private http: HttpClient, private service:RegistrationUpdateDeleteEditService) {}
  public form = this.fb.group(
    {
    name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9-]+$/)]],
    lastname: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required,Validators.pattern(/^\+995\d{9}$/)]],
    password: ['', [Validators.required,Validators.pattern(/^[a-zA-Z0-9]+$/), Validators.minLength(8),]],
    confirmPassword: ['', [Validators.required]],
    age: ['', [Validators.required,]],
    nickName:['',[Validators.required,Validators.minLength(4),]]
    },
  {validators:matchPassword}
  );
  name = this.form.get('name') as FormControl;
  age = this.form.get('age') as FormControl;
  lastname = this.form.get('lastname') as FormControl;
  phoneNumber = this.form.get('phoneNumber') as FormControl;
  password = this.form.get('password') as FormControl;
  email = this.form.get('email') as FormControl;
  nickName = this.form.get('nickName') as FormControl

  public submit() {
    const employee: User = {
      name: this.form.getRawValue().name!,
      lastname: this.form.getRawValue().lastname!,
      nickName:this.form.getRawValue().nickName!,
      email: this.form.getRawValue().email!,
      phoneNumber: this.form.getRawValue().phoneNumber!,
      password: this.form.getRawValue().password!,
      age: this.form.getRawValue().age!,
      plans:[],
      likedPlans:[],
      status:"user",
      requestedPlans:[],

    };
    this.service.addUserOrCoaches(employee, "users").subscribe(()=>{
      this.form.reset()
    })
    
  }
  
}


