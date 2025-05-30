'use client';

import Link from "next/link";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useLogin from "@/hooks/api/auth/useLogin";

const LoginPage = () => {
    const { mutate: login, error } = useLogin();
    const LoginSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: LoginSchema,
        onSubmit: (values) => {
            login(values);
            console.log('Form submitted with:', values);
        },
    });

    return (
        <div className="min-h-screen bg-white flex justify-center px-4 sm:px-6 lg:px-8 pt-10 md:pt-20">
            <div className="max-w-md w-full space-y-8 bg-white px-10 rounded-lg">
                <div className="text-center">
                    <h2 className="text-4xl font-extrabold text-gray-900">Welcome back!</h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
                    <div>
                        <label htmlFor="email-address" className="sr-only">Email address</label>
                        <input
                            id="email-address"
                            type="email"
                            autoComplete="email"
                            required
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-primary placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                            placeholder="Email"
                            {...formik.getFieldProps('email')}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                        )}
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-primary placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                            placeholder="Password"
                            {...formik.getFieldProps('password')}
                        />
                        {formik.touched.password && formik.errors.password && (
                            <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                        )}
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <Link href="#" className="font-medium text-md text-primary hover:text-blue-500">I forgot my password</Link>
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={!formik.isValid || !formik.dirty}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-md font-medium rounded-md text-white bg-primary hover:cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >Log in</button>
                    </div>
                </form>
                <div className="text-center text-sm text-gray-600">Don't have an account?{' '}
                    <Link href="#" className="font-medium text-primary hover:text-blue-500">Sign up.</Link>
                </div>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or</span>
                    </div>
                </div>
                <div className="mt-6 space-y-3">
                    <button
                        type="button"
                        className="w-full flex justify-center items-center py-2 px-4 border border-primary rounded-md shadow-sm text-sm font-medium text-primary bg-white hover:cursor-pointer hover:bg-gray-50"
                    >Continue with Google</button>
                    <button
                        type="button"
                        className="w-full flex justify-center items-center py-2 px-4 border border-primary rounded-md shadow-sm text-sm font-medium text-primary bg-white hover:cursor-pointer hover:bg-gray-50"
                    >Continue with Apple</button>
                    <button
                        type="button"
                        className="w-full flex justify-center items-center py-2 px-4 border border-primary rounded-md shadow-sm text-sm font-medium text-primary bg-white hover:cursor-pointer hover:bg-gray-50"
                    >Continue with Facebook</button>
                </div>
            </div>
        </div>
    );
};
export default LoginPage;