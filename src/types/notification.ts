export interface Notification {
    id: number;
    message: string;
    orderStatus?: string;
    notifType: string;
    role?: string;
    isRead: boolean;
    createdAt: string;
    updatedAt?: string;
    orderId?: string;
}