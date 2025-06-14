'use client'

import ResetPasswordPage from '@/features/auth/reset-password';
import { useRouter, useSearchParams } from 'next/navigation';

const ResetPassword = () => {
    const router = useRouter()
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    // if (!token || token === null) router.push('/login');
    return <ResetPasswordPage token = {token as string}/>
}

export default ResetPassword