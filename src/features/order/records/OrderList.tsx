'use client';

import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BadgeCheck, Calendar, ChevronLeft, ChevronRight, Clock, PackageCheck, Plus, Search } from 'lucide-react';
import useGetOrdersUser from '@/hooks/api/order/useGetOrdersUser';
import { Order } from '@/types/order';

interface OrderListProps {
  userId: number;
}

const OrderList: FC<OrderListProps> = ({ userId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(5);
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { data, isLoading } = useGetOrdersUser({ userId, page: currentPage, limit });
  const router = useRouter();

  useEffect(() => {
    if (data) {
      setOrders(data.data);
      setTotal(data.total);
    }
  }, [data]);

  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const isAfterStart = startDate ? orderDate >= new Date(startDate) : true;
    const isBeforeEnd = endDate ? orderDate <= new Date(endDate) : true;
    return matchesSearch && isAfterStart && isBeforeEnd;
  });

  const totalPages = Math.ceil(total / limit);
  const handleAddOrder = () => router.push('/order/request');

  return (
    <div className="mx-auto p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-primary">My Orders</h1>
        <button
          onClick={handleAddOrder}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" />
          Add Order
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative w-full sm:w-1/3">
          <Search className="absolute top-3 left-3 text-primary w-5 h-5" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-primary p-3 rounded-lg w-full border border-primary focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        {[startDate, endDate].map((date, i) => (
          <div className="relative w-full sm:w-1/3" key={i}>
            <Calendar className="absolute top-3 left-3 text-primary w-5 h-5" />
            <input
              type="date"
              value={i === 0 ? startDate : endDate}
              onChange={(e) =>
                i === 0 ? setStartDate(e.target.value) : setEndDate(e.target.value)
              }
              className="pl-10 text-primary border border-primary p-3 rounded-lg w-full focus:ring-2 focus:ring-cyan-400"
            />
          </div>
        ))}
      </div>

      {isLoading || filteredOrders.length === 0 ? (
        <ul className="space-y-4 animate-pulse">
          {Array.from({ length: 3 }).map((_, idx) => (
            <li key={idx} className="p-4 border border-primary rounded-xl shadow">
              <div className="h-4 bg-slate-50 rounded w-1/2 mb-2" />
              <div className="h-4 bg-slate-50 rounded w-1/3 mb-2" />
              <div className="h-4 bg-slate-50 rounded w-1/4" />
            </li>
          ))}
        </ul>
      ) : (
        <ul className="space-y-4">
          {filteredOrders.map((order) => (
            <Link key={order.uuid} href={`/order/${order.uuid}`}>
              <li className="p-4 bg-white border border-primary rounded-xl shadow hover:bg-blue-50 transition-colors cursor-pointer my-4">
                <div className="flex items-center gap-2 text-primary font-medium">
                  <PackageCheck className="w-5 h-5" />
                  Order #{order.orderNumber}
                </div>
                <div className="flex items-center gap-2 text-black">
                  <BadgeCheck className="w-4 h-4" />
                  Status: {order.orderStatus}
                </div>
                <div className="flex items-center gap-2 text-black">
                  <Clock className="w-4 h-4" />
                  Date: {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </li>
            </Link>
          ))}
        </ul>
      )}

      <div className="flex justify-center mt-6 gap-3">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-4 py-2 bg-primary rounded-lg disabled:opacity-40 transition text-white"
        >
          <ChevronLeft className="w-4 h-4" />
          Prev
        </button>
        <span className="px-4 py-2 text-primary">Page {currentPage}</span>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage >= totalPages}
          className="flex items-center gap-1 px-4 py-2 bg-primary rounded-lg disabled:opacity-40 transition text-white"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default OrderList;