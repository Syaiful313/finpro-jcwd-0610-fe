export interface Outlet {
  id: number;
  outletName: string;
  address: string;
  latitude: number;
  longitude: number;
  serviceRadius: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    employees: number;
    orders: number;
    users: number;
  };
}