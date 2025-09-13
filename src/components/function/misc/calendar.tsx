import * as React from "react";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import dayjs from "dayjs";

import { cn } from "~/utils/tailwind-merge";;
import { Button } from "~/components/function/input/button";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
dayjs.extend(weekday);
dayjs.extend(localeData);

export default function Calendar() {
  const [date, setDate] = React.useState<Date>();
  const [currentMonth, setCurrentMonth] = React.useState(dayjs());

  const daysInMonth = currentMonth.daysInMonth();
  const firstDayOfMonth = currentMonth.startOf("month").weekday();
  const weekdays = dayjs.weekdaysShort();

  const handlePrevMonth = () =>
    setCurrentMonth(currentMonth.subtract(1, "month"));
  const handleNextMonth = () => setCurrentMonth(currentMonth.add(1, "month"));

  const renderCalendar = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = currentMonth.date(i);
      const isSelected = date && dayjs(date).isSame(currentDate, "day");
      const isToday = currentDate.isSame(dayjs(), "day");
      days.push(
        <Button
          key={i}
          variant="ghost"
          className={cn(
            "w-8 h-8 p-0 font-normal",
            isSelected && "bg-primary text-primary-foreground",
            isToday && !isSelected && "bg-accent text-accent-foreground",
          )}
          onClick={() => setDate(currentDate.toDate())}
        >
          {i}
        </Button>,
      );
    }
    return days;
  };

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-2">
        <Button variant="outline" size="sm" onClick={handlePrevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="font-semibold">{currentMonth.format("MMMM YYYY")}</div>
        <Button variant="outline" size="sm" onClick={handleNextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-muted-foreground"
          >
            {day.charAt(0)}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
    </div>
  );
}
