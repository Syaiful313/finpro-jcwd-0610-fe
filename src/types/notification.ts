export interface Notification {
    id: number;
    message: string;
    orderStatus?: string;
    notifType: string;
    role?: string;
    readByUserIds: number[];
    createdAt: string;
    updatedAt?: string;
    orderId?: string;
}