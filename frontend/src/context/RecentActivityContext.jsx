/**
 * RecentActivityContext — provides trackToolUse / trackFileGenerated globally
 * so any component (FileUploader, ToolPage, Navbar) can read/write recent activity.
 */
import { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useRecentActivity } from '../hooks/useRecentActivity';

const RecentActivityContext = createContext(null);

export function RecentActivityProvider({ children }) {
  const { user } = useAuth();
  const activity = useRecentActivity(user?._id || user?.id || null);

  return (
    <RecentActivityContext.Provider value={activity}>
      {children}
    </RecentActivityContext.Provider>
  );
}

export function useActivity() {
  const ctx = useContext(RecentActivityContext);
  if (!ctx) throw new Error('useActivity must be used inside RecentActivityProvider');
  return ctx;
}
