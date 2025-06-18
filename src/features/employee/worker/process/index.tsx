"use client";

import { useBreadcrumb } from "@/features/employee/components/BreadCrumbContext";
import useGetDetailOrderByUuid from "@/hooks/api/employee/worker/useGetDetailOrderByUuid";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import ProcessOrderDetail from "./components/ProcessOrderDetail";

const ProcessPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const uuid = params?.uuid as string;
  const { setBreadcrumbs } = useBreadcrumb();
  const { data: orderData } = useGetDetailOrderByUuid(uuid);

  const getWorkerType = (): "washing" | "ironing" | "packing" => {
    const typeFromUrl = searchParams.get("type") as
      | "washing"
      | "ironing"
      | "packing";
    if (
      typeFromUrl &&
      ["washing", "ironing", "packing"].includes(typeFromUrl)
    ) {
      return typeFromUrl;
    }

    if (orderData?.orderStatus) {
      switch (orderData.orderStatus) {
        case "ARRIVED_AT_OUTLET":
          return "washing";
        case "BEING_WASHED":
          return "ironing";
        case "BEING_IRONED":
          return "packing";
        default:
          return "washing";
      }
    }

    return "washing";
  };

  const workerType = getWorkerType();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/employee" },
      { label: "Orders", href: "/employee/orders" },
      { label: "Process" },
    ]);
  }, [setBreadcrumbs]);

  return (
    <div>
      <ProcessOrderDetail uuid={uuid} />
      {/* <ProcessOrderDetail uuid={uuid} workerType={workerType} /> */}
    </div>
  );
};

export default ProcessPage;
