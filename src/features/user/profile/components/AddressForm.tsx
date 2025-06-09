import useCreateAddress from '@/hooks/api/user/useCreateAddress';
import { Address } from '@/types/address';
import { FieldArray, Field, ErrorMessage, useFormikContext } from 'formik';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FC, useEffect } from 'react';

interface AddressesFormProps {
  name: string;
  onClose: () => void;
}

export const AddressesForm: FC<AddressesFormProps> = ({ name, onClose }) => {
    const { values } = useFormikContext<{ [key: string]: Address[] }>();
    const addresses: Address[] = values[name] || [];
    
    return (
        <FieldArray name={name}>
        {({ push, remove }) => (
            <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Addresses</h2>

            {addresses.length > 0 &&
                addresses.map((_, index) => (
                <div
                    key={index}
                    className="mb-4 p-4 border border-gray-300 rounded-md relative"
                    >
                    {/* addressName */}
                    <div className="mb-2">
                        <Field
                        name={`${name}.${index}.addressName`}
                        placeholder="Address Name (e.g. Home, Work)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <ErrorMessage
                        name={`${name}.${index}.addressName`}
                        component="div"
                        className="text-xs text-red-500 mt-1"
                        />
                    </div>

                    {/* addressLine */}
                    <div className="mb-2">
                        <Field
                        name={`${name}.${index}.addressLine`}
                        placeholder="Address Line"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <ErrorMessage
                        name={`${name}.${index}.addressLine`}
                        component="div"
                        className="text-xs text-red-500 mt-1"
                        />
                    </div>

                    {/* district */}
                    <div className="mb-2">
                        <Field
                        name={`${name}.${index}.district`}
                        placeholder="District"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <ErrorMessage
                        name={`${name}.${index}.district`}
                        component="div"
                        className="text-xs text-red-500 mt-1"
                        />
                    </div>

                    {/* city */}
                    <div className="mb-2">
                        <Field
                        name={`${name}.${index}.city`}
                        placeholder="City"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <ErrorMessage
                        name={`${name}.${index}.city`}
                        component="div"
                        className="text-xs text-red-500 mt-1"
                        />
                    </div>

                    {/* province */}
                    <div className="mb-2">
                        <Field
                        name={`${name}.${index}.province`}
                        placeholder="Province"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <ErrorMessage
                        name={`${name}.${index}.province`}
                        component="div"
                        className="text-xs text-red-500 mt-1"
                        />
                    </div>

                    {/* postalCode */}
                    <div className="mb-2">
                        <Field
                        name={`${name}.${index}.postalCode`}
                        placeholder="Postal Code"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <ErrorMessage
                        name={`${name}.${index}.postalCode`}
                        component="div"
                        className="text-xs text-red-500 mt-1"
                        />
                    </div>

                    {/* isPrimary */}
                    <div className="mb-2 flex items-center">
                        <Field
                        type="checkbox"
                        name={`${name}.${index}.isPrimary`}
                        className="mr-2"
                        />
                        <label className="text-gray-700">Primary Address</label>
                    </div>

                    {/* Remove Button */}
                    <button
                        type="button"
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        onClick={() => remove(index)}
                    >
                        Remove
                    </button>
                    </div>
                ))}

            <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() =>
                push({ street: '', city: '', state: '', zipCode: '', country: '' })
                }
            >
                + Add Address
            </button>

            <button
                type="button"
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
            >
                Close
            </button>
            </div>
        )}
        </FieldArray>
    );
};