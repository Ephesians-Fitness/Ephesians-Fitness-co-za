import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  message = '';

  // serverHost: string = 'http://localhost:3000';
serverHost: string = 'https://ephesians-fitness-server.onrender.com';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required], // Added username field
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
      this.registerForm.controls['confirmPassword'].setErrors({ mismatch: true });
      return;
    }

    // Send registration data to backend
    this.http.post(`${this.serverHost}/register`, this.registerForm.value)
      .subscribe({
        next: (response: any) => {
          this.message = response.message;
          this.registerForm.reset();
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.message = error.error.message;
        }
      });
  }

  onBack(): void{
    this.submitted = false;
    this.registerForm.reset();
    this.router.navigate(['/login']);
  }
}
