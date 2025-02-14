import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { PopupMessageComponent } from '../popup-message/popup-message.component';
import { Papa } from 'ngx-papaparse';
import { CommonModule } from '@angular/common';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PopupMessageComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  //#region "Global Variables."

loginForm: FormGroup;
errorMessage: string = '';
showPopup: boolean = false;

isFooterVisible: boolean = true;
//#endregion

@ViewChild(PopupMessageComponent) popup!: PopupMessageComponent;

constructor(private fb: FormBuilder, private router: Router, private http: HttpClient, private papa: Papa, private authService: AuthService) {
  
  this.loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });
}

//#region "DB Call to check access of the account."
onAccess(): void {
  if (this.loginForm.invalid) {
    this.popup.show('Please fill in all required fields!');
    return;
  }

  const username = this.loginForm.value.username;
  const password = this.loginForm.value.password;

  this.http.get('../files/Credentials.csv', { responseType: 'text' }).subscribe({
    next: (csvData) => {
      this.papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const credentials = result.data as Array<{ USERNAME: string; PASSWORD: string; ACCESS: string }>;
          const user = credentials.find((cred) => cred.USERNAME === username && cred.PASSWORD === password);

          if (user) {
            localStorage.setItem('access', user.ACCESS);
          } else {
            this.popup.show('Invalid username or password.');
          }
        },
      });
    },
    error: (err) => {
      this.errorMessage = err.message || 'An error occurred while reading credentials.';
      this.popup.show(this.errorMessage);
    },
  });
}
//#endregion.

//#region "Login to Website with Creds."
// onLogin(): void {
//   if (this.loginForm.invalid) {
//     this.popup.show('Please fill in all required fields!');
//     return;
//   }

//   const username = this.loginForm.value.username;
//   const password = this.loginForm.value.password;

//   // Fetch and parse the CSV file
//   this.http.get('../files/Credentials.csv', { responseType: 'text' }).subscribe({
//     next: (csvData) => {
//       this.papa.parse(csvData, {
//         header: true,
//         skipEmptyLines: true,
//         complete: (result) => {
//           const credentials = result.data as Array<{ USERNAME: string; PASSWORD: string; TOKEN?: string; ACCESS: string; EMAIL: string }>;
//           const user = credentials.find((cred) => cred.USERNAME === username && cred.PASSWORD === password);

//           if (user) {
//             this.authService.setUser(user.USERNAME);
//             localStorage.setItem('token', user.TOKEN || '');
//             localStorage.setItem('access', user.ACCESS);
//             localStorage.setItem('email', user.EMAIL);

//             if (user.ACCESS === '1') {
//               this.router.navigate(['/home']);
//             } else {
//               // this.popup.show('You do not have access to the Orders page.');
//               this.router.navigate(['/home']); // Redirect to home if no access
//             }
//           } else {
//             this.popup.show('Invalid username or password.');
//           }
//         },
//       });
//     },
//     error: (err) => {
//       this.errorMessage = err.message || 'An error occurred while reading credentials.';
//       this.popup.show(this.errorMessage);
//     },
//   });
// }

onLogin(): void {
  if (this.loginForm.invalid) {
    this.popup.show('Please fill in all required fields!');
    return;
  }

  const username = this.loginForm.value.username;
  const password = this.loginForm.value.password;

  this.http.get('../files/Credentials.csv', { responseType: 'text' }).subscribe({
    next: (csvData) => {
      this.papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const credentials = result.data as Array<{ USERNAME: string; PASSWORD: string; ACCESS: string; EMAIL: string }>;
          const user = credentials.find((cred) => cred.USERNAME === username);

          if (user && bcrypt.compareSync(password, user.PASSWORD)) { // Compare hashed password
            this.authService.setUser(user.USERNAME);
            localStorage.setItem('access', user.ACCESS);
            localStorage.setItem('email', user.EMAIL);

            if (user.ACCESS === '1') {
              this.router.navigate(['/home']);
            } else {
              this.router.navigate(['/home']); // Redirect to home if no access
            }
          } else {
            this.popup.show('Invalid username or password.');
          }
        },
      });
    },
    error: (err) => {
      this.errorMessage = err.message || 'An error occurred while reading credentials.';
      this.popup.show(this.errorMessage);
    },
  });
}

//#endregion

//Geust Login
onGuest(): void{
  localStorage.removeItem('token');
    localStorage.removeItem('access');
    localStorage.removeItem('email');
    this.authService.clearUser();
  this.router.navigate(['/home']);
}

//Register New User.
onRegister(): void{
  this.router.navigate(['/register']);
}
}
