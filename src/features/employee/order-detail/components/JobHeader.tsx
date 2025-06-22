import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type Job } from "@/types/detailApi";
import { getStatusColor, getStatusText } from "@/utils/DriverStatus";

interface JobHeaderProps {
  job: Job;
  router: any;
}

export default function JobHeader({ job, router }: JobHeaderProps) {
  return (
    <div className="border-b p-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="block md:hidden"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex gap-3">
          <h1 className="text-lg font-semibold">{job.order.orderNumber}</h1>
          <Badge className={`${getStatusColor(job.status)} text-white`}>
            {getStatusText(job.status)}
          </Badge>
        </div>
      </div>
    </div>
  );
}
