import { Injectable } from '@angular/core';
import { User } from './user';
import { users } from './user-data';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/service/auth.service';

@Injectable()
export class UserService {
  public users: User[] = users;
  domain : any = '';

  constructor( private http : HttpClient, private authentication : AuthService){
    this.domain = authentication.getSubDomain;
  }


  getAllUsers(){
    console.log(" users service ", " domain -> ", this.domain );
    return this.http.get<any>(this.domain + '/api/getAllUsers');
  }
  public getUser() {
    return this.users;
  }
}
