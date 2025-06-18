'use client'
import OrderList from "@/features/order/records/OrderList";
import useCreateAddress from "@/hooks/api/user/useCreateAddress";
import useDeleteAddress from "@/hooks/api/user/useDeleteAddress";
import useGetUser from "@/hooks/api/user/useGetUser";
import useUpdateUser from "@/hooks/api/user/useUpdateUser";
import useUploadProfilePic from "@/hooks/api/user/useUploadProfilePic";
import { Address } from "@/types/address";
import { Form, Formik } from "formik";
import { motion } from 'framer-motion'; 
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import HeadSection from "./components/HeadSection";
import { arrowRightIcon } from "./components/icon";
import { EditPasswordForm } from "./components/password/EditPasswordForm";
import ProfileSidebar from "./components/ProfileSidebar";
import useEditAddress from "@/hooks/api/user/useEditAddress";
import { toast } from "sonner";
import ConfirmDialog from "./components/ConfirmDialog";
import { AddressesForm } from "./components/address/AddressForm";
import { EditForm } from "./components/general/EditForm";
import Loading from "./components/Loading";

interface PayloadCreateAddress {
    addressName: string;
    addressLine: string;
    district: string;
    city: string;
    province: string;
    postalCode: string;
    latitude: number;
    longitude: number;
    isPrimary: boolean;
}


