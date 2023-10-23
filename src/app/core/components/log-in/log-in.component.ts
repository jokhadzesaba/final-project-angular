import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistrationUpdateDeleteEditService } from 'src/app/features/sharedServices/registration-update-delete-edit.service';


@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
})
export class LogInComponent {
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
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: RegistrationUpdateDeleteEditService
  ) {}
  onSubmit() {
    const rawForm = this.form.getRawValue();
    const email = rawForm.email!;
    const password = rawForm.password!;
    this.authService.getInfo(email, password).subscribe((isUserFound) => {
      if (isUserFound) {
        this.authService.status.subscribe((status) => {
          if (status === 'user' || 'coach') {
            this.router.navigate(['/mainpage']);
          }
        });
      } else {
        alert('incorrect password or email');
      }
    });
  }
}
