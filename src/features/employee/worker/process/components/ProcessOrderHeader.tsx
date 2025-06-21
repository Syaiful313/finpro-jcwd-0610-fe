import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProcessOrderHeader({ orderData, currentConfig }: any) {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-50 -mt-6 overflow-hidden rounded-t-xl border-b bg-white shadow-sm md:relative md:-mt-6 md:shadow-none">
      <div className="flex items-center gap-3 px-4 py-4 md:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="block md:hidden"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">
            {orderData.orderNumber} - {currentConfig.title}
          </h1>
          <div className="flex flex-col gap-1 text-sm text-gray-600 md:flex-row md:items-center md:gap-4">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {orderData.user.firstName} {orderData.user.lastName}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
