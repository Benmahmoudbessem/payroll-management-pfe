import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { API_BASE_URL } from '../config/api.config';
import { NotificationItem } from '../../models/notification.models';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_BASE_URL}/notifications`;
  private readonly hubUrl = `${API_BASE_URL.replace('/api', '')}/hubs/notifications`;

  private hubConnection?: HubConnection;
  private notificationSubject = new Subject<NotificationItem>();

  notificationReceived$ = this.notificationSubject.asObservable();

  getAll(): Observable<NotificationItem[]> {
    return this.http.get<NotificationItem[]>(this.apiUrl);
  }

  getByEmployee(employeeId: string): Observable<NotificationItem[]> {
    return this.http.get<NotificationItem[]>(`${this.apiUrl}/employee/${employeeId}`);
  }
  delete(id: string) {
  return this.http.delete(`${this.apiUrl}/${id}`);
}

  markAsRead(id: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/${id}/read`, {});
  }

  async startConnection(isAdminOrRh: boolean, employeeId?: string): Promise<void> {
    if (this.hubConnection) return;

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl)
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('ReceiveNotification', (notification: NotificationItem) => {
      this.notificationSubject.next(notification);
    });

    await this.hubConnection.start();

    if (isAdminOrRh) {
      await this.hubConnection.invoke('JoinAdminRhGroup');
    }

    if (employeeId) {
      await this.hubConnection.invoke('JoinEmployeeGroup', employeeId);
    }
  }
}