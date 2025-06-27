"use client";

import * as React from "react";
import { CalendarIcon, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, startOfMonth, endOfMonth, isSameDay, isAfter, isBefore, addMonths, subMonths, isToday } from "date-fns";

export type { DateRange } from "react-day-picker";
import type { DateRange } from "react-day-picker";

interface DatePickerWithRangeProps {
  date: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

function CustomCalendar({
  selected,
  onSelect,
  month,
  onMonthChange,
}: {
  selected: DateRange | undefined;
  onSelect: (date: DateRange | undefined) => void;
  month: Date;
  onMonthChange: (date: Date) => void;
}) {
  const today = new Date();
  const firstDayOfMonth = startOfMonth(month);
  const lastDayOfMonth = endOfMonth(month);
  
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());
  
  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    days.push(date);
  }

  const handleDateClick = (date: Date) => {    
    if (!selected?.from) {
      onSelect({ from: date, to: undefined });
    } else if (selected.from && !selected.to) {
      if (isSameDay(date, selected.from)) {
        onSelect({ from: date, to: undefined });
      } else if (isBefore(date, selected.from)) {
        onSelect({ from: date, to: selected.from });
      } else {
        onSelect({ from: selected.from, to: date });
      }
    } else if (selected.from && selected.to) {
      onSelect({ from: date, to: undefined });
    }
  };

  const isDateInRange = (date: Date) => {
    if (!selected?.from || !selected?.to) return false;
    return (isAfter(date, selected.from) || isSameDay(date, selected.from)) && 
           (isBefore(date, selected.to) || isSameDay(date, selected.to));
  };

  const isDateSelected = (date: Date) => {
    if (!selected?.from) return false;
    if (selected.to) {
      return isSameDay(date, selected.from) || isSameDay(date, selected.to);
    }
    return isSameDay(date, selected.from);
  };

  const isDateStart = (date: Date) => {
    return selected?.from && isSameDay(date, selected.from);
  };

  const isDateEnd = (date: Date) => {
    return selected?.to && isSameDay(date, selected.to);
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === month.getMonth() && date.getFullYear() === month.getFullYear();
  };

  const weekDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  return (
    <div className="p-3 select-none">
      <div className="flex items-center justify-between mb-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 w-7 p-0 hover:bg-gray-100"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onMonthChange(subMonths(month, 1));
          }}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="font-medium text-sm">
          {format(month, "MMMM yyyy")}
        </div>
        
        <Button
          type="button"
          variant="outline" 
          size="sm"
          className="h-7 w-7 p-0 hover:bg-gray-100"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onMonthChange(addMonths(month, 1));
          }}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground p-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const inRange = isDateInRange(date);
          const selected = isDateSelected(date);
          const isStart = isDateStart(date);
          const isEnd = isDateEnd(date);
          const isDateToday = isToday(date);
          const isThisMonth = isCurrentMonth(date);

          return (
            <button
              key={index}
              type="button"
              className={cn(
                "h-8 w-8 text-xs font-normal rounded-md flex items-center justify-center",
                "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
                "transition-colors duration-150 cursor-pointer",
                !isThisMonth && "text-gray-400 opacity-50",
                inRange && !selected && "bg-blue-50 text-blue-900",
                selected && "bg-blue-500 text-white hover:bg-blue-600",
                isStart && "rounded-r-none bg-blue-500 text-white",
                isEnd && "rounded-l-none bg-blue-500 text-white", 
                isStart && isEnd && "rounded-md",
                isDateToday && !selected && "bg-gray-100 font-semibold border border-gray-300"
              )}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDateClick(date);
              }}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function DatePickerWithRange({
  date,
  onDateChange,
  placeholder = "Pilih rentang tanggal",
  className,
  disabled = false,
}: DatePickerWithRangeProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState(date?.from || new Date());

  const handleDateSelect = (selectedDate: DateRange | undefined) => {
    onDateChange(selectedDate);
    
    if (selectedDate?.from && selectedDate?.to) {
      setTimeout(() => {
        setIsOpen(false);
      }, 500);
    }
  };

  const handleClearDate = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onDateChange(undefined);
  };

  const formatDateDisplay = () => {
    if (!date?.from) return placeholder;

    try {
      if (date.to) {
        return `${format(date.from, "dd MMM yyyy")} - ${format(date.to, "dd MMM yyyy")}`;
      } else {
        return format(date.from, "dd MMM yyyy");
      }
    } catch (error) {
      console.error("Date formatting error:", error);
      return placeholder;
    }
  };

  return (
    <div className={cn("relative", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            id="date"
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal",
              "min-h-[40px] h-auto px-3 py-2 pr-10", 
              !date?.from && "text-muted-foreground",
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="truncate flex-1">
              {formatDateDisplay()}
            </span>
          </Button>
        </PopoverTrigger>
        
        {date?.from && (
          <div 
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 cursor-pointer p-1 hover:bg-gray-100 rounded-sm transition-colors"
            onClick={handleClearDate}
          >
            <X className="h-3 w-3 text-gray-500 hover:text-gray-700" />
          </div>
        )}
        
        <PopoverContent 
          className="w-auto p-0" 
          align="start"
          side="bottom"
          sideOffset={4}
        >
          <div>
            <CustomCalendar
              selected={date}
              onSelect={handleDateSelect}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
            />
            
            <div className="flex flex-wrap gap-2 p-3 border-t">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs h-7"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const today = new Date();
                  const sevenDaysAgo = new Date();
                  sevenDaysAgo.setDate(today.getDate() - 7);
                  handleDateSelect({ from: sevenDaysAgo, to: today });
                }}
              >
                7 Hari
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs h-7"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const today = new Date();
                  const thirtyDaysAgo = new Date();
                  thirtyDaysAgo.setDate(today.getDate() - 30);
                  handleDateSelect({ from: thirtyDaysAgo, to: today });
                }}
              >
                30 Hari
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs h-7"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const today = new Date();
                  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                  handleDateSelect({ from: firstDayOfMonth, to: today });
                }}
              >
                Bulan Ini
              </Button>
              {date?.from && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDateSelect(undefined);
                    setIsOpen(false);
                  }}
                >
                  Hapus
                </Button>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}