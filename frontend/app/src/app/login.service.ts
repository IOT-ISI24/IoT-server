import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://127.0.0.1:8000/login/';
  private signupUrl = 'http://127.0.0.1:8000/signup/';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<string> {
    const body = { username, password };
    return this.http.post<{ token: string }>(this.loginUrl, body).pipe(
      map(response => response.token),
      catchError(error => {
        return throwError(() => new Error('Login failed'));
      })
    );
  }

  register(username: string, email: string, password: string ): Observable<any> {
    const body = { username, email, password};
    return this.http.post(this.signupUrl, body).pipe(
      catchError(error => {
        if (error.status === 406) {
          console.log(error.error.message);
          return throwError(() => new Error(error.error.message));
        }
        else{
          return throwError(() => new Error('Unexpected error occurred. Please try again later.'));
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('authToken');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getAuthorizationHeader() {
    return {
      headers: new HttpHeaders()
        .set('Authorization',  `Token ${this.getToken()}`)
    };
  }
}