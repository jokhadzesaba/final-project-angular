import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { object } from '@angular/fire/database';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistrationUpdateDeleteEditService } from 'src/app/features/sharedServices/registration-update-delete-edit.service';
import { Coach } from 'src/app/shared/interfaces/coach';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
})
export class LogInComponent implements OnInit{
  public form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]+$/),
        Validators.minLength(8),
      ],
    ],
  });
  email = this.form.get('email') as FormControl;
  password = this.form.get('password') as FormControl;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: RegistrationUpdateDeleteEditService,
    private http: HttpClient
    
  ) {}
  ngOnInit(): void {
    
  }
  onSubmit() {
    const rawForm = this.form.getRawValue();
    const email = rawForm.email!;
    const password = rawForm.password!;
    this.authService.getInfo(email, password).subscribe((isUserFound) => {
      if (isUserFound) {
        this.authService.status.subscribe((status) => {
          if (status === 'user' || 'coach') {
            this.router.navigate(['/home']);
          }
        });
      } else {
        alert('incorrect password or email');
      }
    });
  }
  idk() {
    const url = "https://exercise-app-9b873-default-rtdb.europe-west1.firebasedatabase.app"
    this.http.get(`${url}/coaches/-NkpSH8y_SeyJAGnhYhm.json`,).subscribe((coaches:any)=>{
      console.log(coaches);
      
      
    });
    
   }
    
  
}
