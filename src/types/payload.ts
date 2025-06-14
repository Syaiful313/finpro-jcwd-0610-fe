export interface PayloadCreateAndEditAddress {
    addressId: number;
    addressName: string;
    addressLine: string;
    district: string;
    city: string;
    province: string;
    postalCode: string;
    latitude: number;
    longitude: number;
    isPrimary: boolean;
}

export interface PayloadCreateAddressList {
  addresses: PayloadCreateAndEditAddress[];
}