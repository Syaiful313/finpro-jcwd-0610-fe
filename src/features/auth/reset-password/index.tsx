'use client';
import useResetPassword from '@/hooks/api/auth/useResetPassword';
import { useFormik } from 'formik';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import * as Yup from 'yup';
import yupPassword from 'yup-password';
import InvalidToken from '../set-password/components/InvalidToken';
yupPassword(Yup);

interface ResetPasswordPageProps {
  token: string,
}

const ResetPasswordPage:FC<ResetPasswordPageProps> = ({token}) => {
    const router = useRouter();
    const { status } = useSession();   
    const { mutate: resetPassword } = useResetPassword(token);
    const [showPasswords, setShowPasswords] = useState(false);

    useEffect(() => {
        if (status === "authenticated") { router.replace("/user/profile") }
    }, [status, router]); 

    const PasswordSchema = Yup.object().shape({
      newPassword: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .minUppercase(1, 'Must contain at least 1 uppercase letter')
        .minSymbols(1, 'Must contain at least 1 symbol')
        .minNumbers(1, 'Must contain at least 1 number')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Passwords must match')
        .required('Confirm password is required'),
    });

    const formik = useFormik({
      initialValues: {
        newPassword: '',
        confirmPassword: '',
      },
      validationSchema: PasswordSchema,
      onSubmit: async (values) => {
        const { newPassword } = values;
        if (!token) return;
        resetPassword( newPassword );
      },
    });

    const handlePasswordVisibility = () => {
      setShowPasswords(!showPasswords);
    };

    if (!token) {
      return (
        <InvalidToken/>
      )     
    }
    
    return (
      <main>
        <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 relative z-10 flex justify-center px-4 py-48">
          <div className="px-10 max-w-2xl w-full space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 text-start">Reset Your Password</h2>
              <p className="mt-2 text-md text-gray-600 text-start">Enter a new password for your account.</p>
            </div>
            <form className="space-y-8" onSubmit={formik.handleSubmit}>
              <div className="relative"> 
                <label htmlFor="newPassword" className="sr-only">New Password</label>
                  <input id="newPassword"
                        type={showPasswords ? "text" : "password"} 
                        autoComplete="current-password"
                        required
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-primary placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm pr-12" 
                        placeholder="New Password"
                        {...formik.getFieldProps('newPassword')}/>
                    {formik.touched.newPassword && formik.errors.newPassword && (
                      <div className="absolute top-full left-0 text-red-500 text-sm mt-1">{formik.errors.newPassword}</div>
                    )}
              </div>
              <div className="relative">
                <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                <input id="confirmPassword"
                      type={showPasswords ? "text" : "password"} 
                      autoComplete="new-password"
                      placeholder="Confirm New Password"
                      required
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-primary placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm pr-12" 
                      {...formik.getFieldProps('confirmPassword')}/>
                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                      <div className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</div>
                    )}
              </div>
              <div>
                <button type="button"
                        onClick={handlePasswordVisibility}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-lg font-medium rounded-md text-primary bg-secondary hover:cursor-pointer hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary mt-12 mb-4">
                  {showPasswords ? 'Hide Passwords' : 'Show Passwords'}
                </button>
                <button type="submit"
                        disabled={!formik.isValid || formik.isSubmitting}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-primary hover:cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                  {formik.isSubmitting ? 'Setting Password...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    );
};
    
export default ResetPasswordPage;