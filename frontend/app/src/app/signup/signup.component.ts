import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../login.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(
      private fb: FormBuilder,
      private authService: AuthService,
      private router: Router,
    ) {
      this.registerForm = this.fb.group({
        username: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]]
      });}

  onSubmit() {
    if (this.registerForm.valid) {
      const { username, email, password } = this.registerForm.value;
      this.authService.register(username, email, password).subscribe({
        next: (response) => {
          alert("Registration successfull. You may now login.");
          this.router.navigate(['/login']);

        },
        error: (err) => {
          this.errorMessage = err.message;
        }
      });
    } else {
      const invalid = [];
        const controls = this.registerForm.controls;
        for (const name in controls) {
            if (controls[name].invalid) {
                invalid.push(name);
            }
        }
      
      this.errorMessage = 'Some entered values are invalid: ' + invalid.join(', ');
    }
  }
}