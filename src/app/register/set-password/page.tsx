'use client'

import SetPasswordPage from '@/features/auth/set-password'
import { useSearchParams } from 'next/navigation';

const SetPassword = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    console.log(token);
    return <SetPasswordPage token = {token}/>
}

export default SetPassword