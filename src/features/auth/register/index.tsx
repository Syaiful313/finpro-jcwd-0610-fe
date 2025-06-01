'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import NavbarLogin from '../login/_components/NavbarLogin';
import useRegister from '@/hooks/api/auth/useRegister';

const RegisterPage = () => {
    const { mutate: register } = useRegister();
    const SignupSchema = Yup.object().shape({
        firstName: Yup.string()
            .min(2, 'Minimum of first name is 2 characters')
            .required('First name is required'),
        lastName: Yup.string()
            .min(2, 'Minimum of last name is 2 characters')
            .required('Last name is required'),
        phoneNumber: Yup.string()
            .matches(/^[0-9]+$/, 'Invalid phone number')
            .min(10, 'Phone number must be at least 10 digits')
            .max(15, 'Phone number must be at most 15 digits')
            .required('Phone number is required'),
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
    });

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: '',
        },
        validationSchema: SignupSchema,
        onSubmit: (values) => {
            register(values);
        },
    });

    return (
        <>
        <NavbarLogin/>
        <div className="min-h-screen bg-white flex justify-center px-4 sm:px-6 lg:px-8 md:pt-8">
            <div className="max-w-md w-full space-y-8 bg-white px-10 rounded-lg">
                <div className="text-center">
                    <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900">Create your account</h2>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => signIn('google', { callbackUrl: '/' })}
                        className="flex-1 flex justify-center items-center py-2 px-4 border border-primary rounded-md shadow-sm text-sm font-medium text-primary bg-white hover:cursor-pointer hover:bg-gray-50"
                    >
                        Sign up with Google
                    </button>
                    <button
                        onClick={() => signIn('github', { callbackUrl: '/' })}
                        className="flex-1 flex justify-center items-center py-2 px-4 border border-primary rounded-md shadow-sm text-sm font-medium text-primary bg-white hover:cursor-pointer hover:bg-gray-50"
                    >
                        Sign up with Github
                    </button>
                </div>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or</span>
                    </div>
                </div>
                <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label htmlFor="firstName" className="sr-only">First name</label>
                            <input
                                id="firstName"
                                type="text"
                                autoComplete="given-name"
                                placeholder="First name"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-primary placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                {...formik.getFieldProps('firstName')}
                            />
                            {formik.touched.firstName && formik.errors.firstName && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.firstName}</div>
                            )}
                        </div>
                        <div className="flex-1">
                            <label htmlFor="lastName" className="sr-only">Last name</label>
                            <input
                                id="lastName"
                                type="text"
                                autoComplete="family-name"
                                placeholder="Last name"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-primary placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                {...formik.getFieldProps('lastName')}
                            />
                            {formik.touched.lastName && formik.errors.lastName && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.lastName}</div>
                            )}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="phoneNumber" className="sr-only">Phone number</label>
                        <div className="relative">
                            <input
                                id="phoneNumber"
                                type="tel"
                                autoComplete="tel"
                                placeholder="Phone number"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-primary placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm pr-12"
                                {...formik.getFieldProps('phoneNumber')}
                            />
                        </div>
                        {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                            <div className="text-red-500 text-sm mt-1">{formik.errors.phoneNumber}</div>
                        )}
                    </div>
                    <div>
                        <label htmlFor="email" className="sr-only">Email</label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            placeholder="Email"
                            required
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-primary placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                            {...formik.getFieldProps('email')}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                        )}
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={!formik.isValid || formik.isSubmitting}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-md font-medium rounded-md text-white bg-primary hover:cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Continue
                        </button>
                    </div>
                </form>
                <div className="text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="font-medium text-primary hover:text-blue-500">Log in.</Link>
                </div>
                <p className="mt-8 text-center text-xs text-gray-500">
                    By selecting continue, you agree to receive service and marketing auto-sent texts from Bubblify, and you also agree to our {' '}
                    <Link href="/terms" className="font-medium text-primary hover:text-blue-600">Terms</Link>
                    {' '} and {' '}
                    <Link href="/privacy" className="font-medium text-primary hover:text-blue-600">Privacy Policy</Link>.
                </p>
            </div>
        </div>
    </>
)};

export default RegisterPage