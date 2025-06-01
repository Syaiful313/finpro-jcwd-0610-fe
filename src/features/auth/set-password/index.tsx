'use client';

import { FC, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Image from 'next/image';
import useSetPassword from '@/hooks/api/auth/useSetPassword';

interface SetPasswordPageProps {
  token: string | null,
}

const SetPasswordPage:FC<SetPasswordPageProps> = ({token}) => {
    const { mutate: setPassword } = useSetPassword();
    const [showPasswords, setShowPasswords] = useState(false);
    const PasswordSchema = Yup.object().shape({
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
    });

    const formik = useFormik({
      initialValues: {
        password: '',
        confirmPassword: '',
      },
      validationSchema: PasswordSchema,
      onSubmit: async (values) => {
        const { password } = values;
        if (!token) return;
        setPassword({token, password});
      },
    });

    const handlePasswordVisibility = () => {
      setShowPasswords(!showPasswords);
    };

    if (!token) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 text-center">
            <h2 className="mt-6 text-2xl font-bold text-gray-900">Invalid or missing verification link.</h2>
            <p className="mt-2 text-sm text-gray-600">Please check your email for the correct verification link.</p>
          </div>
        </div>
      );
    }

    return (
      <>
        <div
          className="fixed top-0 left-0 w-screen h-screen z-[-1] animated-gradient-background"
          style={{
            background: 'linear-gradient(to right, #6dd5ed, #2193b0, #74ebd5, #acb6e5)',
            backgroundSize: '400% 400%',
          }}
        ></div>
        <div className="relative z-10 flex justify-center items-center min-h-screen p-10 px-4" style={{ fontFamily: '"Inter", sans-serif' }}>
          <div className="bg-white p-10 rounded-md shadow-md max-w-md w-full mx-auto space-y-8">
            <div className="text-center">
              <Image
                className="mx-auto h-12 w-auto mb-8"
                src="/logo-text.svg"
                alt="Bubblify Logo"
                width="12"
                height="12"
              />
              <h2 className="text-3xl font-extrabold text-gray-900">Set Your New Password</h2>
              <p className="mt-2 text-sm text-gray-600">Enter a new password for your account.</p>
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
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-md font-medium rounded-md text-primary bg-secondary hover:cursor-pointer hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary mb-4" 
                >
                  {showPasswords ? 'Hide Passwords' : 'Show Passwords'}
                </button>
                <button
                  type="submit"
                  disabled={!formik.isValid || formik.isSubmitting}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-md font-medium rounded-md text-white bg-primary hover:cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formik.isSubmitting ? 'Setting Password...' : 'Set Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
};

export default SetPasswordPage;