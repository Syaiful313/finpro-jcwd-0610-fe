import * as Yup from "yup";

interface CreateUserSchemaOptions {
  isEditMode?: boolean;
  currentUserRole?: string;
}

export const createUserValidationSchema = ({
  isEditMode = false,
  currentUserRole = "ADMIN",
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
      : Yup.string().optional(),

    role: Yup.string()
      .oneOf(
        ["ADMIN", "OUTLET_ADMIN", "CUSTOMER", "WORKER", "DRIVER"],
        "Role tidak valid",
      )
      .required("Role wajib dipilih"),

    phoneNumber: Yup.string().test(
      "phone-validation",
      "Format nomor telepon tidak valid (08xxxxxxxxxx)",
      function (value) {
        if (!value || value.trim() === "") return true;

        return /^08[0-9]{8,11}$/.test(value);
      },
    ),

    provider: Yup.string()
      .oneOf(["CREDENTIAL", "GOOGLE"], "Provider tidak valid")
      .required("Provider wajib dipilih"),

    isVerified: Yup.boolean(),

    notificationId: Yup.string().optional(),

    outletId: Yup.string().when("role", {
      is: (role: string) => ["OUTLET_ADMIN", "WORKER", "DRIVER"].includes(role),
      then: (schema) => {
        if (currentUserRole === "OUTLET_ADMIN") {
          return schema.optional();
        }

        return schema.required("Outlet wajib dipilih untuk role ini");
      },
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
  if (isEditMode) return null;

  const requiresProfile = ["OUTLET_ADMIN", "WORKER", "DRIVER"].includes(role);

  if (requiresProfile && !profile) {
    return `Foto profil wajib diupload untuk role ${role}`;
  }

  if (profile) {
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(profile.type)) {
      return "Only JPEG, JPG, and PNG files are allowed";
    }

    const maxSize = 2 * 1024 * 1024;
    if (profile.size > maxSize) {
      return "File size must be less than 5MB";
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
