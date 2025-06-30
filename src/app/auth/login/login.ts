import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Toast } from '../../components/toast/toast';
import { Router } from '@angular/router';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatIconModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  constructor(private auth : AuthService, private router : Router) {}

  private toast = inject(MatSnackBar);

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(6)]);

  form = new FormGroup({
    email : this.emailFormControl,
    password : this.passwordFormControl
  });

  hide = signal(true);

  matcher = new MyErrorStateMatcher();

  clickEvent(event: Event) {
    event.preventDefault();
    this.hide.update(value => !value);
    event.stopPropagation();
  }

  Login(event: Event) {
    event.preventDefault();

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.auth.Login(this.form.value.email?? '', this.form.value.password?? '').subscribe(
      {
        next: (result) => {
          this.auth.SetAccessToken(result.accesstoken);
          this.router.navigate(['chat']);
        },
        error: (error) => {
          if (error.status == 401 || error.status == 400) this.toast.openFromComponent(Toast, { horizontalPosition: 'right', verticalPosition: 'top', data: { message: "Email ou Senha Incorretos." }, duration: 2000 });
          else if (error.status == 429) this.toast.openFromComponent(Toast, { horizontalPosition: 'right', verticalPosition: 'top', data: { message: "Quantidade de tentativas excedidas, tente novamente mais tarde." }, duration: 2000 });
          else this.toast.openFromComponent(Toast, { horizontalPosition: 'right', verticalPosition: 'top', data: { message: "Erro Interno." }, duration: 2000 });
        }
      }
    )

    event.stopPropagation();
  }
}
