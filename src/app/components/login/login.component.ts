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
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private authService: AuthService, private router: Router,
    private snackbar: MatSnackBar) { }

  ngOnInit(): void {
  }

  onSubmit() {
    const { username, password } = this.loginForm.value;
    if (!username || !password || !this.loginForm.valid) return;
    this.authService.login(username, password).
      pipe(catchError((error) => {
        if (error.status === 401) {
          this.snackbar.open('Invalid login!', 'Dismiss',
            { duration: 3000, verticalPosition: 'top' });
          this.loginForm.controls.username.setErrors({ 'invalid': true });
          this.loginForm.controls.password.setErrors({ 'invalid': true });
          this.loginForm.controls.username.reset();
          this.loginForm.controls.password.reset();
        }
        return EMPTY;
      })).subscribe((token) => {
      this.authService.setToken(token);
      this.router.navigateByUrl('');
    });
  }
}
