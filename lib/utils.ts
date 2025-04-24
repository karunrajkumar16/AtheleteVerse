import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatRelative, isToday, isTomorrow, isYesterday } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date with a specified format string or use a relative format
 * @param date The date to format
 * @param formatStr Optional format string (see date-fns format)
 * @param useRelative Whether to use relative formatting for recent dates
 * @returns Formatted date string
 */
export function formatDate(date: Date, formatStr?: string, useRelative = false): string {
  if (!date) return "Invalid date"
  
  try {
    if (useRelative) {
      if (isToday(date)) {
        return `Today at ${format(date, "h:mm a")}`
      } else if (isTomorrow(date)) {
        return `Tomorrow at ${format(date, "h:mm a")}`
      } else if (isYesterday(date)) {
        return `Yesterday at ${format(date, "h:mm a")}`
      } else {
        return formatRelative(date, new Date())
      }
    }
    
    return formatStr ? format(date, formatStr) : format(date, "PPP")
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Invalid date"
  }
}
