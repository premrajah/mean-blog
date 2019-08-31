import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiPath = 'http://localhost:3000/api/';

  private token = '';
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getAuthStatusListner() {
    return this.authStatusListener.asObservable();
  }

  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };

    this.http
      .post(this.apiPath + 'user/signup', authData)
      .subscribe(response => {
        console.log(response);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };

    this.http
      .post<{ token: string }>(this.apiPath + 'user/login', authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;

        if (token) {
          // send status of token as observable
          this.isAuthenticated = true;
          this.authStatusListener.next(true);

          // navigate to home
          this.router.navigate(['/']);
        }
      });
  }

  logout() {
    // clear token
    this.token = null;
    this.isAuthenticated = false;

    // send to other components listening
    // un-authenticate user
    this.authStatusListener.next(false);

    // navigate to home
    this.router.navigate(['/']);
  }
}
