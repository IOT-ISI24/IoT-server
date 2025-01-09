import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './login.service';
import { throwError, catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EspDataService {
  header: any;
  private espDataUrl = 'http://127.0.0.1:8000/manage/'

  constructor(private http: HttpClient, private authService: AuthService) {
    this.header = authService.getAuthorizationHeader();
  }

  getEspData(): Observable<any> {
    return this.http.get(this.espDataUrl, this.header).pipe(
      catchError(error => {
        if (error.status === 401) {
          return throwError(() => ({
            type: 'Unauthorized',
            message: 'You are not authorized to access this data.',
          }));
        }
        return throwError(() => ({
          type: 'GeneralError',
          message: error.message || 'An unknown error occurred.',
        }));
      })
    );
  }
  
  
}
