import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';



@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService){}

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    const authToken = this.authService.getToken();

    // Clone the request
    const authRequest = req.clone({
      // add new value to headers
      headers: req.headers.set('Authorization', 'Bearer ' + authToken)
    });


    return next.handle(authRequest);
  }

}
