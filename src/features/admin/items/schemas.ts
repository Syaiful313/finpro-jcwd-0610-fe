import * as Yup from "yup";

interface CreateLaundryItemValidationOptions {
  isEditMode?: boolean;
}

export const createLaundryItemValidationSchema = ({
  isEditMode = false,
}: CreateLaundryItemValidationOptions) => {
  return Yup.object({
    name: Yup.string()
      .required("Nama item wajib diisi")
      .min(2, "Nama item minimal 2 karakter")
      .max(100, "Nama item maksimal 100 karakter")
      .trim(),

    category: Yup.string()
      .required("Kategori wajib diisi")
      .min(2, "Kategori minimal 2 karakter")
      .max(50, "Kategori maksimal 50 karakter")
      .trim(),

    basePrice: Yup.number()
      .required("Harga wajib diisi")
      .min(0, "Harga tidak boleh negatif")
      .max(999999999, "Harga maksimal 999,999,999")
      .typeError("Harga harus berupa angka"),

    pricingType: Yup.string()
      .required("Tipe pricing wajib dipilih")
      .oneOf(["PER_PIECE", "PER_KG"], "Tipe pricing harus PER_PIECE atau PER_KG"),

    isActive: Yup.boolean().required("Status aktif wajib dipilih"),
  });
};

export const validatePrice = (price: number) => {
  const priceNum = Number(price);

  if (isNaN(priceNum)) {
    return "Harga harus berupa angka yang valid";
  }

  if (priceNum < 0) {
    return "Harga tidak boleh negatif";
  }

  if (priceNum > 999999999) {
    return "Harga maksimal 999,999,999";
  }

  return null;
};

export const validatePricingType = (pricingType: string) => {
  if (!pricingType) {
    return "Tipe pricing wajib dipilih";
  }

  if (!["PER_PIECE", "PER_KG"].includes(pricingType)) {
    return "Tipe pricing harus PER_PIECE atau PER_KG";
  }

  return null;
};

export const validateItemName = (name: string) => {
  if (!name || name.trim().length === 0) {
    return "Nama item wajib diisi";
  }

  if (name.trim().length < 2) {
    return "Nama item minimal 2 karakter";
  }

  if (name.trim().length > 100) {
    return "Nama item maksimal 100 karakter";
  }

  return null;
};