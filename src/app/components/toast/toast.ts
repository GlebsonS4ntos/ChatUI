import { Component, Inject, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarAction, MatSnackBarActions, MatSnackBarLabel, MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-toast',
  imports: [MatButtonModule, MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction , MatIconModule],
  templateUrl: './toast.html',
  styleUrl: './toast.css'
})
export class Toast {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}
  snackBarRef = inject(MatSnackBarRef);

  message (){
    return this.data.message;
  }
}
