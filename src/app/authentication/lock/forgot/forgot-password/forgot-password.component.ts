import { CommonModule, NgIf } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
// import { AuthService } from '../authentication.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone : true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
 user = {
    password: '',
    confirmPassword: '',
    email : ''
  };

  showPassword = false;
  showConfirmPassword = false;
  submitted : boolean = false
  constructor( private authService : AuthService, private toaster : ToastrService, private router : Router){

  }

  onSubmit(forgotPassword : NgForm){
    console.log(" forgotPassword -> ", forgotPassword.value );
    this.authService.forgotPassword(forgotPassword.value).subscribe((res :any )=>{
      if(res && !res['error']){
        this.submitted  = false;
        this.toaster.info(res['message']);
      }else{
        this.toaster.success(res['message']);
        this.submitted = true;
      }
    })
    console.log(" submitted after ", this.submitted );
  }

  createPassword(createPasswordForm : NgForm){
    console.log(" createPasswordForm value -> ", createPasswordForm.value , "user -> ", this.user );
    if(createPasswordForm.value['password'] != createPasswordForm.value['confirmPassword']){
      this.toaster.info('password not matched ');
      return;
    }else{
      this.authService.createPassword(this.user).subscribe((res : any) => {
        if(res && !res['error']){
          this.toaster.success(res['message']);
          this.router.navigate(['/']);
        }else{
          this.toaster.error(res['message']);
        }
      });
    }
  }
}
