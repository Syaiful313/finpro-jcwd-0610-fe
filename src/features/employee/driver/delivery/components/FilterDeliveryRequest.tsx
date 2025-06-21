"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SortAsc, SortDesc } from "lucide-react";
import { useQueryState } from "nuqs";

interface DeliveryRequestFiltersProps {
  onPageReset: () => void;
}

const DeliveryRequestFilters: React.FC<DeliveryRequestFiltersProps> = ({
  onPageReset,
}) => {
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [sortOrder, setSortOrder] = useQueryState("sortOrder", {
    defaultValue: "desc",
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onPageReset();
  };

  const handleSortOrderChange = (value: string) => {
    setSortOrder(value);
    onPageReset();
  };

  return (
    <div className="bg-muted rounded-lg p-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4 bg-white" />
          <Input
            placeholder="Search by order number or customer name..."
            value={search}
            onChange={handleSearchChange}
            className="bg-white pl-9 text-xs"
          />
        </div>
        <Select value={sortOrder} onValueChange={handleSortOrderChange}>
          <SelectTrigger className="w-full bg-white sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">
              <div className="flex items-center gap-2">
                <SortDesc className="h-4 w-4" />
                Newest First
              </div>
            </SelectItem>
            <SelectItem value="asc">
              <div className="flex items-center gap-2">
                <SortAsc className="h-4 w-4" />
                Oldest First
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default DeliveryRequestFilters;