const ProfilePage = () => {
    const [showEditForm, setShowEditForm] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false); 
    const [showOthers, setShowOthers] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const session = useSession();
    const router = useRouter();
    const userId = session?.data?.user.id;
    const { data: user } = useGetUser(userId!);
    const { mutate: updateUser } = useUpdateUser(userId!);
    const { mutate: uploadProfilePic } = useUploadProfilePic(userId!);
    const { mutate: createAddress } = useCreateAddress(userId!);
    const { mutate: deleteAddress } = useDeleteAddress(userId!);
    const { mutate: editAddress } = useEditAddress(userId!);
    const defaultProfileImgUrl = `https://ui-avatars.com/api/?name=${user?.firstName}&background=DDDDDD&color=555555&bold=true&rounded=true`;

    useEffect(() => { 
        if (session.status === "loading") return;
        if (!userId || session.status === "unauthenticated") {
            router.push("/login");
        } 
    }, [userId, session.status]);

    const handleOpenEditForm = () => setShowEditForm(true);

    const handleSave = async (values: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
    }) => {
        updateUser(values);
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("profilePic", file);

        uploadProfilePic(formData);
    };

    const handleOpenAddressForm = () => {
        setShowAddressForm(true);
    };

    const initialValues = {
        addresses: [
            {
            addressName: '',
            addressLine: '',
            district: '',
            city: '',
            province: '',
            postalCode: '',
            latitude: -7.797068,
            longitude: 110.370529,
            isPrimary: false,
            }
        ]
    };

    const handleOpenPasswordForm = () => setShowPasswordForm(true);
    const handleClosePasswordForm = () => setShowPasswordForm(false);

    const handleOpenEditAddressForm = (address?: Address) => {
        setSelectedAddress(address ?? null);
        setShowAddressForm(true);
    };

    const isValidProfilePic =
        user?.profilePic &&
        user.profilePic !== 'null' &&
        user.profilePic !== 'undefined';

    if (session.status === "loading") return <Loading/>

    return (
  <>
    {showEditForm && (
      <EditForm
        onClose={() => setShowEditForm(false)}
        initialFirstName={user?.firstName}
        initialLastName={user?.lastName}
        initialEmail={user?.email}
        initialPhoneNumber={user?.phoneNumber}
        onSave={handleSave}
      />
    )}

    {showPasswordForm && (
      <EditPasswordForm onClose={handleClosePasswordForm} onSave={() => {}} />
    )}

    {showAddressForm && (
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-opacity-100 flex items-center justify-center z-50 p-4 font-sans"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="bg-white rounded-xl shadow-lg p-8 max-w-4xl w-full overflow-y-auto max-h-[90vh]"
        >
            <Formik
                initialValues={selectedAddress
                    ? { addresses: [selectedAddress] } 
                    : initialValues
                }
                onSubmit={(values) => {
                if (selectedAddress?.id) {
                const updated = values.addresses[0]; 
               editAddress(
                {
                    addressId: selectedAddress.id!,
                    addressName: updated.addressName,
                    addressLine: updated.addressLine,
                    district: updated.district,
                    city: updated.city,
                    province: updated.province,
                    postalCode: updated.postalCode,
                    latitude: updated.latitude ?? 0,     
                    longitude: updated.longitude ?? 0,   
                    isPrimary: updated.isPrimary,
                },
                {
                    onSuccess: () => {
                    setShowAddressForm(false);
                    setSelectedAddress(null);
                    },
                }
                );
                } else {
                values.addresses.forEach((address) => {
                    createAddress(
                        {
                            addressName: address.addressName,
                            addressLine: address.addressLine,
                            district: address.district,
                            city: address.city,
                            province: address.province,
                            postalCode: address.postalCode,
                            latitude: address.latitude ?? 0,
                            longitude: address.longitude ?? 0,
                            isPrimary: address.isPrimary,
                        },
                        {
                            onSuccess: () => toast.success(`Address "${address.addressName}" added!`),
                        }
                        );
                });
                }
            }}
            >
            {() => (
                <Form>
                <AddressesForm
                    name="addresses"
                    onClose={() => setShowAddressForm(false)}
                />
                <div className="flex justify-end mt-8">
                    <button
                    type="submit"
                    className="px-6 py-2 bg-primary text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                    Submit
                    </button>
                </div>
                </Form>
            )}
            </Formik>
        </motion.div>
      </motion.section>
    )}

    <div className="min-h-screen flex bg-secondary text-gray-800 overflow-hidden">
        <ProfileSidebar activeIndex={activeIndex} setActiveIndex={setActiveIndex} />

        <div className="flex-1 flex flex-col items-center p-4 overflow-y-auto h-screen">
            {!!user && <HeadSection user={user} />}

            {activeIndex === 0 && (
            <>
                {/* Basic Info */}
                <div className="bg-white rounded-lg shadow-md w-full max-w-4xl mt-8">
                <div className="px-6 py-5 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-primary">Basic info</h2>
                    <p className="text-md text-gray-600 mt-1">
                    Some info may be visible to other people using Bubblify service.
                    </p>
                </div>

                {/* Profile Picture */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex flex-col">
                    <span className="font-semibold text-gray-600">Profile picture</span>
                    <span className="text-md text-gray-500 mt-1">
                        A profile picture helps personalise your account
                    </span>
                    </div>
                    <div
                    className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 group cursor-pointer"
                    onClick={triggerFileInput}
                    >
                    <img
                        src={isValidProfilePic ? user.profilePic : defaultProfileImgUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfilePicChange}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs">Edit</span>
                    </div>
                    </div>
                </div>

                {/* First Name */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <span className="text-gray-600 font-semibold">First Name</span>
                    <div className="flex items-center">
                    <span className="text-gray-800 mr-2">{user?.firstName}</span>
                    <div
                        onClick={handleOpenEditForm}
                        className="cursor-pointer"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && handleOpenEditForm()}
                    >
                        {arrowRightIcon}
                    </div>
                    </div>
                </div>

                {/* Last Name */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <span className="text-gray-600 font-semibold">Last Name</span>
                    <div className="flex items-center">
                    <span className="text-gray-800 mr-2">{user?.lastName}</span>
                    <div
                        onClick={handleOpenEditForm}
                        className="cursor-pointer"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && handleOpenEditForm()}
                    >
                        {arrowRightIcon}
                    </div>
                    </div>
                </div>
                </div>

                {/* Contact Info */}
                <div className="bg-white rounded-lg shadow-md w-full max-w-4xl mt-8">
                <div className="px-6 py-5 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-primary">Contact info & Privacy</h2>
                </div>

                {/* Email */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <span className="text-gray-600 font-semibold">Email</span>
                    <div className="flex items-center">
                    <span className="text-gray-800 mr-2">{user?.email}</span>
                    <div
                        onClick={handleOpenEditForm}
                        className="cursor-pointer"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && handleOpenEditForm()}
                    >
                        {arrowRightIcon}
                    </div>
                    </div>
                </div>

                {/* Phone */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <span className="text-gray-600 font-semibold">Phone</span>
                    <div className="flex items-center">
                    <span className="text-gray-800 mr-2">{user?.phoneNumber}</span>
                    <div
                        onClick={handleOpenEditForm}
                        className="cursor-pointer"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && handleOpenEditForm()}
                    >
                        {arrowRightIcon}
                    </div>
                    </div>
                </div>

                {/* Password */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <span className="text-gray-600 font-semibold">Password</span>
                    <div className="flex items-center">
                    <span className="text-gray-800 mr-2">******</span>
                    <div
                        onClick={handleOpenPasswordForm}
                        className="cursor-pointer"
                        role="button"
                    >
                        {arrowRightIcon}
                    </div>
                    </div>
                </div>
                </div>
            </>
            )}

            {/* Addresses */}
            {activeIndex === 1 && userId && (
            <div
                id="address"
                className="bg-white rounded-lg shadow-md w-full max-w-4xl mt-8 mb-8"
            >
                <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <h2 className="font-semibold text-primary text-xl">Addresses</h2>
                        <p className="text-md text-gray-600 mt-1">
                        Manage addresses associated with your Bubblify Account.
                        </p>
                    </div>
                    <button
                        onClick={() => handleOpenEditAddressForm()}
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition"
                    >
                        + Add Address
                    </button>
                </div>

                
                {['Home', 'Work'].map((type) => {
                const address = user?.addresses?.find((addr) => addr.addressName === type);
                return (
                    <div
                    key={type}
                    className="flex items-center justify-between px-6 py-4 border-b border-gray-200"
                    >
                    <span className="text-gray-600 font-semibold">{type}</span>
                    <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleOpenEditAddressForm(address)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && handleOpenAddressForm()}
                    >
                        <span className="text-gray-800 mr-2">
                        {address
                            ? `${address.addressLine}, ${address.city}`
                            : 'Not set'}
                        </span>
                        {arrowRightIcon}
                    </div>
                    </div>
                );
                })}

                {/* Other */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <span className="text-gray-600 font-semibold">Other</span>
                <div
                    className="flex items-center cursor-pointer"
                    onClick={() => setShowOthers((v) => !v)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setShowOthers((v) => !v)}
                >
                    <span className="text-gray-800 mr-2">
                    {(user?.addresses ?? []).filter(
                        (addr) => addr.addressName !== 'Home' && addr.addressName !== 'Work'
                    ).length > 0
                        ? 'Other addresses'
                        : 'Not set'}
                    </span>
                    {arrowRightIcon}
                </div>
                </div>
                {showOthers &&
                user?.addresses
                    ?.filter((addr) => addr.addressName !== 'Home' && addr.addressName !== 'Work')
                    .map((addr, idx) => (
                    <div
                        key={idx}
                        className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-md mt-2"
                    >
                        <span>{`${addr.addressName}: ${addr.addressLine}, ${addr.city}`}</span>
                        <div className="flex space-x-4">
                        <button
                            onClick={() => handleOpenEditAddressForm(addr)}
                            className="text-primary hover:underline"
                        >
                            Edit
                        </button>
                        <button
                        onClick={() => {
                            setSelectedAddressId(addr.id!);
                            setShowConfirm(true);
                        }}
                        className="text-red-500 hover:underline"
                        >
                        Delete
                        </button>
                        </div>
                    </div>
                    ))}
            </div>
            )}

            {/* Order List */}
            {activeIndex === 2 && userId && (
            <div className="w-full max-w-4xl mb-8">
                <OrderList userId={userId} />
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
  </>
);
}

export default ProfilePage