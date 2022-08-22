import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { catchError, EMPTY } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private authService: AuthService, private router: Router,
    private snackbar: MatSnackBar) { }

  ngOnInit(): void {
  }

  onSubmit() {
    const { email, password } = this.loginForm.value;
    if (!email || !password || !this.loginForm.valid) return;
    this.authService.login(email, password).
      pipe(catchError((error) => {
        if (error.status === 401) {
          this.snackbar.open('Invalid login!', 'Dismiss',
            { duration: 3000, verticalPosition: 'top' });
          this.loginForm.controls.email.setErrors({ 'invalid': true });
          this.loginForm.controls.password.setErrors({ 'invalid': true });
          this.loginForm.reset();
        }
        return EMPTY;
      })).subscribe();
  }
}
