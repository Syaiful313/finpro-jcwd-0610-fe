"use client";

import { format } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGetAttendance from "@/hooks/api/employee/attendance/useGetAttendance";
import { isDriver, isWorker } from "@/utils/AuthRole";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { toast } from "sonner";
import {
  parseAsInteger,
  parseAsIsoDateTime,
  parseAsString,
  useQueryState,
} from "nuqs";
import Loader from "../../components/Loader";
import AttendanceFilters from "./FilterAttendance";
import { useMemo } from "react";
import { start } from "repl";

const AttendanceList = () => {
  const { data: session } = useSession();
  const isLimitedUser = isWorker(session) || isDriver(session);

  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [queryDateFrom, setQueryDateFrom] = useQueryState(
    "startDate",
    parseAsIsoDateTime,
  );
  const [queryDateTo, setQueryDateTo] = useQueryState(
    "endDate",
    parseAsIsoDateTime,
  );
  const [querySearchTerm, setQuerySearchTerm] = useQueryState(
    "search",
    parseAsString.withDefault(""),
  );
  const [queryEmployeeId, setQueryEmployeeId] = useQueryState(
    "employeeId",
    parseAsInteger,
  );

  const itemsPerPage = 10;

  const queries = useMemo(() => {
    const formattedDateFrom = queryDateFrom
      ? format(queryDateFrom, "yyyy-MM-dd")
      : "";
    const formattedDateTo = queryDateTo
      ? format(queryDateTo, "yyyy-MM-dd")
      : "";

    return {
      page: page,
      take: itemsPerPage,
      sortBy: "clockInAt",
      sortOrder: "desc",
      search: querySearchTerm,
      startDate: formattedDateFrom,
      endDate: formattedDateTo,
      employeeId: queryEmployeeId ?? undefined,
    };
  }, [page, querySearchTerm, queryDateFrom, queryDateTo, queryEmployeeId]);

  const { data: attendanceData, isPending, error } = useGetAttendance(queries);

  const attendance = attendanceData?.data || [];
  const meta = attendanceData?.meta;
  const hasNextPage = meta?.hasNext || false;
  const hasPrevPage = meta?.hasPrevious || false;
  const totalAttendance = meta?.total || 0;
  const currentResults = attendance.length;
  const totalPages = Math.ceil(totalAttendance / itemsPerPage);

  const handleApplyFilters = ({
    dateFrom,
    dateTo,
    searchTerm,
    employeeId,
  }: {
    dateFrom: Date | null | undefined;
    dateTo: Date | null | undefined;
    searchTerm: string;
    employeeId: number | undefined;
  }) => {
    if (dateFrom && dateTo && dateTo < dateFrom) {
      toast.error("End date cannot be earlier than start date");
      return;
    }

    setQueryDateFrom(dateFrom === undefined ? null : dateFrom);
    setQueryDateTo(dateTo === undefined ? null : dateTo);
    setQuerySearchTerm(searchTerm);
    setQueryEmployeeId(employeeId === undefined ? null : employeeId);
    setPage(1);
  };

  const handleClearFilters = () => {
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const getStatusBadge = (record: any) => {
    let status = "Present";
    let variant: "default" | "secondary" | "destructive" | "outline" =
      "default";

    if (!record.clockInAt) {
      status = "Absent";
      variant = "destructive";
    } else {
      const clockInTime = new Date(record.clockInAt);
      const clockInHour = clockInTime.getHours();

      if (
        clockInHour > 9 ||
        (clockInHour === 9 && clockInTime.getMinutes() > 0)
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

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "-";
    return format(new Date(dateString), "hh:mm a");
  };

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
    <div className="space-y-6 p-3 md:p-6">
      <Card className="min-h-screen">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-bold">
            <CalendarIcon className="h-5 w-5" />
            Attendance History
          </CardTitle>
          <CardDescription>
            View and filter employee attendance records by date range
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <AttendanceFilters
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
            isPending={isPending}
            showEmployeeSearch={!isLimitedUser}
          />
        </CardContent>

        <div className="space-y-4">
          {isPending ? (
            <div className="h-70 space-y-6 p-3 md:p-6">
              <Loader />
            </div>
          ) : (
            <div className="p-3 md:p-6">
              <div className="flex items-center justify-between pb-4">
                <div className="text-muted-foreground text-sm">
                  {totalAttendance > 0 ? (
                    <>
                      Showing {currentResults} of {totalAttendance} attendance
                      records
                    </>
                  ) : (
                    <>No records found</>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {totalAttendance > 0 && (hasNextPage || hasPrevPage) && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={!hasPrevPage || isPending}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm">
                        Page {page} of {totalPages}
                      </span>
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
                    {attendance.length > 0 ? (
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
                            No attendance records found for the selected
                            criteria.
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AttendanceList;
