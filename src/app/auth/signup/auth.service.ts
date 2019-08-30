import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiPath = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) {}

  createUser(email: string, password: string) {

    const authData: AuthData = {
      email: email,
      password: password
    };

    this.http.post((this.apiPath + 'user/signup'), authData)
    .subscribe(response => {
      console.log(response);
    });
  }
}
