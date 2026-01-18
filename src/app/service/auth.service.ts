import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { NgxPermissionsService } from "ngx-permissions"
import { environment } from 'src/environments/environment';
import { jwtDecode } from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  value : any;
  private currentUserSubject : BehaviorSubject<any>;
  userPermissions : any = '' ;
  private details: BehaviorSubject<any>;

  constructor(private http : HttpClient, private router : Router, private toaster : ToastrService ) { 
    this.details = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser') || "null"));
  }

  public get currentUserValue(){
    return this.currentUserSubject.value;
  }

  public get getSubDomain(){
    try{
        return `${environment.scheme}${environment.apiUrl}`;
    }catch(error){
        return `${environment.scheme}${environment.apiUrl}`;
    }
  }

  forgotPassword( userDetails : any ){
      return this.http.post(this.getSubDomain+ '/api/auth/forgotpassword', userDetails);
  }

  createPassword(userDetails : any){
    return this.http.post(this.getSubDomain + '/api/auth/createPassword', userDetails);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token; // true if token exists
  }

  login(userDetails: any) {
    let flag = false;
    console.log(" userDetails when login -> ", userDetails );
    this.http.post(this.getSubDomain + '/api/auth/login', userDetails).subscribe({
      next : (res: any) => {
      console.log(" login res -> " , res)
          if (res && res.token) {
              // save user + token in local storage
              localStorage.setItem('currentUser', JSON.stringify({ token : res.token }));
              this.currentUserSubject.next({ token : res.token });
              const decoded: any = jwtDecode(res.token);
              this.details.next(decoded);
              const perm = decoded.permissions || [];
              this.toaster.success('Successfully logged in!');
              flag = true;
              console.log(" 1 ")
              this.router.navigate(['/']);
          } else {
              this.toaster.error("An unexpected error occurred. Please try again later.", "Login Failed");
              console.warn("Login response missing token");
              console.log(" 0 ")
              this.router.navigate(['/login']);
          }
      },
      error : (error) => {
        if(error['error']['error']){
            this.toaster.error(error['error']['message'])
        }
      }
    });
    return flag;
  }

  register(userDetails : any){ 
    this.http.post(this.getSubDomain + '/api/auth/register', userDetails).subscribe({
      next : (res: any) => {
        if(!res['error']){
            this.toaster.success(res['message'], 'Registration Successful!');
            this.router.navigate(['/']); 
        }else{
            this.toaster.error(res['message'], 'Registration Failed');
            this.router.navigate(['/login']);
        }
    },
    error : ( error )=> {
        if(error['error']['error']){
            this.toaster.error(error['error']['message'])
        }
        console.error("Registration error -> ", error['error']['message'], error['error']['error']  );
      }
    })
  }
}
