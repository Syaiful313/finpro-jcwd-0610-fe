export interface Outlet {
  id: number;
  outletName: string;
  address: string;
  latitude: number;
  longitude: number;
  serviceRadius: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
