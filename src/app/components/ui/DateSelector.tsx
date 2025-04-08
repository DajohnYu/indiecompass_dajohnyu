'use client';
// src/app/components/ui/DateSelector.tsx

import { formatDate } from '@/app/lib/utils';
import { useState, useEffect } from 'react';

interface DateSelectorProps {
  onDateSelect: (date: Date) => void;
  initialDate?: Date;
  numberOfDays?: number;
}

export default function DateSelector({ 
  onDateSelect, 
  initialDate = new Date(),
  numberOfDays = 7
}: DateSelectorProps) {
  // Start with today's date at midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Use initial date or default to today
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  
  // Generate an array of dates
  const dates = Array.from({ length: numberOfDays }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date;
  });
  
  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    onDateSelect(date);
  };
  
  // Check if a date is today
  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };
  
  // Check if a date is selected
  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };
  
  // Initialize with the provided initial date
  useEffect(() => {
    onDateSelect(initialDate);
  }, [initialDate, onDateSelect]);
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold">Showtimes</h2>
        <button 
          onClick={() => handleDateSelect(today)}
          className="text-sm px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
        >
          Today
        </button>
      </div>
      
      <div className="flex overflow-x-auto space-x-2 pb-2 -mx-1 px-1">
        {dates.map((date) => (
          <button
            key={date.toISOString()}
            onClick={() => handleDateSelect(date)}
            className={`flex-shrink-0 px-4 py-2 rounded-full border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
              isSelected(date)
                ? 'bg-indigo-600 text-white'
                : isToday(date)
                ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="text-center">
              <div className="font-medium">{formatDate(date, 'EEE')}</div>
              <div className={`text-sm ${isSelected(date) ? 'text-indigo-100' : 'text-slate-500'}`}>
                {formatDate(date, 'MMM d')}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}