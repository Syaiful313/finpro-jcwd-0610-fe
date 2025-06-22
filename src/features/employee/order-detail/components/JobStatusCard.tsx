import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Job, type DriverJobResponse } from "@/types/detailApi";
import { getStatusColor, getStatusText } from "@/utils/DriverStatus";

interface JobStatusCardProps {
  job: Job;
  jobData: DriverJobResponse;
}

export default function JobStatusCard({ job, jobData }: JobStatusCardProps) {
  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle>Task Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <Badge className={`${getStatusColor(job.status)} text-white`}>
            {getStatusText(job.status)}
          </Badge>
          <span className="text-secondary-foreground text-sm">
            {jobData.type.charAt(0).toUpperCase() + jobData.type.slice(1)} Task
          </span>
        </div>
        {job.notes && (
          <div className="bg-input/50 mt-3 rounded-lg p-3">
            <p className="text-sm">Driver Notes:</p>
            <p className="text-sm">{job.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
