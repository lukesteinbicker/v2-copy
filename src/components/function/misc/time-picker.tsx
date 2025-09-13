import React, { useState } from "react";
import { Button } from "~/components/function/input/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/function/menu/popover";
import { ScrollArea } from "~/components/function/utility/scroll-area";
import { Input } from "~/components/function/input/input";
import { RadioGroup, RadioGroupItem } from "~/components/function/input/radio-group";
import { Label } from "~/components/function/text/label";
import { Clock } from "lucide-react";

/*
Put in parent component:

const [selectedTime, setSelectedTime] = useState('12:00');

TimePicker args:
value={selectedDate}
    onChange={(newDate) => {
    setSelectedDate(newDate);
    console.log("Selected date:", newDate);
    }}
*/

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
}

export default function TimePicker({ value, onChange }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalTime, setInternalTime] = useState(() => {
    const [hours, minutes] = value.split(":");
    const hour = parseInt(hours, 10);
    return {
      hour: (hour % 12 || 12).toString().padStart(2, "0"),
      minute: minutes,
      period: hour >= 12 ? "PM" : "AM",
    };
  });

  const handleConfirm = () => {
    let hours = parseInt(internalTime.hour, 10);
    if (internalTime.period === "PM" && hours !== 12) hours += 12;
    if (internalTime.period === "AM" && hours === 12) hours = 0;
    const formattedTime = `${hours.toString().padStart(2, "0")}:${internalTime.minute}`;
    onChange(formattedTime);
    setIsOpen(false);
  };

  const generateHours = () => {
    return Array.from({ length: 12 }, (_, i) =>
      (i + 1).toString().padStart(2, "0"),
    );
  };

  const generateMinutes = () => {
    return Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));
  };

  const formatDisplayTime = () => {
    return `${internalTime.hour}:${internalTime.minute} ${internalTime.period}`;
  };

  return (
    <div className="relative">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal text-muted-foreground"
          >
            <Clock className="mr-2 h-4 w-4" />
            {value ? formatDisplayTime() : "Select time"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0">
          <div className="flex p-2">
            <ScrollArea className="h-48 w-4/12">
              <div className="p-2">
                {generateHours().map((hour) => (
                  <div
                    key={hour}
                    className={`cursor-pointer py-1 px-2 hover:bg-primary/90 rounded-md ${internalTime.hour === hour ? "bg-primary/90" : ""}`}
                    onClick={() =>
                      setInternalTime((prev) => ({ ...prev, hour }))
                    }
                  >
                    {hour}
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="w-2/12 flex items-center justify-center text-2xl font-bold">
              :
            </div>
            <ScrollArea className="h-48 w-1/2">
              <div className="p-2">
                {generateMinutes().map((minute) => (
                  <div
                    key={minute}
                    className={`cursor-pointer py-1 px-2 hover:bg-primary/90 rounded-md ${internalTime.minute === minute ? "bg-primary/90" : ""}`}
                    onClick={() =>
                      setInternalTime((prev) => ({ ...prev, minute }))
                    }
                  >
                    {minute}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          <div className="flex items-center justify-between p-4 border-t">
            <Input
              type="text"
              value={formatDisplayTime()}
              readOnly
              className="w-24"
            />
            <RadioGroup
              value={internalTime.period}
              onValueChange={(value: "AM" | "PM") =>
                setInternalTime((prev) => ({ ...prev, period: value }))
              }
              className="flex space-x-1 text-primary-foreground"
            >
              <div className="flex items-center space-x-1">
                <RadioGroupItem
                  value="AM"
                  id="am"
                  className="text-primary-foreground"
                />
                <Label htmlFor="am">AM</Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem
                  value="PM"
                  id="pm"
                  className="text-primary-foreground"
                />
                <Label htmlFor="pm">PM</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="flex justify-end p-4 border-t">
            <Button onClick={handleConfirm}>Confirm</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
