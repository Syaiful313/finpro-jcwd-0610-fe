// utils/distanceCalculator.ts
export class DistanceCalculator {
  /**
   * Calculate distance between two coordinates using Haversine formula
   * @param lat1 Latitude of first point
   * @param lon1 Longitude of first point  
   * @param lat2 Latitude of second point
   * @param lon2 Longitude of second point
   * @returns Distance in kilometers
   */
  static calculateDistance(
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance * 100) / 100; // Round to 2 decimal places
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Calculate delivery fee based on distance and outlet pricing
   * @param distance Distance in kilometers
   * @param outlet Outlet with pricing information
   * @returns Delivery fee in rupiah
   */
  static calculateDeliveryFee(
    distance: number,
    outlet: { deliveryBaseFee: number; deliveryPerKm: number; serviceRadius: number }
  ): number {
    // Check if within service radius
    if (distance > outlet.serviceRadius) {
      throw new Error(`Alamat diluar jangkauan layanan. Maksimal ${outlet.serviceRadius}km`);
    }

    const deliveryFee = outlet.deliveryBaseFee + (distance * outlet.deliveryPerKm);
    return Math.round(deliveryFee); // Round to nearest rupiah
  }

  /**
   * Get delivery estimation with error handling
   * @param customerCoords Customer coordinates
   * @param outletInfo Outlet information
   * @returns Delivery estimation object
   */
  static getDeliveryEstimation(
    customerCoords: { latitude: number; longitude: number } | null,
    outletInfo: { 
      latitude: number; 
      longitude: number; 
      deliveryBaseFee: number; 
      deliveryPerKm: number; 
      serviceRadius: number;
    } | null
  ): {
    success: boolean;
    distance?: number;
    fee?: number;
    error?: string;
  } {
    if (!customerCoords || !outletInfo) {
      return {
        success: false,
        error: "Data koordinat tidak lengkap"
      };
    }

    try {
      const distance = this.calculateDistance(
        outletInfo.latitude,
        outletInfo.longitude,
        customerCoords.latitude,
        customerCoords.longitude
      );

      if (distance > outletInfo.serviceRadius) {
        return {
          success: false,
          error: `Alamat diluar jangkauan layanan (${distance}km > ${outletInfo.serviceRadius}km)`
        };
      }

      const fee = this.calculateDeliveryFee(distance, outletInfo);

      return {
        success: true,
        distance,
        fee
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Gagal menghitung jarak"
      };
    }
  }
}