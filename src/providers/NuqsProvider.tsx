"use client";

import { FC, PropsWithChildren, Suspense } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const NuqsProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <NuqsAdapter>
      <Suspense>{children}</Suspense>
    </NuqsAdapter>
  );
};

export default NuqsProvider;
