import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-registration-error-handling',
  templateUrl: './registration-error-handling.component.html',
  styleUrls: ['./registration-error-handling.component.scss']
})
export class RegistrationErrorHandlingComponent {
  @Input() control!: FormControl | FormGroup;
  @Input() showRegardless: boolean = false;
  @Input() customError: string | undefined;
  
  private errors: { [key: string]: string } = {
    required: 'Fill in required field',
    pattern: 'Invalid pattern',
  };
  public displayError() {
    const errors = this.control.errors;
    for (const err in errors) {
      if (err === 'minlength') {
        return 'min length must be ' + errors![err]!['requiredLength'];
      }
      if (this.errors[err]) {
        return this.errors[err];
      }
    }
    return this.customError ? this.customError : 'Invalid input';
  }
}
