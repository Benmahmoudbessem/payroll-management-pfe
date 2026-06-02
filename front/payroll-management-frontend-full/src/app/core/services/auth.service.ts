import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { AuthResponseDto, CurrentUserDto, LoginRequestDto, RegisterRequestDto } from '../../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenKey = 'payroll_token';
  private readonly currentUserSubject = new BehaviorSubject<CurrentUserDto | null>(null);
  readonly currentUser$ = this.currentUserSubject.asObservable();

  login(payload: LoginRequestDto): Observable<AuthResponseDto> {
    return this.http.post<AuthResponseDto>(`${API_BASE_URL}/auth/login`, payload).pipe(
      tap(res => localStorage.setItem(this.tokenKey, res.token))
    );
  }

  register(payload: RegisterRequestDto): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${API_BASE_URL}/auth/register`, payload);
  }

  me(): Observable<CurrentUserDto> {
    return this.http.get<CurrentUserDto>(`${API_BASE_URL}/auth/me`).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
  }

  get token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }
}
