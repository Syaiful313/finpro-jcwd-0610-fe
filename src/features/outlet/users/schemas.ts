import * as Yup from "yup";

export const CreateOutletUserSchema = Yup.object({
  email: Yup.string()
    .email("Format email tidak valid")
    .required("Email wajib diisi"),
  firstName: Yup.string()
    .min(2, "Nama depan minimal 2 karakter")
    .required("Nama depan wajib diisi"),
  lastName: Yup.string()
    .min(2, "Nama belakang minimal 2 karakter")
    .required("Nama belakang wajib diisi"),
  password: Yup.string().when("$isEditMode", {
    is: false,
    then: (schema) =>
      schema
        .min(8, "Password minimal 8 karakter")
        .matches(
          /^(?=.*[a-zA-Z])(?=.*\d)/,
          "Password harus kombinasi huruf dan angka",
        )
        .required("Password wajib diisi"),
    otherwise: (schema) => schema.notRequired(),
  }),
  role: Yup.string()
    .oneOf(["WORKER", "DRIVER"], "Role harus Worker atau Driver")
    .required("Role wajib dipilih"),

  npwp: Yup.string().when("role", {
    is: (role: string) => ["WORKER", "DRIVER"].includes(role),
    then: (schema) =>
      schema
        .matches(
          /^\d{2}\.\d{3}\.\d{3}\.\d{1}-\d{3}\.\d{3}$/,
          "Format NPWP tidak valid (XX.XXX.XXX.X-XXX.XXX)",
        )
        .required("NPWP wajib diisi untuk Worker dan Driver"),
    otherwise: (schema) => schema.notRequired(),
  }),
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
  notificationId: Yup.string()
    .matches(/^\d+$/, "Notification ID harus berupa angka")
    .notRequired(),

  profile: Yup.mixed().when("$isEditMode", {
    is: false,
    then: (schema) =>
      schema
        .test("required", "Profile picture wajib diupload", (value) => {
          return value instanceof File;
        })
        .test("fileSize", "Ukuran file maksimal 5MB", (value) => {
          if (!value) return false;
          if (value instanceof File) {
            return value.size <= 2 * 1024 * 1024;
          }
          return true;
        })
        .test("fileType", "Format file harus JPG, JPEG, atau PNG", (value) => {
          if (!value) return false;
          if (value instanceof File) {
            return ["image/jpeg", "image/jpg", "image/png"].includes(
              value.type,
            );
          }
          return true;
        }),
    otherwise: (schema) => schema.notRequired(),
  }),
});
