import { type Job } from "@/types/detailApi";
import { DriverTaskStatus } from "@/types/enum";

interface StatusProgressProps {
  job: Job;
}

export default function StatusProgress({ job }: StatusProgressProps) {
  return (
    <div className="border-b p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`h-3 w-3 rounded-full ${
              job.status === DriverTaskStatus.ASSIGNED
                ? "bg-blue-500"
                : "bg-primary"
            }`}
          />
          <span className="text-sm font-medium">Assigned</span>
        </div>
        <div className="mx-4 h-0.5 flex-1 bg-gray-200">
          <div
            className={`h-full transition-all duration-500 ${
              job.status === DriverTaskStatus.IN_PROGRESS ||
              job.status === DriverTaskStatus.COMPLETED
                ? "bg-primary w-full"
                : "w-0 bg-gray-200"
            }`}
          />
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`h-3 w-3 rounded-full ${
              job.status === DriverTaskStatus.IN_PROGRESS
                ? "bg-primary"
                : job.status === DriverTaskStatus.COMPLETED
                  ? "bg-primary"
                  : "bg-gray-300"
            }`}
          />
          <span className="text-sm font-medium">In Progress</span>
        </div>
        <div className="mx-4 h-0.5 flex-1 bg-gray-200">
          <div
            className={`h-full transition-all duration-500 ${
              job.status === DriverTaskStatus.COMPLETED
                ? "bg-primary w-full"
                : "w-0 bg-gray-200"
            }`}
          />
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`h-3 w-3 rounded-full ${
              job.status === DriverTaskStatus.COMPLETED
                ? "bg-primary"
                : "bg-gray-300"
            }`}
          />
          <span className="text-sm font-medium">Completed</span>
        </div>
      </div>
    </div>
  );
}
