// "use client";

// import PaginationSection from "@/components/PaginationSection";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { cn } from "@/lib/utils";
// import { Popover } from "@radix-ui/react-popover";
// import { format } from "date-fns";
// import { CalendarIcon, Eye, MapPin, Package } from "lucide-react";
// import React from "react";

// const WorkerHistoryPage = () => {
// const {}

//   return (
//     <div>
//       {" "}
//       <div className="space-y-6 p-3 md:p-6">
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2 text-2xl font-bold">
//               <Package className="h-6 w-6" />
//               Worker History
//             </CardTitle>
//             <CardDescription>
//               View and filter completed order history
//             </CardDescription>
//           </CardHeader>

//           <CardContent className="space-y-6">
//             {/* Filters */}
//             <div className="bg-muted/50 grid grid-cols-1 gap-4 rounded-lg p-4 md:grid-cols-4">
//               {/* Start Date */}
//               <div className="space-y-2">
//                 <div className="text-sm font-medium">Start Date</div>
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <Button
//                       variant="outline"
//                       className={cn(
//                         "w-full justify-start text-left font-normal",
//                         "text-muted-foreground",
//                       )}
//                     >
//                       <CalendarIcon className="mr-2 h-4 w-4" />
//                       {startDate ? (
//                         format(startDate, "PPP")
//                       ) : (
//                         <span>Pick start date</span>
//                       )}
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-auto p-0">
//                     <Calendar
//                       mode="single"
//                       selected={startDate}
//                       onSelect={setStartDate}
//                       initialFocus
//                     />
//                   </PopoverContent>
//                 </Popover>
//               </div>

//               {/* End Date */}
//               <div className="space-y-2">
//                 <h6 className="text-sm font-medium">End Date</h6>
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <Button
//                       variant="outline"
//                       className={cn(
//                         "w-full justify-start text-left font-normal",
//                         !endDate && "text-muted-foreground",
//                       )}
//                     >
//                       <CalendarIcon className="mr-2 h-4 w-4" />
//                       {endDate ? (
//                         format(endDate, "PPP")
//                       ) : (
//                         <span>Pick end date</span>
//                       )}
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-auto p-0">
//                     <Calendar
//                       mode="single"
//                       selected={endDate}
//                       onSelect={setEndDate}
//                       initialFocus
//                     />
//                   </PopoverContent>
//                 </Popover>
//               </div>

//               {/* Search */}
//               {!isLimitedUser ? (
//                 <div className="space-y-2">
//                   <div className="text-sm font-medium">Search Employee</div>
//                   <div className="relative">
//                     <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
//                     <Input
//                       id="search"
//                       placeholder="Search by name or email..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="pl-8"
//                     />
//                   </div>
//                 </div>
//               ) : (
//                 <div />
//               )}

//               {/* Actions */}
//               <div className="space-y-2">
//                 <h6 className="text-sm font-medium">Actions</h6>
//                 <div className="flex justify-end gap-2">
//                   <Button
//                     onClick={handleFilter}
//                     className="flex-1"
//                     disabled={isPending}
//                   >
//                     <Filter className="mr-2 h-4 w-4" />
//                     {isPending ? "Loading..." : "Filter"}
//                   </Button>
//                   <Button
//                     variant="outline"
//                     onClick={clearFilters}
//                     disabled={isPending}
//                   >
//                     Clear
//                   </Button>
//                 </div>
//               </div>
//             </div>

//             {/* History List */}
//             <div>
//               <div className="mb-4">
//                 <h3 className="text-lg font-semibold">Pickup History</h3>
//                 <p className="text-muted-foreground text-sm">
//                   Showing {filteredHistory.length} of{" "}
//                   {completedPickupJobsData?.meta?.total || 0} pickup jobs
//                 </p>
//               </div>

//               <div>
//                 {filteredHistory.length === 0 ? (
//                   <div className="text-muted-foreground py-8 text-center">
//                     No pickup history found
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     {filteredHistory.map((item) => (
//                       <div
//                         key={item.order.uuid}
//                         className="rounded-lg border p-3 sm:p-4"
//                       >
//                         {/* Header - Mobile: Stack, Desktop: Side by side */}
//                         <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
//                           <div className="flex items-center gap-3">
//                             <div className="rounded-full bg-blue-100 p-2">
//                               <Package className="h-4 w-4 text-blue-600" />
//                             </div>
//                             <div>
//                               <h3 className="text-sm font-semibold sm:text-base">
//                                 {item.order.orderNumber}
//                               </h3>
//                               <p className="text-muted-foreground text-xs sm:text-sm">
//                                 Pickup
//                               </p>
//                             </div>
//                             <div className="ml-auto sm:hidden">
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() =>
//                                   handleViewDetails(item.order.uuid)
//                                 }
//                                 className="text-xs sm:text-sm"
//                               >
//                                 <Eye className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
//                                 View Details
//                               </Button>
//                             </div>
//                           </div>
//                           <div className="text-left sm:text-right">
//                             <div className="text-sm font-medium sm:text-base">
//                               {formatRupiah(item.order.totalDeliveryFee)}
//                             </div>
//                             <div className="text-muted-foreground text-xs sm:text-sm">
//                               {format(
//                                 new Date(item.updatedAt),
//                                 "dd MMM yyyy, HH:mm",
//                                 { locale: id },
//                               )}
//                             </div>
//                           </div>
//                         </div>

//                         <div className="space-y-2">
//                           <div className="flex items-center gap-2">
//                             <span className="text-sm font-medium sm:text-base">
//                               {item.order.user.firstName}{" "}
//                               {item.order.user.lastName}
//                             </span>
//                           </div>

//                           <div className="flex items-start gap-2">
//                             <MapPin className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
//                             <span className="text-xs break-words sm:text-sm">
//                               {item.order.addressLine}, {item.order.district},{" "}
//                               {item.order.city}, {item.order.province}{" "}
//                               {item.order.postalCode}
//                             </span>
//                           </div>

//                           <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
//                             <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs sm:gap-4 sm:text-sm">
//                               <div className="text-muted-foreground text-xs">
//                                 {item.order.outlet.outletName}
//                               </div>
//                             </div>

//                             <div className="hidden items-center gap-2 sm:flex">
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() =>
//                                   handleViewDetails(item.order.uuid)
//                                 }
//                                 className="text-xs sm:text-sm"
//                               >
//                                 <Eye className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
//                                 View Details
//                               </Button>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 {itemsPerPage > 0 && (hasNext || hasPrevious) && (
//                   <div className="mt-8">
//                     <PaginationSection
//                       page={page}
//                       take={itemsPerPage}
//                       total={completedPickupJobsData?.meta?.total || 0}
//                       onChangePage={setPage}
//                       hasNext={hasNext}
//                       hasPrevious={hasPrevious}
//                     />
//                   </div>
//                 )}
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default WorkerHistoryPage;
import React from "react";

const WorkerHistoryPage = () => {
  return <div>WorkerHistoryPage</div>;
};

export default WorkerHistoryPage;
