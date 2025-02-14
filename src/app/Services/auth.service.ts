import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  private usernameSubject = new BehaviorSubject<string | null>(localStorage.getItem('username'));

  username$ = this.usernameSubject.asObservable(); // Observable for real-time updates

  setUser(username: string) {
    localStorage.setItem('username', username);
    this.usernameSubject.next(username); // Notify subscribers
  }

  clearUser() {
    localStorage.removeItem('username');
    this.usernameSubject.next(null);
  }

}
