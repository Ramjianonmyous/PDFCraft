import { useState, useEffect } from 'react';

export function useRecentActivity(userId) {
  const [activities, setActivities] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const key = userId ? `recent_activity_${userId}` : 'recent_activity_guest';
    const saved = localStorage.getItem(key);
    if (saved) {
      setActivities(JSON.parse(saved));
    }
  }, [userId]);

  // Save to localStorage when activities change
  useEffect(() => {
    const key = userId ? `recent_activity_${userId}` : 'recent_activity_guest';
    if (activities.length > 0) {
      localStorage.setItem(key, JSON.stringify(activities));
    }
  }, [activities, userId]);

  const trackToolUse = (toolId) => {
    const newActivity = {
      id: Date.now(),
      type: 'tool_use',
      toolId,
      timestamp: new Date().toISOString(),
    };
    setActivities((prev) => [newActivity, ...prev].slice(0, 10));
  };

  const trackFileGenerated = (file) => {
    const newActivity = {
      id: Date.now(),
      type: 'file_generated',
      file,
      timestamp: new Date().toISOString(),
    };
    setActivities((prev) => [newActivity, ...prev].slice(0, 10));
  };

  return {
    activities,
    trackToolUse,
    trackFileGenerated
  };
}
