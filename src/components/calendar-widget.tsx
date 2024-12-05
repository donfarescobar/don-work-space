import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { DayClickEventHandler } from "react-day-picker";
import { EventList } from "./event-list";
import { cn } from "@/lib/utils";

interface EventType {
  title: string;
  type: string;
}

interface EventsType {
  [key: string]: EventType[];
}

const events: EventsType = {
  "2024-03-20": [{ title: "Team Meeting", type: "work" }],
  "2024-03-22": [{ title: "Project Deadline", type: "important" }],
  "2024-03-25": [{ title: "Birthday", type: "personal" }],
};

export function CalendarWidget() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleDayClick: DayClickEventHandler = (day: Date) => {
    setSelectedDate(day);
  };

  const dayClassNames = (date: Date): string => {
    const dateStr = date.toISOString().split('T')[0];
    if (events[dateStr]) {
      return "relative";
    }
    return "";
  };

  const dayContent = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const dayEvents = events[dateStr];

    return (
      <>
        {date.getDate()}
        {dayEvents && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
            {dayEvents.map((_: EventType, index: number) => (
              <div
                key={index}
                className="w-1 h-1 rounded-full bg-primary/70"
              />
            ))}
          </div>
        )}
      </>
    );
  };

  const selectedDateStr: string = selectedDate.toISOString().split('T')[0];
  const selectedEvents = events[selectedDateStr];

  return (
    <div className="w-full max-w-md">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">
          Keep track of your events and meetings
        </p>
      </div>

      <Card className="shadow-lg">
        <div className="p-6">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date: Date | undefined) => date && setSelectedDate(date)}
            onDayClick={handleDayClick}
            className={cn(
              "w-full rounded-md border shadow-sm",
              selectedEvents ? "mb-6" : ""
            )}
            modifiersClassNames={{
              selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              today: "bg-accent text-accent-foreground",
            }}
            classNames={{
              nav_button: "hover:bg-accent",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              head_cell: "text-muted-foreground font-normal",
              caption: "flex justify-center pt-1 relative items-center mb-2",
              root: "w-full",
            }}
            modifiers={{ hasEvent: (date) => dayClassNames(date) === "relative" }}
            components={{
              Day: ({ date }) => dayContent(date),
            }}
          />

          {selectedEvents && <EventList events={selectedEvents} date={selectedDateStr} />}
        </div>
      </Card>
    </div>
  );
}