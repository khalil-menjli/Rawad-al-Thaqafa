import React, { useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import {
  Users,
  Building2,
  Ticket,
  Clock,
  Star,
  AlertTriangle,
  Settings
} from 'lucide-react';
import {
  AreaChart,
  Area as RechartsAreaRaw,
  ResponsiveContainer,
  Tooltip as RechartsTooltipRaw
} from 'recharts';

import { CulturalOffers } from '../CulturalOffers';
import { useOffersStore } from '../../hooks/useOffres';
import { useUserStore } from '../../hooks/useUsers';

// Workaround TS generic component typing
const RechartsTooltip = RechartsTooltipRaw as unknown as React.FC<any>;
const RechartsArea = RechartsAreaRaw as unknown as React.FC<any>;

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  trendUp: boolean;
}

export function AdminDashboard() {
  const {
    usersApproved = [],
    usersNotApproved = [],
    partnersApproved = [],
    partnersNotApproved = [],
    loading: userLoading,
    error: userError,
    fetchUsersApproved,
    fetchUsersNotApproved,
    fetchPartnersApproved,
    fetchPartnersNotApproved,
  } = useUserStore();

  const {
    offers = [],
    loading: offersLoading,
    error: offersError,
    fetchOffers,
  } = useOffersStore();

  useEffect(() => {
    fetchUsersApproved();
    fetchUsersNotApproved();
    fetchPartnersApproved();
    fetchPartnersNotApproved();
    fetchOffers();
  }, []);

  if (userLoading || offersLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading dashboard data...</p>
      </div>
    );
  }
  if (userError || offersError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600">Error: {userError || offersError}</p>
      </div>
    );
  }

  // Ensure offers is an array (API may wrap in data)
  const offerList: any[] = Array.isArray(offers)
    ? offers
    : Array.isArray((offers as any).data)
      ? (offers as any).data
      : [];

  const statsData = [
    { name: 'Jan', Users: usersApproved.length },
    { name: 'Feb', Users: Math.round(usersApproved.length * 1.1) },
    { name: 'Mar', Users: Math.round(usersApproved.length * 1.2) },
    { name: 'Apr', Users: Math.round(usersApproved.length * 1.15) },
    { name: 'May', Users: Math.round(usersApproved.length * 1.3) },
  ];

  const totalOffers = offerList.length;
  const totalViews = offerList.reduce((sum, o) => sum + (o.views || 0), 0);

  const cards: DashboardCardProps[] = [
    {
      title: 'Approved Users',
      value: usersApproved.length.toString(),
      icon: <Users className="h-6 w-6 text-blue-500" />,
      trendUp: true,
      trend: `${Math.round((usersApproved.length / ((usersNotApproved.length || 0) + usersApproved.length || 1)) * 100)}%`,
    },
    {
      title: 'Pending Users',
      value: usersNotApproved.length.toString(),
      icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
      trendUp: usersNotApproved.length === 0,
      trend: usersNotApproved.length > 0 ? `+${usersNotApproved.length}` : '0',
    },
    {
      title: 'Approved Partners',
      value: partnersApproved.length.toString(),
      icon: <Building2 className="h-6 w-6 text-purple-500" />,
      trendUp: true,
      trend: partnersApproved.length.toString(),
    },
    {
      title: 'Pending Partners',
      value: partnersNotApproved.length.toString(),
      icon: <AlertTriangle className="h-6 w-6 text-orange-500" />,
      trendUp: partnersNotApproved.length === 0,
      trend: partnersNotApproved.length.toString(),
    },
    {
      title: 'Cultural Offers',
      value: totalOffers.toString(),
      icon: <Ticket className="h-6 w-6 text-green-500" />,
      trendUp: true,
      trend: totalOffers.toString(),
    },
    {
      title: 'Total Views',
      value: totalViews.toString(),
      icon: <Star className="h-6 w-6 text-yellow-400" />,
      trendUp: true,
      trend: totalOffers.toString(),
    },
    {
      title: 'Active Sessions',
      value: '128',
      icon: <Clock className="h-6 w-6 text-indigo-500" />,
      trendUp: true,
      trend: '+8%',
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="flex items-center justify-between bg-white px-8 py-4 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard Overview</h1>
        <Link to="/settings" className="text-gray-600 hover:text-gray-800">
          <Settings className="h-6 w-6" />
        </Link>
      </header>

      <div className="flex-1 overflow-auto p-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map(card => (
            <DashboardCard key={card.title} {...card} />
          ))}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-medium text-gray-700 mb-4">Monthly User Growth</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={statsData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <RechartsTooltip />
              <RechartsArea type="monotone" dataKey="Users" stroke="#3b82f6" fill="url(#colorUsers)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div>
          <Routes>
            <Route path="/" element={<></>} />
            <Route path="/users" element={<div>Users Management Section</div>} />
            <Route path="/partners" element={<div>Partners Management Section</div>} />
            <Route path="/offers" element={<CulturalOffers />} />
            <Route path="/tasks" element={<div>Tasks Management Section</div>} />
            <Route path="/settings" element={<div>Settings Section</div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ title, value, icon, trend, trendUp }: DashboardCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl">{icon}</div>
        <div className={`text-sm font-semibold ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
          {trendUp ? '▲ ' : '▼ '}{trend}
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-500 uppercase tracking-wide">{title}</p>
        <p className="text-3xl font-bold mt-1 text-gray-800">{value}</p>
      </div>
    </div>
  );
}
