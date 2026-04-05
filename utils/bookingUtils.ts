/**
 * Formats a duration string (HH:MM:SS) into a human-readable format.
 */
export const formatDuration = (hms?: string): string => {
  if (!hms || hms === 'N/A') return 'N/A';
  const [h, m, s] = hms.split(':').map(Number);
  const parts = [];
  if (h > 0) parts.push(`${h} hour${h > 1 ? 's' : ''}`);
  if (m > 0) parts.push(`${m} minute${m > 1 ? 's' : ''}`);
  if (h === 0 && m === 0 && s > 0) parts.push(`${s} second${s > 1 ? 's' : ''}`);
  return parts.length > 0 ? parts.join(' ') : '0 seconds';
};

/**
 * Finds the most recent completed job's duration for a given list of bookings.
 * @param bookings Array of booking objects including tracking history.
 * @returns Formatted duration string or 'N/A'
 */
export const getLastJobDuration = (bookings: any[]): string => {
  if (!bookings || bookings.length === 0) return 'N/A';

  // Find most recent completed booking
  const completedJobs = (bookings || []).filter((b: any) => b.status === 'completed');
  
  if (completedJobs.length === 0) return 'N/A';

  // Sort by date descending
  const lastCompleted = [...completedJobs].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  })[0];
  
  if (!lastCompleted) return 'N/A';

  // Find tracking with duration
  const completedTracking = lastCompleted.tracking?.find((t: any) => t.duration);

  if (!completedTracking || !completedTracking.duration) return 'N/A';

  return formatDuration(completedTracking.duration);
};

/**
 * Returns a human-friendly count of how many jobs have been finished.
 */
export const getCompletedJobsCount = (bookings: any[]): number => {
  return (bookings || []).filter(b => b.status === 'completed').length;
};
