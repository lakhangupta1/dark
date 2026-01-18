import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule], // <-- Add ReactiveFormsModule here
  templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmpassword: ['', [Validators.required, Validators.minLength(6)]],
      userType: ['user', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {}

  get f() { return this.registerForm.controls; }

  passwordMatchValidator(controls: FormGroup) {
    const password = controls.get('password')?.value;
    const confirmPassword = controls.get('confirmpassword')?.value;
    if (password !== confirmPassword) {
      controls.get('confirmpassword')?.setErrors({ mismatch: true });
    } else {
      controls.get('confirmpassword')?.setErrors(null);
    }
    return null;
  }

  get passwordMismatch() {
    return this.registerForm.hasError('mismatch') || this.f['confirmpassword'].hasError('mismatch');
  }

  onSubmit(): void {
    this.submitted = true;
    if (!this.registerForm.valid) return;
    const userDetails = this.registerForm.value;
    console.log( 'userDetails -> ', userDetails );
    this.authService.register(userDetails);
  }

  selectButton(option: string): void {
    this.registerForm.get('userType')?.setValue(option);
  }
}
