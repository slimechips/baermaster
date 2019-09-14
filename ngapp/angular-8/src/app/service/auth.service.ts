import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userLoginUrl = 'http://localhost:3030/user/login';
  private _customerLoginUrl = 'http://localhost:3030/customer/login';
  constructor(private http: HttpClient) {
  }

  loginUser(userId,password){
    return this.http.get<any>(this._userLoginUrl+`?username=${userId}&password=${password}`);
  }

  loginClient(clientId,password){
    return this.http.get<any>(this._customerLoginUrl+`?username=${clientId}&password=${password}`);
  }
  // how to save the cookies?
}
