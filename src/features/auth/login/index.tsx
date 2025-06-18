'use client';
import useLogin from "@/hooks/api/auth/useLogin";
import { useFormik } from 'formik';
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as Yup from 'yup';

const LoginPage = () => {
    const router = useRouter();
    const { status } = useSession();   
    const { mutate: login } = useLogin();
    const [showPassword, setShowPassword] = useState(false);

    // useEffect(() => {
    //     if (status === "authenticated") { router.replace("/user/profile") }
    // }, [status, router]); 
    
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
        },
    });

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 py-32">
            <div className="flex justify-center px-4 sm:px-6 lg:px-8 pt-4 md:pt-10">
                <div className="max-w-2xl w-full space-y-8 px-10 rounded-lg">
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
                        
                        <div className="relative"> 
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"} 
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-primary placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm pr-12" 
                                placeholder="Password"
                                {...formik.getFieldProps('password')}
                            />
                            <button
                                type="button" 
                                onClick={handleShowPassword}
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-sm leading-5 text-gray-500 focus:outline-none hover:cursor-pointer"
                            >
                                {showPassword ? (
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-4.478 0-8.268-2.943-9.542-7a10.07 10.07 0 0 1-.365-.77"></path>
                                        <path d="M15 12a3 3 0 1 1-6 0"></path>
                                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7"></path>
                                    </svg>
                                )}
                            </button>
                            {formik.touched.password && formik.errors.password && (
                                <div className="absolute top-full left-0 text-red-500 text-sm mt-1">{formik.errors.password}</div>
                            )}
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-sm">
                                <Link href="/forgot-password" className="font-medium text-md text-primary hover:text-blue-500">I forgot my password</Link>
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
                    <div className="text-center text-md text-gray-600">Don't have an account?{' '}
                        <Link href="/register" className="font-medium text-primary hover:text-blue-500">Sign up.</Link>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-gradient-to-br from-white to-blue-50 px-3 text-gray-500">Or</span>
                        </div>
                    </div>
                    <div className="mt-6 space-y-3">
                        <button
                            type="button"
                            className="w-full flex justify-center items-center py-2 px-4 border border-primary rounded-md shadow-sm text-md font-medium text-primary bg-white hover:cursor-pointer hover:bg-gray-50"
                            onClick={() => signIn('google', { callbackUrl: '/' })}
                        >Continue with Google</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default LoginPage;