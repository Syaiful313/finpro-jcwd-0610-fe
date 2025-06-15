import Image from "next/image";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white to-blue-50 text-gray-900">
        <div className="flex flex-col items-center p-6">
            <div className="mb-4 animate-bounce">
            <Image src="https://res.cloudinary.com/dd6hqmwqu/image/upload/v1749784682/logo_qmkyh2.svg" alt="Loading logo" width={64} height={64} />
            </div>
            <p className="text-2xl font-semibold text-primary">
            Fetching awesomeness...
            </p>
            <p className="text-sm text-gray-500 mt-2">
            Please wait
            </p>
        </div>
    </div>
  );
};

export default Loading;