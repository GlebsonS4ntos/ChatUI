import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgIf } from '@angular/common';
import { Login } from "./login/login";
import { Register } from "./register/register";

@Component({
  selector: 'app-auth',
  imports: [MatCardModule, NgIf, Login, Register],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class Auth {
  islogin = true;
}
