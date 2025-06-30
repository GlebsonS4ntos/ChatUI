import { Component, inject, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
  FormGroupDirective,
  NgForm,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ErrorStateMatcher } from '@angular/material/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Toast } from '../../components/toast/toast';
import { MatSnackBar } from '@angular/material/snack-bar';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-register',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  constructor(private auth: AuthService, private router: Router) {}

  private toast = inject(MatSnackBar);

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(20),
  ]);
  usernameFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(4),
    Validators.maxLength(20),
  ]);

  form = new FormGroup({
    email: this.emailFormControl,
    password: this.passwordFormControl,
    username: this.usernameFormControl,
  });

  hide = signal(false);

  matcher = new MyErrorStateMatcher();

  clickEvent(event: Event) {
    event.preventDefault();
    this.hide.update((value) => !value);
    event.stopPropagation();
  }

  cadastro(event: Event) {
    event.preventDefault();

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.auth
      .CreateUser(
        this.form.value.username ?? '',
        this.form.value.email ?? '',
        this.form.value.password ?? ''
      )
      .subscribe({
        next: (result) => {
          this.auth.SetAccessToken(result.accesstoken);
          this.router.navigate(['chat']);
        },
        error: (error) => {
          if (Array.isArray(error.error)) {
            const messages: string[] = [];

            for (const err of error.error) {
              if (err.code === 'DuplicateEmail')
                messages.push('Email já cadastrado');
              if (err.code === 'DuplicateUserName')
                messages.push('Nome de usuário já existe');
            }

            const finalMessage = messages.join(' e ');

            this.toast.openFromComponent(Toast, {
              horizontalPosition: 'right',
              verticalPosition: 'top',
              data: { message: finalMessage },
              duration: 4000,
            });
          } else {
            this.toast.openFromComponent(Toast, {
              horizontalPosition: 'right',
              verticalPosition: 'top',
              data: { message: 'Verifique os dados informados.' },
              duration: 2000,
            });
          }
        },
      });

    event.stopPropagation();
  }
}
