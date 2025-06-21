import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotClockIn() {
  const router = useRouter();
  const handleDashboard = () => {
    router.push("/employee");
  };
  return (
    <div className="flex min-h-screen items-center justify-center p-4 md:h-[80vh] md:min-h-0">
      <div className="flex flex-col items-center p-6 text-center sm:p-8">
        {/* Clock-in SVG Image */}
        <div className="mb-6 flex h-24 w-24 items-center justify-center sm:h-32 sm:w-32">
          <Image
            src="/clock-in.svg"
            alt="Clock in icon"
            width={128}
            height={128}
            className="h-full w-full object-contain"
            priority
          />
        </div>

        {/* Main Message */}
        <h1 className="mb-4 text-xl leading-tight font-bold text-gray-900 sm:text-2xl">
          You Haven't Clocked In Yet
        </h1>

        <p className="mb-8 text-sm leading-relaxed text-gray-600 sm:text-base">
          Please clock in before processing the order to ensure accurate time
          tracking.
        </p>

        {/* Clock In Button */}
        <Button
          className="w-full rounded-lg px-8 py-3 font-medium transition-colors duration-200 sm:w-auto"
          size="lg"
          variant="default"
          onClick={handleDashboard}
        >
          <Clock className="mr-2 h-4 w-4" />
          Dashboard
        </Button>

        {/* Additional Info */}
        <p className="mt-6 px-2 text-xs text-gray-500">
          Your time will be recorded once you clock in successfully
        </p>
      </div>
    </div>
  );
}
