"use client";

import React, { useEffect } from "react";
import { useBreadcrumb } from "../components/BreadCrumbContext";
import { useDynamicBreadcrumb } from "../components/useDynamicBreadcrumb";

const JobHistoryPage = () => {
  useDynamicBreadcrumb();
  return <div>JobHistoryPage</div>;
};

export default JobHistoryPage;
