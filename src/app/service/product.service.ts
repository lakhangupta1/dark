import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  domain = '';
  constructor(private authService : AuthService, private http : HttpClient) { 
    this.domain = authService.getSubDomain;  
  }

  editProducts(productDetails : FormData, id : string){
    return this.http.post<any>(`${this.domain}/api/editProduct/${id}`, productDetails);
  }

  createProduct(productDetails : FormData){
    return this.http.post<any>(`${this.domain}/api/createProduct`, productDetails);
  }

  getProductById(prod_id : string){
    return this.http.get<any>(`${this.domain}/api/getProductById/${prod_id}`);
  }

}
