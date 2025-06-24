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
    })
    .test("within-working-hours", "Pickup time only available between 9:00 AM and 8:00 PM", (val) => {
        if (!val) return false;
        const date = new Date(val);
        const hour = date.getHours();
        return hour >= 9 && hour < 20;
    }),
});