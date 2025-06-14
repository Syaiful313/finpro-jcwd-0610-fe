'use client';
import OrderDetailPage from "@/features/order/detail";
import { useParams } from "next/navigation";

const OrderDetail = () => {
  const params = useParams();
  const uuid = params?.uuid as string;

  return <OrderDetailPage uuid={uuid} />;
};

export default OrderDetail;
