import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp: number;
  userName: number;
}

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

  IsValidToken(): boolean {
    try{
      const token = localStorage.getItem(this.accessToken);
      if (!token) return false;

      const payload = jwtDecode<JwtPayload>(token);
      if (payload.exp < (Date.now() / 1000)) return false;

      return true;
    } catch {
      return false;
    }
  }

  RefreshToken(): Observable<any> {
    const accessToken = localStorage.getItem(this.accessToken);
    return this._http.post(`${environment.apiUrl}refresh`, { accessToken }, { withCredentials: true });
  }

  SetAccessToken(token: string): void {
    localStorage.setItem(this.accessToken, token);
  }

  Login(userEmail: string, password: string): Observable<any> {
    return this._http.post(`${environment.apiUrl}login`, { userEmail, password }, { withCredentials: true });
  }

  CreateUser(userName: string, userEmail: string, password: string): Observable<any> {
    return this._http.post(`${environment.apiUrl}createUser`, { userName, userEmail, password });
  }
}
