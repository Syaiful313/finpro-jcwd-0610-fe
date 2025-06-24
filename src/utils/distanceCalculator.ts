export class DistanceCalculator {
  static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371;
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 100) / 100;
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  static calculateDeliveryFee(
    distance: number,
    outlet: {
      deliveryBaseFee: number;
      deliveryPerKm: number;
      serviceRadius: number;
    },
  ): number {
    if (distance > outlet.serviceRadius) {
      throw new Error(
        `Alamat diluar jangkauan layanan. Maksimal ${outlet.serviceRadius}km`,
      );
    }

    const deliveryFee =
      outlet.deliveryBaseFee + distance * outlet.deliveryPerKm;
    return Math.round(deliveryFee);
  }

  static getDeliveryEstimation(
    customerCoords: { latitude: number; longitude: number } | null,
    outletInfo: {
      latitude: number;
      longitude: number;
      deliveryBaseFee: number;
      deliveryPerKm: number;
      serviceRadius: number;
    } | null,
  ): {
    success: boolean;
    distance?: number;
    fee?: number;
    error?: string;
  } {
    if (!customerCoords || !outletInfo) {
      return {
        success: false,
        error: "Data koordinat tidak lengkap",
      };
    }

    try {
      const distance = this.calculateDistance(
        outletInfo.latitude,
        outletInfo.longitude,
        customerCoords.latitude,
        customerCoords.longitude,
      );

      if (distance > outletInfo.serviceRadius) {
        return {
          success: false,
          error: `Alamat diluar jangkauan layanan (${distance}km > ${outletInfo.serviceRadius}km)`,
        };
      }

      const fee = this.calculateDeliveryFee(distance, outletInfo);

      return {
        success: true,
        distance,
        fee,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Gagal menghitung jarak",
      };
    }
  }
}
