import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { User } from 'src/app/shared/interfaces/user';
import { RegistrationUpdateDeleteEditService } from '../../sharedServices/registration-update-delete-edit.service';
import { matchPassword } from '../../user/components/user-registration/user-registration.component';
import { Coach } from 'src/app/shared/interfaces/coach';


@Component({
  selector: 'app-coach-registration',
  templateUrl: './coach-registration.component.html',
  styleUrls: ['./coach-registration.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class CoachRegistrationComponent {
  constructor(private fb: FormBuilder, private http: HttpClient, private service:RegistrationUpdateDeleteEditService) {}
  public form = this.fb.group(
    {
    name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9-]+$/)]],
    lastname: ['',],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required,Validators.pattern(/^\+995\d{9}$/)]],
    password: ['', [Validators.required,Validators.pattern(/^[a-zA-Z0-9]+$/), Validators.minLength(8),]],
    confirmPassword: ['', [Validators.required]],
    age: ['',],
    salary: ['',],
    nickName:['', [Validators.required]]
    

    },
  {validators:matchPassword}
  );
  name = this.form.get('name') as FormControl;
  age = this.form.get('age') as FormControl;
  lastname = this.form.get('lastname') as FormControl;
  phoneNumber = this.form.get('phoneNumber') as FormControl;
  password = this.form.get('password') as FormControl;
  email = this.form.get('email') as FormControl;
  salary = this.form.get("salary") as FormControl
  nickName = this.form.get('nickName') as FormControl

  public submit() {
    const coach: Coach = {
      name: this.form.getRawValue().name!,
      lastname: this.form.getRawValue().lastname!,
      nickName: this.form.getRawValue().nickName!,
      email: this.form.getRawValue().email!,
      phoneNumber: this.form.getRawValue().phoneNumber!,
      password: this.form.getRawValue().password!,
      age: this.form.getRawValue().age!,
      salary:this.form.getRawValue().salary!,
      status:"coach",
      plans: [],
      requests:[],
    };
    this.service.addUserOrCoaches(coach, "coaches").subscribe(()=>{
      this.form.reset()
    })
  }
  
}
