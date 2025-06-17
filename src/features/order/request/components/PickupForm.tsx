import { Formik, Form, Field, ErrorMessage } from "formik";
import { FC } from "react";
import { motion } from 'framer-motion';
import { User } from "@/types/user";
import { validationSchema } from "../schema";
import { toast } from "sonner";

interface PickupFormProps {
    user?: User;
    itemVariants: any;
    setPendingValues: (values: any) => void;
    setFormActions: (actions: any) => void;
    setShowConfirmModal: (open: boolean) => void;
}

const PickupForm: FC<PickupFormProps> = ({
  user,
  itemVariants,
  setPendingValues,
  setFormActions,
  setShowConfirmModal
}) => {
  return (
    <Formik
          initialValues={{ addressId: '', scheduledPickupTime: '' }}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => {
            if (!user?.isVerified) {
              toast.error("Please verify your account before requesting pickup");
              actions.setSubmitting(false); 
              return;
            }
            setPendingValues(values);
            setFormActions(actions);
            setShowConfirmModal(true);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <motion.div variants={itemVariants}>
                <label htmlFor="addressId" className="block text-gray-700 text-lg font-semibold mb-2">
                  Select Address
                </label>
                <Field
                  as="select"
                  id="addressId"
                  name="addressId"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 appearance-none bg-white pr-8"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%236B7280'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1.5em 1.5em',
                  }}
                >
                  <option value="">-- Select an Address --</option>
                  {user?.addresses?.map((addr) => (
                    <option key={addr.id} value={addr.id}>
                      {addr.addressName}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="addressId" component="div" className="text-red-600 text-sm mt-2" />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="scheduledPickupTime" className="block text-gray-700 text-lg font-semibold mb-2">
                  Select Pickup Schedule
                </label>
                <Field
                  type="datetime-local"
                  id="scheduledPickupTime"
                  name="scheduledPickupTime"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="scheduledPickupTime" component="div" className="text-red-600 text-sm mt-2" />
              </motion.div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition hover:translate-y-[-1px] disabled:opacity-40 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Request Pickup
                  </>
                )}
              </motion.button>
            </Form>
          )}
        </Formik>
    )
}

export default PickupForm