import { motion } from 'framer-motion'; 
import { Form, Formik } from "formik";
import { FC, useState } from 'react';
import { Address } from '@/types/address';
import useEditAddress from '@/hooks/api/user/useEditAddress';
import { User } from '@/types/user';
import useCreateAddress from '@/hooks/api/user/useCreateAddress';
import { toast } from 'sonner';
import { AddressesForm } from './AddressForm';

interface AddressFormSectionProps {
    user: User
    selectedAddress: Address | null;
    onClose: () => void;
}

const AddressFormSection:FC<AddressFormSectionProps> = ({ user, selectedAddress, onClose }) => {
    const { mutate: editAddress } = useEditAddress(user.id!);
    const { mutate: createAddress } = useCreateAddress(user.id!);
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

  return (
    <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 bg-black/30 bg-opacity-50 flex items-center justify-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="bg-white rounded-xl shadow-lg p-8 max-w-4xl w-full overflow-y-auto max-h-[90vh]"
        >
            <Formik
                initialValues={selectedAddress ? { addresses: [selectedAddress] } : initialValues }
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
                    onSuccess: () => { onClose() }
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
                    onClose={onClose}
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
  )
}

export default AddressFormSection