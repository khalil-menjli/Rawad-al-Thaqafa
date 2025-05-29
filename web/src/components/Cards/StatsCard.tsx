// src/components/Cards/StatsCard.tsx
interface StatsCardProps {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    color?: 'blue' | 'green' | 'purple';
  }
  
  export const StatsCard = ({ icon, title, value, color = 'blue' }: StatsCardProps) => {
    const colorClasses = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600'
    };
  
    return (
      <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
        <div className={`p-3 ${colorClasses[color]} rounded-full`}>{icon}</div>
        <div>
          <div className="text-sm text-gray-600">{title}</div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
      </div>
    );
  };