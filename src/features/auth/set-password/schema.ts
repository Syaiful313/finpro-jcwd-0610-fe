import * as Yup from 'yup';
import yupPassword from 'yup-password';
yupPassword(Yup);

export const PasswordSchema = Yup.object().shape({
    password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .minUppercase(1, 'Must contain at least 1 uppercase letter')
    .minSymbols(1, 'Must contain at least 1 symbol')
    .minNumbers(1, 'Must contain at least 1 number')
    .required('Password is required'),
    confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});