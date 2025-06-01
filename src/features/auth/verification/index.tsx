'use client';

import React from 'react';
import Link from 'next/link';

const EmailVerificationPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">Check Your Email</h2>
        <p className="mt-2 text-md text-gray-600">
          We've sent a verification link to your email address. Please click the link in the email to verify your account and set your password.
        </p>
        <p className="mt-4 text-sm text-gray-500">
          If you don't see the email, please check your spam folder.
        </p>
        <div className="mt-6">
          <Link href="/login" className="text-primary hover:text-blue-600 font-medium">
            Go to Login Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;