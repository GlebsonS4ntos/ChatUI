import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private _http: HttpClient) { }

  private accessToken = 'access-token';

  IsAuthenticated(): boolean {
    const token = localStorage.getItem(this.accessToken);

    return !!token;
  }

  SetAccessToken(token: string): void {
    localStorage.setItem(this.accessToken, token);
  }

  Login(userEmail: string, password: string): Observable<any> {
    return this._http.post(`${environment.apiUrl}login`, { userEmail, password });
  }

  CreateUser(userName: string, userEmail: string, password: string): Observable<any> {
    return this._http.post(`${environment.apiUrl}createUser`, { userName, userEmail, password });
  }
}
