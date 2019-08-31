import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiPath = 'http://localhost:3000/api/';

  private token = '';
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient) {}


  getToken() {
    return this.token;
  }

  getAuthStatusListner() {
    return this.authStatusListener.asObservable();
  }

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
      // send status of token as observable
      this.authStatusListener.next(true);
    });
  }



}
