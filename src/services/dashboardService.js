import { apiGet } from './api';
import { dashboardStats, recentActivity, ordersByStatus, weeklyVolume } from '../data/dashboardStats';

/**
 * Get dashboard KPI stats
 */
export const getDashboardStats = async () => {
  return apiGet(() => dashboardStats, 300);
};

/**
 * Get recent activity feed
 */
export const getRecentActivity = async () => {
  return apiGet(() => recentActivity, 200);
};

/**
 * Get orders breakdown by status
 */
export const getOrdersByStatus = async () => {
  return apiGet(() => ordersByStatus, 150);
};

/**
 * Get weekly volume data
 */
export const getWeeklyVolume = async () => {
  return apiGet(() => weeklyVolume, 150);
};
