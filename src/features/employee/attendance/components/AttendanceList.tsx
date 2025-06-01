"use client";

import { format } from "date-fns";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
} from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGetAttendance from "@/hooks/api/employee/attendance/useGetAttendance";
import { cn } from "@/lib/utils";
import { isDriver, isWorker } from "@/utils/AuthRole";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Image from "next/image";
import { auth } from "@/lib/auth";

const AttendanceList = async () => {
  const session = await auth();
  const role = session?.user.role;
  const isLimitedUser = role !== "WORKER" && role !== "DRIVER";

  const [page, setPage] = useState(1);
  const [take] = useState(10);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState("");
  const [employeeId, setEmployeeId] = useState<number>();

  // Applied filters for API call
  const [appliedFilters, setAppliedFilters] = useState({
    page: 1,
    take: 10,
    sortBy: "clockInAt",
    sortOrder: "desc" as "asc" | "desc",
    search: "",
    startDate: "",
    endDate: "",
    employeeId: undefined as number | undefined,
  });

  const {
    data: attendanceData,
    isPending,
    error,
  } = useGetAttendance(appliedFilters);

  const attendance = attendanceData?.data || [];
  const meta = attendanceData?.meta;
  console.log("Attendance Data:", attendanceData);

  const handleFilter = () => {
    if (startDate && endDate && endDate < startDate) {
      toast.error("End date cannot be earlier than start date");
      return;
    }
    setAppliedFilters({
      ...appliedFilters,
      page: 1,
      search: searchTerm,
      startDate: startDate ? format(startDate, "yyyy-MM-dd") : "",
      endDate: endDate ? format(endDate, "yyyy-MM-dd") : "",
      employeeId: employeeId,
    });
    setPage(1);
  };

  // Clear filters
  const clearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setSearchTerm("");
    setEmployeeId(undefined);
    setAppliedFilters({
      page: 1,
      take: 10,
      sortBy: "clockInAt",
      sortOrder: "desc",
      search: "",
      startDate: "",
      endDate: "",
      employeeId: undefined,
    });
    setPage(1);
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setAppliedFilters({
      ...appliedFilters,
      page: newPage,
    });
  };

  const hasNextPage = meta?.hasNext || false;
  const hasPrevPage = meta?.hasPrevious || false;
  // Get status badge based on attendance data
  const getStatusBadge = (record: any) => {
    let status = "Present";
    let variant: "default" | "secondary" | "destructive" | "outline" =
      "default";

    if (!record.clockInAt) {
      status = "Absent";
      variant = "destructive";
    } else {
      // Check if clock in is after 8 AM
      const clockInTime = new Date(record.clockInAt);
      const clockInHour = clockInTime.getHours();

      if (
        clockInHour > 8 ||
        (clockInHour === 8 && clockInTime.getMinutes() > 0)
      ) {
        status = "Late";
        variant = "outline";
      } else {
        status = "Present";
        variant = "default";
      }
    }

    return <Badge variant={variant}>{status}</Badge>;
  };

  // Format time
  const formatTime = (dateString: string | null) => {
    if (!dateString) return "-";
    return format(new Date(dateString), "hh:mm a");
  };

  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  if (error) {
    return (
      <div className="space-y-6 p-6">
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-red-500">
              Error loading attendance data: {error.message}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <CalendarIcon className="h-5 w-5" />
            Attendance History
          </CardTitle>
          <CardDescription>
            View and filter employee attendance records by date range
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filter Section */}
          <div className="bg-muted/50 grid grid-cols-1 gap-4 rounded-lg p-4 md:grid-cols-4">
            {/* Start Date */}
            <div className="space-y-2">
              <div className="text-sm font-medium">Start Date</div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                      format(startDate, "PPP")
                    ) : (
                      <span>Pick start date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <h6 className="text-sm font-medium">End Date</h6>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? (
                      format(endDate, "PPP")
                    ) : (
                      <span>Pick end date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Search */}
            {!isLimitedUser ? (
              <div className="space-y-2">
                <div className="text-sm font-medium">Search Employee</div>
                <div className="relative">
                  <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                  <Input
                    id="search"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            ) : (
              <div />
            )}

            {/* Actions */}
            <div className="space-y-2">
              <h6 className="text-sm font-medium">Actions</h6>
              <div className="flex justify-end gap-2">
                <Button
                  onClick={handleFilter}
                  className="flex-1"
                  disabled={isPending}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  {isPending ? "Loading..." : "Filter"}
                </Button>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  disabled={isPending}
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>

          {/* Results Summary & Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground text-sm">
              {meta && (
                <>
                  {meta.total > 0 ? (
                    <>
                      Showing {attendance.length} of {meta.total} records
                    </>
                  ) : (
                    <>
                      <p>No records found</p>
                    </>
                  )}
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* Pagination Controls */}
              {meta && meta.total > 0 && (hasNextPage || hasPrevPage) && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={!hasPrevPage || isPending}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">Page {page}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={!hasNextPage || isPending}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          {/* Attendance Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  {!isLimitedUser && <TableHead>Employee</TableHead>}
                  <TableHead>Clock In</TableHead>
                  <TableHead>Clock Out</TableHead>
                  <TableHead>Outlet</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isPending ? (
                  <TableRow>
                    <TableCell
                      colSpan={isLimitedUser ? 5 : 6}
                      className="text-muted-foreground py-8 text-center"
                    >
                      Loading attendance records...
                    </TableCell>
                  </TableRow>
                ) : attendance.length > 0 ? (
                  attendance.map((record: any) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        {formatDate(record.clockInAt || record.createdAt)}
                      </TableCell>
                      {!isLimitedUser && (
                        <TableCell>
                          {record.employee?.user
                            ? `${record.employee.user.firstName} ${record.employee.user.lastName}`
                            : "N/A"}
                          {record.employee?.user?.email && (
                            <div className="text-muted-foreground text-sm">
                              {record.employee.user.email}
                            </div>
                          )}
                        </TableCell>
                      )}
                      <TableCell>{formatTime(record.clockInAt)}</TableCell>
                      <TableCell>{formatTime(record.clockOutAt)}</TableCell>
                      <TableCell>
                        {record.outlet?.outletName || "N/A"}
                      </TableCell>
                      <TableCell>{getStatusBadge(record)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={isLimitedUser ? 5 : 6}
                      className="text-muted-foreground py-8 text-center"
                    >
                      <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
                        <div className="relative h-[200px] w-[200px]">
                          <Image
                            src="/no-data.svg"
                            alt="No Data"
                            fill
                            style={{ objectFit: "contain" }}
                          />
                        </div>
                        No attendance records found for the selected criteria.
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceList;
