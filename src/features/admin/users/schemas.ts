import * as Yup from "yup";

interface CreateUserSchemaOptions {
  isEditMode?: boolean;
}

const AVAILABLE_ROLES = [
  "ADMIN",
  "OUTLET_ADMIN",
  "CUSTOMER",
  "WORKER",
  "DRIVER",
];

export const createUserValidationSchema = ({
  isEditMode = false,
}: CreateUserSchemaOptions = {}) => {
  return Yup.object({
    email: Yup.string()
      .email("Format email tidak valid")
      .required("Email wajib diisi"),

    firstName: Yup.string()
      .min(2, "Nama depan minimal 2 karakter")
      .required("Nama depan wajib diisi"),

    lastName: Yup.string()
      .min(2, "Nama belakang minimal 2 karakter")
      .required("Nama belakang wajib diisi"),

    password: !isEditMode
      ? Yup.string()
          .min(8, "Password minimal 8 karakter")
          .matches(
            /^(?=.*[a-zA-Z])(?=.*\d)/,
            "Password harus kombinasi huruf dan angka",
          )
          .required("Password wajib diisi")
      : Yup.string()
          .optional()
          .test(
            "password-strength",
            "Password harus kombinasi huruf dan angka",
            function (value) {
              if (!value || value === "") return true;
              return /^(?=.*[a-zA-Z])(?=.*\d)/.test(value) && value.length >= 8;
            },
          ),

    role: Yup.string()
      .oneOf(AVAILABLE_ROLES, "Role tidak valid")
      .required("Role wajib dipilih"),

    phoneNumber: Yup.string()
      .required("Nomor telepon wajib diisi")
      .matches(
        /^08[0-9]{8,11}$/,
        "Format nomor telepon tidak valid (08xxxxxxxxxx, 10-13 digit)",
      ),

    provider: Yup.string()
      .oneOf(["CREDENTIAL", "GOOGLE"], "Provider tidak valid")
      .required("Provider wajib dipilih"),

    isVerified: Yup.boolean(),

    outletId: Yup.string().when("role", {
      is: (role: string) => ["OUTLET_ADMIN", "WORKER", "DRIVER"].includes(role),
      then: (schema) => schema.required("Outlet wajib dipilih untuk role ini"),
      otherwise: (schema) => schema.optional(),
    }),

    npwp: Yup.string().when("role", {
      is: (role: string) => ["OUTLET_ADMIN", "WORKER", "DRIVER"].includes(role),
      then: (schema) =>
        schema
          .required("NPWP wajib diisi untuk role ini")
          .matches(/^[0-9]{15}$/, "NPWP harus berupa 15 digit angka"),
      otherwise: (schema) => schema.optional(),
    }),
  });
};

export const validateProfilePicture = (
  role: string,
  profile: File | null,
  isEditMode: boolean = false,
): string | null => {
  const requiresProfile = ["OUTLET_ADMIN", "WORKER", "DRIVER"].includes(role);

  if (isEditMode && !profile) {
    return null;
  }

  if (!isEditMode && requiresProfile && !profile) {
    return `Foto profil wajib diupload untuk role ${role}`;
  }

  if (profile) {
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(profile.type)) {
      return "Hanya file JPEG, JPG, dan PNG yang diperbolehkan";
    }

    const maxSize = 2 * 1024 * 1024;
    if (profile.size > maxSize) {
      return "Ukuran file harus kurang dari 2MB";
    }
  }

  return null;
};

export const isProfileRequired = (role: string): boolean => {
  return ["OUTLET_ADMIN", "WORKER", "DRIVER"].includes(role);
};

export const isEmployeeDataRequired = (role: string): boolean => {
  return ["OUTLET_ADMIN", "WORKER", "DRIVER"].includes(role);
};
