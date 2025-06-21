import { NavLink } from 'react-router-dom';
import { Home, User, Users, BookOpen, Building2Icon, Target, MessageSquare, Star } from 'lucide-react';
import { useAuthStore } from "../store/authStore.tsx";

const Sidebar = () => {
  const { user } = useAuthStore();

  if (!user) return null;

  const allLinks = [
    { to: '/cultural-offers', label: 'Cultural Offers', icon: BookOpen, roles: ['Admin', 'Partner'] },
    { to: '/partners', label: 'Partners', icon: Building2Icon, roles: ['Admin'] },
    { to: '/users', label: 'Users', icon: Users, roles: ['Admin'] },
    { to: '/tasks', label: 'Tasks', icon: Target, roles: ['Admin'] },
    { to: '/comments', label: 'Comments', icon: MessageSquare, roles: ['Partner'] },
    { to: '/reviews', label: 'Reviews', icon: Star, roles: ['Partner'] },
  ];

  // Filter links based on user role
  const visibleLinks = allLinks.filter(link =>
      link.roles.includes(user.role)
  );

  return (
      <div className="w-64 bg-white border-r border-gray-200 shadow-sm h-full flex flex-col">
        <div className="p-6 flex-1">
          {/* Logo/Brand Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-sm text-gray-500 mt-1">Welcome back, {user.firstName}</p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            {visibleLinks.map(({ to, label, icon: Icon }) => (
                <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
                            isActive
                                ? 'bg-orange-50 text-[#ff6b6b] border-r-2 border-[#ff7f50]'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`
                    }
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span>{label}</span>
                </NavLink>
            ))}
          </nav>
        </div>

        {/* User Info Section - Now at bottom and clickable */}
        <div className="p-6 border-t border-gray-200">
          <NavLink
              to="/profile"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-all duration-200 group"
          >
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-[#ff6b6b]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user.role}
              </p>
            </div>
          </NavLink>
        </div>
      </div>
  );
};

export default Sidebar;