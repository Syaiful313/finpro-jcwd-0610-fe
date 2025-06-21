import React from "react";

const Loader = () => {
  return (
    <div className="flex h-60 flex-col items-center justify-center gap-3">
      <div className="relative h-12 w-12">
        <div className="border-primary absolute inset-0 rounded-full border-4 opacity-30"></div>
        <div className="border-primary absolute inset-0 animate-spin rounded-full border-4 border-t-transparent"></div>
      </div>
    </div>
  );
};

export default Loader;
