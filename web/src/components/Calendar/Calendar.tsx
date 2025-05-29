import React, { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  startOfWeek,
  endOfWeek,
  addDays
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { Category } from '../../types/types';

interface CalendarEvent {
  _id: string;
  title: string;
  date: Date;
  status?: string;
  categories?: Category;
}

interface CalendarProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onDateClick?: (date: Date) => void;
}

export function Calendar({ events, onEventClick, onDateClick }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const getDayEvents = (date: Date) => {
    return events.filter(event => 
      event.date && isSameDay(new Date(event.date), date)
    );
  };

  const handleDayClick = (date: Date) => {
    onDateClick?.(date);
  };

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    onEventClick?.(event);
  };

  // Get color for status
  const getStatusColor = (status: string | undefined) => {
    switch(status?.toLowerCase()) {
      case 'Books':
        return 'bg-green-100 text-green-700 focus:ring-green-500';
      case 'Museums':
        return 'bg-blue-100 text-blue-700 focus:ring-blue-500';
      case 'Library':
        return 'bg-red-100 text-red-700 focus:ring-red-500';
      default:
        return 'bg-purple-100 text-purple-700 focus:ring-purple-500';
    }
  };

  const renderCalendarDays = () => {
    const days = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days.map((day) => {
      const dayEvents = getDayEvents(day);
      const isToday = isSameDay(day, new Date());
      const isCurrentMonth = isSameMonth(day, currentMonth);

      return (
        <div
          key={day.toString()}
          className={cn(
            'min-h-[120px] p-2 border border-gray-200 rounded-lg',
            'flex flex-col hover:bg-gray-50 transition-colors cursor-pointer',
            isToday && 'bg-blue-50 border-blue-200',
            !isCurrentMonth && 'bg-gray-50 opacity-75'
          )}
          onClick={() => handleDayClick(day)}
        >
          <div className="flex justify-between items-center mb-1">
            <span className={cn(
              'text-sm font-medium',
              isToday && 'bg-blue-600 text-white rounded-full px-2 py-1'
            )}>
              {format(day, 'd')}
            </span>
            {!isCurrentMonth && (
              <span className="text-xs text-gray-400">
                {format(day, 'MMM')}
              </span>
            )}
          </div>
          <div className="flex-1 space-y-1 overflow-y-auto">
            {dayEvents.map((event) => (
              <button
                key={event._id}
                onClick={(e) => handleEventClick(event, e)}
                className={cn(
                  'w-full text-left text-xs p-1 rounded truncate',
                  'hover:opacity-75 transition-opacity focus:outline-none',
                  'focus:ring-2 focus:ring-opacity-50',
                  getStatusColor(event.categories)
                )}
              >
                {event.title}
              </button>
            ))}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={previousMonth}
            className="p-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={nextMonth}
            className="p-2"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>
    </div>
  );
}
