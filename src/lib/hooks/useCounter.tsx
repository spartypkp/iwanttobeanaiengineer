import { useState, useEffect } from 'react';

/**
 * Calculates the number of days passed since a given start date.
 * @param startDate The start date from which to count days.
 */
const useCounter = (startDate: Date): number => {
  // Convert the start date to the beginning of the day for accuracy.
  const start = new Date(startDate.setHours(0, 0, 0, 0));
  const [days, setDays] = useState<number>(0);

  useEffect(() => {
    // Calculate the number of days between the current date and the start date.
    const updateDays = () => {
      const now = new Date();
      now.setHours(0, 0, 0, 0); // Reset hours for today's date for accurate day counting.
      const difference = now.getTime() - start.getTime();
      const daysPassed = Math.floor(difference / (1000 * 60 * 60 * 24));
      setDays(daysPassed);
    };

    updateDays(); // Call once immediately to set initial value.

    // Set up a timer to update the count at midnight.
    const timer = setTimeout(() => {
      updateDays();
      // Recalculate the timeout duration every day to ensure it triggers at midnight.
      setInterval(updateDays, 86400000); // 86400000 ms = 24 hours
    }, (24 * 60 * 60 * 1000) - (Date.now() % (24 * 60 * 60 * 1000))); // Time until next midnight

    return () => {
      clearTimeout(timer);
      clearInterval(timer);
    };
  }, [start]);

  return days;
};

export default useCounter;
