export interface Address {
  id?: number;            
  userId?: number;        
  addressName: string;
  addressLine: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  isPrimary: boolean;
  createdAt?: string;     
  updatedAt?: string;     
}