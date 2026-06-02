export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  sentAt: string;
  isRead: boolean;
  employeeId?: string;
  employee?: {
    id: string;
    firstName: string;
    lastName: string;
    matricule: string;
  } | null;
}