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
  private tokenTimer: NodeJS.Timer;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  private userId: string;

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
      email,
      password
    };

    this.http
      .post(this.apiPath + 'user/signup', authData)
      .subscribe(response => {
        console.log(response);
      });
  }

  /* LOGIN
  -------------------------------------------- */
  login(email: string, password: string) {
    const authData: AuthData = {
      email,
      password
    };

    this.http
      .post<{ message: string; token: string; expiresIn: number, userId: string }>(
        this.apiPath + 'user/login',
        authData
      )
      .subscribe(response => {
        const token = response.token;
        this.token = token;

        if (token) {
          // token expiration | to match server users.js
          const tokenExpiresInDuration = response.expiresIn;

          // timer
          this.setAuthTimer(tokenExpiresInDuration);

          // send status of token as observable
          this.isAuthenticated = true;
          this.userId = response.userId;

          // annound to all components listening
          this.authStatusListener.next(true);

          // save authentication to localStorage
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + tokenExpiresInDuration * 1000
          );

          // save userID
          this.saveAuthData(token, expirationDate, this.userId);

          // navigate to home
          this.router.navigate(['/']);
        }
      });
  }

  /* automatically authenticate user if token is valid
   ------------------------------------------------------------- */
  autoAuthUser() {
    const authInformation = this.getAuthData();

    if (!authInformation) {
      return;
    }

    // check if token has not expired
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;

      //
      this.userId = authInformation.userId;

      // works in seconds
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  /* LOGOUT
  ----------------------------------------------------------*/
  logout() {
    // clear token
    this.token = null;
    this.isAuthenticated = false;

    // send to other components listening
    // un-authenticate user
    this.authStatusListener.next(false);

    // clear the timer if manually logged out
    clearTimeout(this.tokenTimer);

    // reset userId once logged out
    this.userId = null;

    this.clearAuthData();


    // navigate to home
    this.router.navigate(['/']);
  }

  /* Timer for authentication
   ---------------------------------------- */
  private setAuthTimer(duration: number) {
    // settimeout works in miliseconds
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  /* store in localStorage
  -------------------------------------------------- */
  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  /* clear localStorage
  ---------------------------------------- */
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  /* GET user id
  -----------------------------------------------------  */
  getUserId() {
    return this.userId;
  }

  /* GET auth data
  ---------------------------------------------------- */
  private getAuthData() {
    // get token from localStorage
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');

    if (!token && !expirationDate) {
      return;
    }

    return {
      token,
      expirationDate: new Date(expirationDate),
      userId
    };
  }
}
