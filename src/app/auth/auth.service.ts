import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiPath = 'http://localhost:3000/api/';

  private token = '';

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

  login(email: string, password: string) {

    const authData: AuthData = {
      email: email,
      password: password
    };

    this.http.post<{token: string}>((this.apiPath + 'user/login'), authData)
    .subscribe(response => {
      const token = response.token;
      this.token = token;
    });
  }


  getToken() {
    return this.token;
  }

}
