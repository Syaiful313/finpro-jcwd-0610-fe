import { Address } from "@/types/address";
import { User } from "@/types/user";
import { FC, useState } from "react";
import { arrowRightIcon } from "../icon";
import AddressFormSection from "./AddressFormSection";
import { useQueryClient } from "@tanstack/react-query";
import ConfirmDialog from "../ConfirmDialog";
import useDeleteAddress from "@/hooks/api/user/useDeleteAddress";

interface AddressSectionProps {
    user: User
}

const AddressSection:FC<AddressSectionProps> = ({ user }) => {
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [showOthers, setShowOthers] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);    
    const [showConfirm, setShowConfirm] = useState(false);
    const handleOpenEditAddressForm = (address?: Address) => {
        setSelectedAddress(address ?? null);
        setShowAddressForm(true);
    };
    const primaryAddress = user?.addresses?.find((addr) => addr.isPrimary);
    const handleOpenAddressForm = () => {
        setShowAddressForm(true);
    };
    const { mutate: deleteAddress } = useDeleteAddress(user.id!);
    
  return (
    <section id="address"
        className="bg-white w-full mt-8 mb-8"
    >
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
            <div>
                <h2 className="font-semibold text-primary text-xl">Addresses</h2>
                <p className="hidden md:flex text-md text-gray-600 mt-1">Manage addresses associated with your Bubblify Account.</p>
            </div>
            <button onClick={() => handleOpenEditAddressForm()}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition"
            >
                + Add Address
            </button>
        </div>

        {showAddressForm && <AddressFormSection user={user} selectedAddress={selectedAddress}
            onClose={() => {
            setShowAddressForm(false);
            setSelectedAddress(null);
        }} />}

        {primaryAddress && (
            <div className="flex items-center justify-between bg-secondary px-6 py-4 border-b border-primary">
                <span className="text-primary font-semibold">Primary Address</span>
                <div className="flex items-center cursor-pointer"
                onClick={() => handleOpenEditAddressForm(primaryAddress)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleOpenEditAddressForm(primaryAddress)}
                >
                    <span className="hidden md:flex text-primary mr-2">
                        {`${primaryAddress.addressName}: ${primaryAddress.addressLine}, ${primaryAddress.city}`}
                    </span>
                    {arrowRightIcon}
                </div>
            </div>
        )}   

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
                <span className="hidden md:flex text-gray-800 mr-2">
                {address ? `${address.addressLine}, ${address.city}` : 'Not set'}
                </span>
                {arrowRightIcon}
            </div>
            </div>
        );
        })}

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
        {showOthers && user?.addresses?.filter((addr) => addr.addressName !== 'Home' && addr.addressName !== 'Work').map((addr, idx) => (
            <div
                key={idx}
                className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-md mt-2"
            >
                <span>{`${addr.addressName}: ${addr.addressLine}, ${addr.city}`}</span>
                <div className="flex space-x-4">
                    <button onClick={() => handleOpenEditAddressForm(addr)}
                        className="text-primary hover:underline"
                    >
                        Edit
                    </button>
                    <button className="text-red-500 hover:underline"
                    onClick={() => {
                        setSelectedAddressId(addr.id!);
                        setShowConfirm(true);
                    }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        ))}

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
    </section>
  )
}

export default AddressSection