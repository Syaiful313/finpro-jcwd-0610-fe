"use client";

import { fromUnixTime, isAfter } from "date-fns";
import { jwtDecode } from "jwt-decode";
import { signOut, useSession } from "next-auth/react";
import { FC, PropsWithChildren, useEffect } from "react";

const TokenProvider: FC<PropsWithChildren> = ({ children }) => {
    const session = useSession();
    useEffect(() => {
        const checkTokenValidity = () => {
            const accessToken = session.data?.user.accessToken;
            if (accessToken) {
                try {
                    const decodedToken = jwtDecode(accessToken);
                    const tokenExpiry = fromUnixTime(decodedToken.exp!);
                    if (isAfter(new Date(), tokenExpiry)) { signOut() }
                } catch (error) {
                    signOut();
                    console.error("Failed to decode or validate token:", error);
                }
            }
        };
        if (session.status === "authenticated" && session.data) { checkTokenValidity() }
    }, [session, session.status, session.data]);
    return <>{children}</>;
};

export default TokenProvider;