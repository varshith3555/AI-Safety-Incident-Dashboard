import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  // Parse the ISO date string to ensure proper handling
  const date = parseISO(dateString);
  
  // Format the date in a user-friendly format
  const formattedDate = format(date, "MMM d, yyyy h:mm a");
  
  // Get the user's timezone offset in minutes
  const offsetMinutes = new Date().getTimezoneOffset() * -1;
  // Convert to hours and minutes format
  const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
  const offsetMinutesRemainder = Math.abs(offsetMinutes) % 60;
  
  // Format the timezone offset as GMT+X:XX or GMT-X:XX
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const formattedOffset = `GMT${sign}${offsetHours}:${offsetMinutesRemainder.toString().padStart(2, '0')}`;
  
  return `${formattedDate} (${formattedOffset})`;
}

export function getCurrentDateISO(): string {
  return new Date().toISOString();
}

export function generateId(): number {
  return Math.floor(Math.random() * 10000);
}
