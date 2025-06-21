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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, SortAsc, SortDesc } from "lucide-react";
import { useQueryState } from "nuqs";

interface RequestListFiltersProps {
  onPageReset: () => void;
}

const RequestListFilters: React.FC<RequestListFiltersProps> = ({
  onPageReset,
}) => {
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [activeTab, setActiveTab] = useQueryState("tab", {
    defaultValue: "All",
  });
  const [sortOrder, setSortOrder] = useQueryState("sortOrder", {
    defaultValue: "desc",
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onPageReset();
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onPageReset();
  };

  const handleSortOrderChange = (value: string) => {
    setSortOrder(value);
    onPageReset();
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="All">All</TabsTrigger>
          <TabsTrigger value="Pickup">Pickup</TabsTrigger>
          <TabsTrigger value="Delivery">Delivery</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
          <Input
            placeholder="Search by order number or customer name..."
            value={search}
            onChange={handleSearchChange}
            className="pl-9"
          />
        </div>
        <Select value={sortOrder} onValueChange={handleSortOrderChange}>
          <SelectTrigger className="w-full sm:w-48">
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

export default RequestListFilters;
