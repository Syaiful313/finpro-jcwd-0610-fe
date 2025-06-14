'use client'
import useForgotPassword from "@/hooks/api/auth/useForgotPassword";
import { useFormik } from "formik";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import * as Yup from 'yup';

const ForgotPasswordPage = () => {
    const router = useRouter();
    const { mutate: forgotPassword } = useForgotPassword(); 
    const { status } = useSession();
    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/user/profile");
        }
    }, [status, router]);    

    const formik = useFormik({
        initialValues: { email: '' },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email').required('Email is required'),
        }),
        onSubmit: async (values) => {
            forgotPassword(values);
        },
    });
  
    return (
        <main className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex flex-col items-center py-32">
            <div className="p-8 sm:p-12 w-11/12 max-w-xl">
                <h2 className="text-3xl font-bold mb-4 text-gray-800">Forgot your password?</h2>
                <p className="text-gray-600 mb-8 text-md leading-loose">
                Enter the email linked to your account, and we will send a reset link to help you regain access.
                </p>

                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div className="mb-6">
                        <label htmlFor="email" className="block text-gray-700 text-md font-medium mb-2">
                            Email address
                        </label>
                        <input  id="email"
                                type="email"
                                autoComplete="email"
                                placeholder="Input your email address"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                {...formik.getFieldProps('email')}/>
                        {formik.touched.email && formik.errors.email && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
                        )}
                    </div>
                    <button type="submit"
                            className="w-full bg-primary text-white py-3 rounded-md font-semibold text-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 hover:cursor-pointer"
                    >Continue</button>
                </form>
                <div className="relative mt-12">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-gradient-to-br from-white to-blue-50 text-gray-500">Or</span>
                    </div>
                </div>
                <div className="mt-8 text-center">
                    <Link href="/register" className="text-blue-700 hover:underline">
                        Create an account
                    </Link>
                </div>
                <div className="mt-8 text-center">
                    <Link href="/login" className="text-blue-700 hover:underline">
                        Back to Login
                    </Link>
                </div>
            </div>
        </main>
    )
}

export default ForgotPasswordPage