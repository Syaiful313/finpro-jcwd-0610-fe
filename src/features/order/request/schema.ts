import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
    addressId: Yup.number()
    .required("Choose an address for your pickup")
    .typeError("Choose an address for your pickup"),
    scheduledPickupTime: Yup.string()
    .required("Please input pickup schedule time")
    .test("is-valid-date", "Date format invalid", (val) => !isNaN(Date.parse(val ?? "")))
    .test("is-future", "Pickup time is at least 1 hour from now", (val) => {
        if (!val) return false;
        return new Date(val) > new Date(Date.now() + 60 * 60 * 1000);
    }),
});