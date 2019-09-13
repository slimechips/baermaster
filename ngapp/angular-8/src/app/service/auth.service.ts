import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _loginUrl = 'http://localhost:3030/user/login';
  constructor(private http: HttpClient) {
  }

  loginUser(userId,password){
    return this.http.get<any>(this._loginUrl+`?username=${userId}&password=${password}`);
  }
  // how to save the cookies?
}
