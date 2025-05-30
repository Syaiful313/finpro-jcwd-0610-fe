import * as Yup from "yup";

export const CretaUserSchema = Yup.object({
  email: Yup.string()
    .email("Format email tidak valid")
    .required("Email wajib diisi"),
  firstName: Yup.string()
    .min(2, "Nama depan minimal 2 karakter")
    .required("Nama depan wajib diisi"),
  lastName: Yup.string()
    .min(2, "Nama belakang minimal 2 karakter")
    .required("Nama belakang wajib diisi"),
  password: Yup.string().when("$isEditMode", (isEditMode, schema) => {
    return !isEditMode
      ? schema
          .min(8, "Password minimal 8 karakter")
          .matches(
            /^(?=.*[a-zA-Z])(?=.*\d)/,
            "Password harus kombinasi huruf dan angka",
          )
          .required("Password wajib diisi")
      : schema;
  }),
  role: Yup.string()
    .oneOf(
      ["ADMIN", "OUTLET_ADMIN", "CUSTOMER", "WORKER", "DRIVER"],
      "Role tidak valid",
    )
    .required("Role wajib dipilih"),
  phoneNumber: Yup.string()
    .matches(
      /^08[0-9]{8,11}$/,
      "Format nomor telepon tidak valid (08xxxxxxxxxx)",
    )
    .required("Nomor telepon wajib diisi"),
  provider: Yup.string()
    .oneOf(["CREDENTIAL", "GOOGLE"], "Provider tidak valid")
    .required("Provider wajib dipilih"),
  isVerified: Yup.boolean(),
});
