import React, { useState } from "react";
import dayjs from "dayjs";
import { Button } from "~/components/function/input/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/function/menu/popover";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "~/utils/tailwind-merge";

/*
Put in parent component:

const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));

DatePicker args:
value={selectedDate}
    onChange={(newDate) => {
    setSelectedDate(newDate);
    console.log("Selected date:", newDate);
    }}
*/

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
}

export default function DatePicker({ value, onChange }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalDate, setInternalDate] = useState(() => dayjs(value));
  const [currentMonth, setCurrentMonth] = useState(() => dayjs(value));

  const handleConfirm = () => {
    onChange(internalDate.format("YYYY-MM-DD"));
    setIsOpen(false);
  };

  const handleDateSelect = (day: number) => {
    setInternalDate(currentMonth.date(day));
  };

  const handlePrevMonth = () =>
    setCurrentMonth((prev) => prev.subtract(1, "month"));
  const handleNextMonth = () => setCurrentMonth((prev) => prev.add(1, "month"));

  const generateCalendar = () => {
    const startOfMonth = currentMonth.startOf("month");
    const daysInMonth = currentMonth.daysInMonth();
    const startDay = startOfMonth.day();

    const calendar = [];
    for (let i = 0; i < startDay; i++) {
      calendar.push(<div key={`empty-${i}`} className="w-8 h-8" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = currentMonth.date(day);
      const isSelected = internalDate.isSame(date, "day");
      const isToday = date.isSame(dayjs(), "day");

      calendar.push(
        <Button
          key={day}
          variant="ghost"
          className={cn(
            "w-8 h-8 p-0 font-normal",
            isSelected && "bg-primary text-primary-foreground",
            isToday && !isSelected && "bg-accent text-accent-foreground",
          )}
          onClick={() => handleDateSelect(day)}
        >
          {day}
        </Button>,
      );
    }

    return calendar;
  };

  return (
    <div className="relative">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal text-muted-foreground"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? dayjs(value).format("MMMM D, YYYY") : "Select date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <Button variant="outline" size="sm" onClick={handlePrevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="font-semibold">
                {currentMonth.format("MMMM YYYY")}
              </div>
              <Button variant="outline" size="sm" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">{generateCalendar()}</div>
          </div>
          <div className="flex justify-end p-4 border-t">
            <Button onClick={handleConfirm}>Confirm</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
