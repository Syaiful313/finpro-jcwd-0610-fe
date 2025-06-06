'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import NavbarLogin from '../login/_components/NavbarLogin';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const EmailVerificationPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return; 
    if (session?.user?.isVerified) {
      router.push('/'); 
    }
  }, [session, status]);

  return (
    <>
      <NavbarLogin/>
      <div className="bg-white flex flex-col justify-center items-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl w-full space-y-8 bg-white p-8 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900">Check Your Email</h2>
          <p className="mt-2 text-lg text-gray-600">
            We've sent a verification link to your email address. Please click the link in the email to verify your account and set your password.
          </p>
          <p className="mt-4 text-md text-gray-500">
            If you don't see the email, please check your spam folder.
          </p>
          <div className="mt-6">
            <Link href="/login" className="text-primary hover:text-blue-600 font-medium">
              Go to Login Page
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmailVerificationPage;