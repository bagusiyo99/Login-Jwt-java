import { Injectable } from '@angular/core';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  static saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  static getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  static getUser(): any {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }

  static signout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

  static saveUser(user: any): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  static clearStorage(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  static getUserRole(): string {
    const user = this.getUser();
    if (user && user.role) {
      return user.role;
    }
    return '';
  }

  static isAdminLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    const role = this.getUserRole();
    return role === 'ADMIN';
  }

  static isCustomerLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    const role = this.getUserRole();
    return role === 'CUSTOMER';
  }
}
