import useVerifyEmail from "@/hooks/api/auth/useVerifyEmail";
import { FC, useEffect, useState } from "react";

interface ReverifyPageProps {
    token: string;
}

const ReverifyPage: FC<ReverifyPageProps> = ({ token }) => {
    const [isVerifying, setIsVerifying] = useState(true);
    const { mutate: verifyEmail, isSuccess, isError, error } = useVerifyEmail();
    
    useEffect(() => {
        if (token) { 
            setIsVerifying(true); 
            verifyEmail(token, {
                onSettled: () => {
                setIsVerifying(false); 
                },
            })
        }
    }, [token, verifyEmail]);

    return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex items-center justify-center">
        {isVerifying && (
            <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xl font-medium text-blue-600">Verifying...</p>
            </div>
        )}

        {isSuccess && (
            <p className="text-xl font-medium text-green-600">Email verified successfully!</p>
        )}

        {isError && (
            <div className="text-center">
                <p className="text-xl font-medium text-red-600">Verification failed.</p>
                <p className="text-sm text-gray-500">
                    {(error as Error)?.message || "Something went wrong."}
                </p>
            </div>
        )}
    </div>
    )
}

export default ReverifyPage