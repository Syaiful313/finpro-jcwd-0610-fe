'use client'
import OrderList from "@/features/order/records/OrderList";
import useDeleteAddress from "@/hooks/api/user/useDeleteAddress";
import useGetUser from "@/hooks/api/user/useGetUser";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import AddressSection from "./components/address/AddressSection";
import ConfirmDialog from "./components/ConfirmDialog";
import BasicInfoSection from "./components/general/BasicInfoSection";
import HeadSection from "./components/HeadSection";
import Loading from "./components/Loading";
import NotifListSection from "./components/notification/NotifList";
import ProfileSidebar from "./components/ProfileSidebar";
import LoadingSpinner from "./components/LoadingSpinner";
import { useQueryState } from "nuqs";

const ProfilePage = () => {
    const searchParams = useSearchParams();
    const [activeIndex, setActiveIndex] = useQueryState('tab', {
        parse: Number,
        serialize: String,
        defaultValue: 0,
    });
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);    
    const session = useSession();
    const userId = session?.data?.user.id;
    const { data: user, isFetching, refetch } = useGetUser(userId!);
    const { mutate: deleteAddress } = useDeleteAddress(userId!);

    useEffect(() => {
        const show = searchParams.get("show");
        if (show === "notifications") {
            setActiveIndex(4);
        }
    }, [searchParams]);

    if (session.status === "loading") return <Loading/>

    return (
    <main>
        <div className="min-h-screen flex bg-white text-gray-800 overflow-hidden">
            <ProfileSidebar activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
            <div className="flex-1 flex flex-col p-4 overflow-y-auto h-screen">                
                {activeIndex === 0 && !!user && (
                    <> {user ? 
                    <>
                        <HeadSection user={user} />
                        <BasicInfoSection user={user} />
                    </>
                    : <LoadingSpinner/>} </>
                )}
                {activeIndex === 1 && userId && (
                    <> {user ? 
                    <div className="w-full py-12">
                        <div className="flex justify-center mb-6">
                            <button
                            onClick={() => {
                                if (!isFetching) refetch();
                            }}
                            disabled={isFetching}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition duration-200 shadow-md
                                ${isFetching ? "bg-blue-400 text-white cursor-not-allowed" : "bg-primary text-white hover:bg-blue-700"}`}
                            >
                            {isFetching ? (
                                <span className="flex items-center justify-center gap-2">
                                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Refreshing...
                                </span>
                            ) : (
                                "Refresh"
                            )}
                            </button>
                        </div>
                        <AddressSection user={user} /> 
                    </div>
                    : <LoadingSpinner/>} </>
                )}
                {activeIndex === 2 && userId && (
                    <div className="w-full py-12">
                        <OrderList userId={userId} />
                    </div>
                )}
                {activeIndex === 3 && userId && (
                    <div className="w-full py-12">
                        <NotifListSection/>
                    </div>
                )}
            </div>
        </div>

        <ConfirmDialog
        isOpen={showConfirm}
        title="Delete Address"
        message="Are you sure you want to delete this address? This action cannot be undone."
        onConfirm={() => {
            if (selectedAddressId !== null) {
            deleteAddress(selectedAddressId);
            }
            setShowConfirm(false);
            setSelectedAddressId(null);
        }}
        onCancel={() => {
            setShowConfirm(false);
            setSelectedAddressId(null);
        }}
        confirmText="Delete"
        cancelText="Cancel"
        />
    </main>
    );
}

export default ProfilePage