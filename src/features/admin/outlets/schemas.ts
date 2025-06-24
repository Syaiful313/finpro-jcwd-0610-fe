import * as Yup from "yup";

interface CreateOutletValidationOptions {
  isEditMode?: boolean;
}

export const createOutletValidationSchema = ({
  isEditMode = false,
}: CreateOutletValidationOptions) => {
  return Yup.object({
    outletName: Yup.string()
      .required("Nama outlet wajib diisi")
      .min(2, "Nama outlet minimal 2 karakter")
      .max(100, "Nama outlet maksimal 100 karakter")
      .trim(),

    address: Yup.string()
      .required("Alamat wajib diisi")
      .min(10, "Alamat minimal 10 karakter")
      .max(255, "Alamat maksimal 255 karakter")
      .trim(),

    latitude: Yup.number()
      .required("Latitude wajib diisi")
      .min(-90, "Latitude harus antara -90 dan 90")
      .max(90, "Latitude harus antara -90 dan 90")
      .typeError("Latitude harus berupa angka"),

    longitude: Yup.number()
      .required("Longitude wajib diisi")
      .min(-180, "Longitude harus antara -180 dan 180")
      .max(180, "Longitude harus antara -180 dan 180")
      .typeError("Longitude harus berupa angka"),

    serviceRadius: Yup.number()
      .required("Radius layanan wajib diisi")
      .min(0.5, "Radius layanan minimal 0.5 km")
      .max(15, "Radius layanan maksimal 15 km")
      .typeError("Radius layanan harus berupa angka"),

    isActive: Yup.boolean().required("Status aktif wajib dipilih"),
  });
};

export const validateCoordinates = (latitude: number, longitude: number) => {
  const lat = Number(latitude);
  const lng = Number(longitude);

  if (isNaN(lat) || isNaN(lng)) {
    return "Koordinat harus berupa angka yang valid";
  }

  if (lat < -90 || lat > 90) {
    return "Latitude harus antara -90 dan 90";
  }

  if (lng < -180 || lng > 180) {
    return "Longitude harus antara -180 dan 180";
  }

  return null;
};

export const validateServiceRadius = (radius: number) => {
  const rad = Number(radius);

  if (isNaN(rad)) {
    return "Radius layanan harus berupa angka";
  }

  if (rad < 0.5) {
    return "Radius layanan minimal 0.5 km";
  }

  if (rad > 15) {
    return "Radius layanan maksimal 15 km";
  }

  return null;
};
