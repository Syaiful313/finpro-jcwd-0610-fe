import useUpdateUser from '@/hooks/api/user/useUpdateUser';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FC, useEffect } from 'react';
import { validationSchema } from '../schema';

interface EditFormProps {
  onClose: () => void;
  initialFirstName?: string;
  initialLastName?: string;
  initialPhoneNumber?: string;
  initialEmail?: string;
  onSave: (values: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
    }) => void;
}

export const EditForm: FC<EditFormProps> = ({
  onClose,
  initialFirstName = '',
  initialLastName = '',
  initialPhoneNumber = '',
  initialEmail = '',
  onSave,
}) => {
  const router = useRouter();
  const session = useSession();
  const userId = session?.data?.user?.id;
  const { mutate: updateUser } = useUpdateUser(userId!);

  useEffect(() => {
    if (session.status === 'loading') return;
    if (!userId) router.push('/login');
  }, [userId]);

  const handleCancel = () => {
    setTimeout(() => {
      onClose();
    }, 500);
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-gray-100 bg-opacity-100 flex items-center justify-center z-50 p-4 font-inter"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-white rounded-lg shadow-xl p-6 sm:p-8 lg:p-10 max-w-2xl w-full"
      >
        <h1 className="text-xl sm:text-2xl font-medium text-gray-800 mb-6">
          Changes to your information will be reflected across your Bubblify Account.
        </h1>

        <Formik
            initialValues={{
                firstName: initialFirstName,
                lastName: initialLastName,
                email: initialEmail,
                phoneNumber: initialPhoneNumber,
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
                const cleaned = {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    phoneNumber: values.phoneNumber,
                };

                updateUser(cleaned);
                setTimeout(() => {
                    onClose();
                }, 500);
            }} 
        >
          {() => (
            <Form>
              {['firstName', 'lastName', 'email', 'phoneNumber'].map((field) => (
                <div key={field} className="mb-6 relative group">
                  <Field
                    name={field}
                    type={field === 'email' ? 'email' : field === 'phoneNumber' ? 'tel' : 'text'}
                    placeholder=" "
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg peer"
                  />
                  <label
                    htmlFor={field}
                    className="absolute left-4 top-3 text-base text-gray-500 transition-all duration-200 ease-in-out
                      peer-placeholder-shown:text-base peer-placeholder-shown:top-3
                      peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-600
                      peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:text-blue-600
                      bg-white px-1 pointer-events-none"
                  >
                    {field === 'firstName'
                      ? 'First name'
                      : field === 'lastName'
                      ? 'Last name'
                      : field === 'email'
                      ? 'Email'
                      : 'Phone number'}
                  </label>
                  <ErrorMessage
                    name={field}
                    component="div"
                    className="text-sm text-red-500 mt-1"
                  />
                </div>
              ))}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-300 rounded-md text-primary font-medium hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition duration-150 ease-in-out"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary not-[]:focus:ring-opacity-50 transition duration-150 ease-in-out shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </motion.div>
    </motion.section>
  );
};
