'use client'

import SetPasswordPage from '@/features/auth/set-password'
import { useSearchParams } from 'next/navigation';

const SetPassword = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    return <SetPasswordPage token = {token as string}/>
}

export default SetPassword