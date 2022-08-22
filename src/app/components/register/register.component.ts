import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { catchError, EMPTY } from 'rxjs';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registrationForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirm: new FormControl('', [Validators.required]),
  }, [passwordConfirmationValidator]);

  passwordErrorStateMatcher = new PasswordErrorStateMatcher();

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit() {
    const username = this.registrationForm.controls.email.value;
    const password = this.registrationForm.controls.password.value;
    if (username !== null && password !== null) {
      this.authService.register(username, password).pipe(catchError(error => {
        if (error.status === 409) {
          this.registrationForm.controls.email.setErrors(
            { 'duplicate': true });
          this.registrationForm.controls.password.reset();
          this.registrationForm.controls.confirm.reset();
        }
        return EMPTY;
      })).subscribe(() => {
        this.authService.login(username, password).subscribe(() => {
          this.router.navigateByUrl('/verify');
        });
      });
    }
  }
}

class PasswordErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && (control.dirty || control.touched || isSubmitted) &&
      (control.invalid ||
        (form && form.errors && form.errors['invalidConfirm'])));
  }
}

function passwordConfirmationValidator(control: AbstractControl): ValidationErrors | null {
  if (control.get('password')!.value !== control.get('confirm')!.value) {
    return { invalidConfirm: true };
  }
  return null;
}
