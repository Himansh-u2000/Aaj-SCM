import { useState, useEffect, useMemo, useCallback } from 'react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import PieChart from '../../components/PieChart/PieChart';
import BarChart from '../../components/BarChart/BarChart';
import { CardSkeleton } from '../../components/Loader/Loader';
import { getDashboardStats, getOrdersByStatus } from '../../services/dashboardService';
import { formatCompactNumber } from '../../utils/formatters';
import { carrierSplitData, delayAnalysis, orderVolumeData } from '../../data/dashboardStats';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [statusData, setStatusData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [statsRes, statusRes] = await Promise.all([
        getDashboardStats(),
        getOrdersByStatus(),
      ]);
      if (statsRes.success) setStats(statsRes.data);
      if (statusRes.success) setStatusData(statusRes.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const kpiCards = useMemo(() => {
    if (!stats) return [];
    return [
      { title: 'Total Orders', value: formatCompactNumber(stats.totalOrders), trend: stats.trends.totalOrders, icon: 'orders', color: 'bg-blue-50 text-blue-600', invertTrend: false },
      { title: 'Delivered', value: formatCompactNumber(stats.deliveredOrders), trend: stats.trends.deliveredOrders, icon: 'delivered', color: 'bg-green-50 text-green-600', invertTrend: false },
      { title: 'Pending Shipments', value: formatCompactNumber(stats.pendingShipments), trend: stats.trends.pendingShipments, icon: 'pending', color: 'bg-amber-50 text-amber-600', invertTrend: true },
      { title: 'Delayed', value: formatCompactNumber(stats.delayedShipments), trend: stats.trends.delayedShipments, icon: 'delayed', color: 'bg-red-50 text-red-600', invertTrend: true },
    ];
  }, [stats]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold text-secondary-800">Dashboard</h1></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-800">Dashboard</h1>
          <p className="text-sm text-secondary-500 mt-1">Overview of your logistics operations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/orders')}
            leftIcon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}>
            View Orders
          </Button>
          <Button variant="primary" size="sm"
            leftIcon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>}>
            New Order
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.title} hover className="relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-secondary-500 uppercase tracking-wider">{kpi.title}</p>
                <p className="text-[28px] font-bold text-secondary-800 mt-1 leading-tight">{kpi.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.color}`}>
                {kpi.icon === 'orders' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
                {kpi.icon === 'delivered' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                {kpi.icon === 'pending' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                {kpi.icon === 'delayed' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              {(() => {
                const isPositive = kpi.trend >= 0;
                const isGood = kpi.invertTrend ? !isPositive : isPositive;
                return (
                  <>
                    <span className={`text-xs font-semibold ${isGood ? 'text-green-600' : 'text-red-600'}`}>
                      {isPositive ? '↑' : '↓'} {Math.abs(kpi.trend)}%
                    </span>
                    <span className="text-xs text-secondary-400">vs last month</span>
                  </>
                );
              })()}
            </div>
          </Card>
        ))}
      </div>

      {/* Row: On-Time + Orders by Status + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* On-Time Delivery KPI */}
        <Card>
          <p className="text-xs font-medium text-secondary-500 uppercase tracking-wider">On-Time Delivery Rate</p>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-4xl font-bold text-secondary-800">{stats?.onTimeDeliveryRate}%</span>
            <span className="text-xs font-semibold text-green-600 mb-1">↑ 2.1% vs last week</span>
          </div>
          <div className="mt-3 w-full bg-secondary-100 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full transition-all duration-700" style={{ width: `${stats?.onTimeDeliveryRate}%` }} />
          </div>
        </Card>

        {/* Orders by Status */}
        <Card>
          <h3 className="text-sm font-semibold text-secondary-800 mb-4">Orders by Status</h3>
          <div className="space-y-3">
            {statusData.map((item) => (
              <div key={item.status} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-secondary-600">{item.status}</span>
                    <span className="text-xs font-semibold text-secondary-800">{item.count.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-secondary-100 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${item.status === 'Delivered' ? 'bg-green-500' :
                          item.status === 'In Transit' ? 'bg-blue-500' :
                            item.status === 'Pending' ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card>
          <h3 className="text-sm font-semibold text-secondary-800 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button onClick={() => navigate('/orders')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary-50 transition-colors text-left">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              </div>
              <div><p className="text-sm font-medium text-secondary-800">Create New Order</p><p className="text-xs text-secondary-400">Start a new logistics order</p></div>
            </button>
            <button onClick={() => navigate('/shipments')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary-50 transition-colors text-left">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <div><p className="text-sm font-medium text-secondary-800">Track Shipment</p><p className="text-xs text-secondary-400">Search by tracking number</p></div>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary-50 transition-colors text-left">
              <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <div><p className="text-sm font-medium text-secondary-800">Export Report</p><p className="text-xs text-secondary-400">Download operational data</p></div>
            </button>
          </div>
        </Card>
      </div>

      {/* Carrier Split + Order Volume */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <PieChart data={carrierSplitData} size={200} title="Carrier Split By Percentage" />
        </Card>
        <Card>
          <BarChart datasets={orderVolumeData} title="Order Volume Trend" height={240} />
        </Card>
      </div>

      {/* Beyond EDD Delivery Analysis */}
      <Card>
        <h3 className="text-sm font-semibold text-secondary-800 mb-4">Beyond EDD Delivery Analysis</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {delayAnalysis.map((item) => (
            <div key={item.label} className={`${item.bgColor} rounded-xl p-4 text-center`}>
              <p className="text-xs font-medium text-secondary-600 mb-1">{item.label}</p>
              <p className={`text-2xl font-bold ${item.color}`}>{item.count.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
