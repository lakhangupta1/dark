import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FeatherModule } from 'angular-feather';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [CommonModule, FeatherModule, RouterModule, ReactiveFormsModule]
})
export class LoginComponent implements OnInit, OnDestroy {

  value: number = 0;
  intergrate: any;
  loginForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toaster: ToastrService
  ) {
    console.log('Login constructor ->');
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(15)
      ]]
    });

    this.intergrate = setInterval(() => {
      this.value++;
    }, 1000);
  }

  ngOnInit(): void {
    console.log('ngOnInit login');
    if (localStorage.getItem('currentItem')) {
      this.router.navigate(['/dashboard']);
    }
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.valid) {
      let flag = this.authService.login(this.loginForm.value);
      console.log('Valid login form ->', this.loginForm.value, "flag -> ", flag  );
      if(flag){
        this.router.navigate(['/dashboard']);
      }else{
        this.router.navigate(['/login']); 
      }
    } else {
      this.toaster.error('Please fill all required fields correctly');
    }
  }

  navigateToForgotPassword() {
    this.router.navigate(['/dashboard/forgotpassword']);
  }

  ngOnDestroy() {
    if (this.intergrate) {
      clearInterval(this.intergrate);
    }
  }
}
