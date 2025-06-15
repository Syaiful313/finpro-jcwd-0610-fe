'use client';

import ConfirmModal from "@/features/user/profile/components/ConfirmDialog";
import useCreatePickupAndOrder from "@/hooks/api/order/useCreatePickupAndOrder";
import useGetUser from "@/hooks/api/user/useGetUser";
import { motion } from 'framer-motion';
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import PickupForm from "./components/PickupForm";

type PickupFormValues = {
  addressId: string;
  scheduledPickupTime: string;
};

const PickupSection = () => {
  const session = useSession();
  const userId = session.data?.user.id;
  const { data: user } = useGetUser(userId ?? 0);
  const { mutate: createPickupOrder } = useCreatePickupAndOrder(user?.id!);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingValues, setPendingValues] = useState<PickupFormValues | null>(null);
  const [formActions, setFormActions] = useState<any>(null);

  useEffect(() => {
    if (session.status === "loading") return;
  }, [user?.id]);

  const validationSchema = Yup.object().shape({
    addressId: Yup.number()
      .required("Choose an address for your pickup")
      .typeError("Choose an address for your pickup"),
    scheduledPickupTime: Yup.string()
      .required("Please input pickup schedule time")
      .test("is-valid-date", "Date format invalid", (val) => !isNaN(Date.parse(val ?? "")))
      .test("is-future", "Pickup time is at least 1 hour from now", (val) => {
        if (!val) return false;
        return new Date(val) > new Date(Date.now() + 60 * 60 * 1000);
      }),
  });

  const handleConfirmSubmit = async () => {
    if (!pendingValues) return;

    const payload = {
      addressId: Number(pendingValues.addressId),
      scheduledPickupTime: new Date(pendingValues.scheduledPickupTime),
    };

    try {
      await createPickupOrder(payload, {
        onSettled: () => formActions?.setSubmitting(false),
      });
      formActions?.resetForm();
    } catch (error) {
      console.error("Error creating pickup order:", error);
      formActions?.setSubmitting(false);
    } finally {
      setShowConfirmModal(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 10,
        stiffness: 100,
        delayChildren: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex items-center justify-center p-4">
      <motion.div
        className="max-w-3xl w-full p-8 md:p-10 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-4xl font-extrabold text-gray-800 mb-6 text-center"
          variants={itemVariants}
        >
          Create Pickup Order
        </motion.h1>

        <PickupForm
          user={user}
          setPendingValues={setPendingValues}
          setFormActions={setFormActions}
          setShowConfirmModal={setShowConfirmModal} 
          itemVariants={undefined}
        />

        <ConfirmModal
          isOpen={showConfirmModal}
          title="Confirm Pickup Request"
          message="Are you sure you want to schedule this pickup?"
          onConfirm={handleConfirmSubmit}
          onCancel={() => setShowConfirmModal(false)}
        />
      </motion.div>
    </div>
  );
};

export default PickupSection;