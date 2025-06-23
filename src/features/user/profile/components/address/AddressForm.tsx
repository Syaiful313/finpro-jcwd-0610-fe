import { FC } from 'react';
import { FieldArray, Field, ErrorMessage, useFormikContext, Formik, Form } from 'formik'; 
import { Address } from '@/types/address';
import MapPinpoint from './MapPinpoint';
import { motion } from 'framer-motion'; 
import { addressField } from './AddressField';

interface AddressesFormProps {
  name: string;
  onClose: () => void;
}

export const AddressesForm: FC<AddressesFormProps> = ({ name, onClose }) => {
  const { values, setFieldValue } = useFormikContext<{ [key: string]: Address[] }>();
  const addresses = values[name] || [];

  return (
    <FieldArray name={name}>
      {({ push, remove }) => (
        <div className="mb-6 font-sans">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">Addresses</h2>
          {addresses.map((_, index) => (
            <div key={index} className="mb-8 p-8 relative space-y-6">
              {addressField.map((fieldConfig) => (
                <div key={fieldConfig.name} className="relative">
                  <Field
                    name={`${name}.${index}.${fieldConfig.name}`}
                    placeholder=" "
                    className="w-full px-4 pt-6 pb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base peer transition-all duration-200"
                  />
                  <label
                    htmlFor={`${name}.${index}.${fieldConfig.name}`}
                    className="absolute left-4 top-2 text-sm text-gray-500 transition-all duration-200 ease-in-out
                      peer-placeholder-shown:text-base peer-placeholder-shown:top-3
                      peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-600
                      peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-blue-600
                      bg-white px-1 pointer-events-none"
                  >
                    {fieldConfig.label}
                  </label>
                  <ErrorMessage name={`${name}.${index}.${fieldConfig.name}`} component="div" className="text-red-500 text-sm mt-1" />
                </div>
              ))}

              <div className="flex items-center pt-2">
                <Field type="checkbox" name={`${name}.${index}.isPrimary`} className="mr-2 h-4 w-4 text-primary border-gray-300 rounded focus:ring-blue-500 cursor-pointer" />
                <label htmlFor={`${name}.${index}.isPrimary`} className="text-gray-700 cursor-pointer">Primary Address</label>
              </div>

              {[
                { name: 'latitude', label: 'Latitude' },
                { name: 'longitude', label: 'Longitude' },
              ].map((coordConfig) => (
                <div key={coordConfig.name} className="relative">
                  <Field
                    name={`${name}.${index}.${coordConfig.name}`}
                    type="number"
                    placeholder="0"
                    className="w-full px-4 pt-6 pb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base peer transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <label
                    htmlFor={`${name}.${index}.${coordConfig.name}`}
                    className="absolute left-4 top-2 text-sm text-gray-500 transition-all duration-200 ease-in-out
                      peer-placeholder-shown:text-base peer-placeholder-shown:top-3
                      peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-600
                      peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-blue-600
                      bg-white px-1 pointer-events-none"
                  >
                    {coordConfig.label}
                  </label>
                </div>
              ))}

              <div className="mt-4">
                <MapPinpoint
                  lat={addresses[index].latitude || 0}
                  lng={addresses[index].longitude || 0}
                  onChange={(lat, lng) => {
                    setFieldValue(`${name}.${index}.latitude`, lat);
                    setFieldValue(`${name}.${index}.longitude`, lng);
                  }}
                />
              </div>
            </div>
          ))}

          <div className="flex justify-end space-x-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 transition duration-150 ease-in-out"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </FieldArray>
  );
};

interface ParentComponentProps {
  showAddressForm: boolean;
  setShowAddressForm: (show: boolean) => void;
  initialValues: { addresses: Address[] };
  handleSubmit: (values: { addresses: Address[] }) => void;
}

export const ParentComponent: FC<ParentComponentProps> = ({ showAddressForm, setShowAddressForm, initialValues, handleSubmit }) => {
  return (
    <>
      {showAddressForm && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-gray-100 bg-opacity-100 flex items-center justify-center z-50 p-4 font-sans"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full overflow-y-auto max-h-[90vh]" 
          >
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
              {() => ( 
                <Form>
                  <AddressesForm name="addresses" onClose={() => setShowAddressForm(false)} />

                  <div className="flex justify-end mt-8">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out shadow-md disabled:opacity-50 disabled:cursor-not-allowed" // Styled submit button
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
    </>
  );
};