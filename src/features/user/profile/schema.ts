import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  firstName: Yup.string().notRequired().nullable(),
  lastName: Yup.string().notRequired().nullable(),
  email: Yup.string().email('Invalid email').notRequired().nullable(),
  phoneNumber: Yup.string().matches(/^(\+62|62|0)8[1-9][0-9]{6,9}$/, 'Invalid Indonesian phone number').notRequired().nullable(),
});