export interface INotification {
  userid: string;
  isRead: boolean;
  totalNotifications: number;
  numberOfNotificationNotRead: number;
  userRole?: string;
  notificationid?: string;
  oldValue: string;
  newValue: string;
  listNotification: IListNotification[];
}

export interface IListNotification {
  id: string;
  title?: string;
  isRead: boolean;
  activityid?: string;
  modifiedAt: string;
  modifiedBy: string;
  projectid?: string;
  subTable?: string;
  table?: string;
  type?: string;
  userName?: string;
  userRole?: string;
  userRoleInProject?: string;
  oldValue: string;
  newValue: string;
}
