import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoginSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private httpClient: HttpClient) { }

  /**
 * if we have token the user is loggedIn
 * @returns {boolean}
 */

  hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoginSubject.asObservable();
  }

  logout(): void {
    localStorage.removeItem('token');
    sessionStorage.removeItem('CurrentUserDetails');
    this.isLoginSubject.next(false); // update everyone who signed to isLoginSubject
  }

  public getToken(): string {
    return localStorage.getItem('token');
  }

  login(name: string, pass: string): Observable<any> {
    const bodyStr = { username: name, password: pass };
    return this.httpClient.post('http://localhost:3000/auth/login', bodyStr);
  }

  signup(userDetails) : Observable<any>{
     const bodyStr = { username: userDetails.username, password: userDetails.password, email: userDetails.email };
     return this.httpClient.post('http://localhost:3000/auth/register', bodyStr);
  }

  saveToLocalStorage = (token): void => {
    localStorage.setItem('token', token);
  }
}
