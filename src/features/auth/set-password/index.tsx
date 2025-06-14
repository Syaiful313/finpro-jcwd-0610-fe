'use client';
import useSetPassword from '@/hooks/api/auth/useSetPassword';
import { useFormik } from 'formik';
import { FC, useEffect, useState } from 'react';
import * as Yup from 'yup';
import yupPassword from 'yup-password';
import InvalidToken from './components/InvalidToken';
import { PasswordSchema } from './schema';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
yupPassword(Yup);

interface SetPasswordPageProps {
  token: string,
}

const SetPasswordPage:FC<SetPasswordPageProps> = ({token}) => {
    const router = useRouter();
    const { status } = useSession();
    const { mutate: setPassword } = useSetPassword(token);
    const [showPasswords, setShowPasswords] = useState(false);

    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/user/profile");
        }
    }, [status, router]);  

    const formik = useFormik({
      initialValues: {
        password: '',
        confirmPassword: '',
      },
      validationSchema: PasswordSchema,
      onSubmit: async (values) => {
        const { password } = values;
        if (!token) return;
        setPassword(password);
      },
    });

    const handlePasswordVisibility = () => {
      setShowPasswords(!showPasswords);
    };

    if (!token) {
      return (
        <InvalidToken/>
      );
    }

    return (
        <div className="min-h-screen flex justify-center items-center px-4 bg-gradient-to-br from-white to-blue-50">
          <div className="p-10 max-w-xl w-full mx-auto space-y-8">
            <div className="text-start">
              <h2 className="text-4xl font-extrabold text-gray-900">Set Your New Password</h2>
              <p className="mt-2 text-md text-gray-600">Enter a new password for your account.</p>
            </div>
            <form className="mt-8 space-y-8" onSubmit={formik.handleSubmit}>
              <div className="relative"> 
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  type={showPasswords ? "text" : "password"} 
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-primary placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm pr-12" 
                  placeholder="Password"
                  {...formik.getFieldProps('password')}
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="absolute top-full left-0 text-red-500 text-sm mt-1">{formik.errors.password}</div>
                )}
              </div>
              <div className="relative">
                <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type={showPasswords ? "text" : "password"} 
                  autoComplete="new-password"
                  placeholder="Confirm New Password"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-primary placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm pr-12" 
                  {...formik.getFieldProps('confirmPassword')}
                />
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</div>
                )}
              </div>
              <div>
                <button
                  type="button"
                  onClick={handlePasswordVisibility}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-lg font-medium rounded-md text-primary bg-secondary hover:cursor-pointer hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary mb-4" 
                >
                  {showPasswords ? 'Hide Passwords' : 'Show Passwords'}
                </button>
                <button
                  type="submit"
                  disabled={!formik.isValid || formik.isSubmitting}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-primary hover:cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formik.isSubmitting ? 'Setting Password...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
    );
};

export default SetPasswordPage;