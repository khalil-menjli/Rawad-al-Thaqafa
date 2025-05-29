// frontend/src/pages/ProfilePage.tsx
import React, { useEffect, useState } from 'react';
import {
  User2,
  MapPin,
  Mail,
  Globe,
  Edit,
  Briefcase,
  Building,
  CheckCircle,
  ChevronRight,
  Loader
} from 'lucide-react';
import { Partner, User } from '../types/types';
import { useAuthStore } from '../store/authStore';

const ProfilePage: React.FC = () => {
  const { user, updateProfile, isLoading, checkAuth } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User | Partner>>({});

  const API_URL = import.meta.env.VITE_API_URL as string;


  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        ...(user.role === 'Partner' && {
          websiteURL: (user as Partner).websiteUrl,
          categories: (user as Partner).categories,
          location: (user as Partner).location,
          description: (user as Partner).description,
          businessName: (user as Partner).businessName,

        }),
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(formData);
    setIsEditing(false);
  };

  if (!user) return <div>Loading...</div>;

  const avatarSrc = `${API_URL}${user.imageUrl}`
    

  return (
    <div className="w-full p-6 bg-gray-50">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#2e4057]">
          {user.role === 'Partner' ? 'Partner Profile' : 'User Profile'}
        </h1>
        <nav>
          <ol className="flex items-center gap-1.5 text-sm text-[#82a0b6]">
            <li>
              <a
                href="/"
                className="inline-flex items-center gap-1.5 hover:text-[#ff6b6b] transition-colors"
              >
                Home
                <ChevronRight className="w-4 h-4" />
              </a>
            </li>
            <li className="text-[#ff6b6b]">Profile</li>
          </ol>
        </nav>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Profile Header */}
        <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 overflow-hidden rounded-full border-2 border-[#ff6b6b]/20 bg-gray-100">
              <img
                src={avatarSrc}
                alt="user avatar"
                onError={(e) => { e.currentTarget.src = '/default-avatar.png'; }}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#2e4057] mb-1">
                {user.firstName} {user.lastName}
              </h2>
              <div className="flex items-center gap-2 text-[#82a0b6]">
                <MapPin className="w-4 h-4 text-[#ff6b6b]" />
                <span>{(user as Partner).location || 'N/A'}</span>
                {user.role === 'Partner' && (
                  <>
                    <div className="h-3.5 w-px bg-gray-300" />
                    <span>
                      {((user as Partner).categories ?? []).join(', ') || 'N/A'}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsEditing((v) => !v)}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-[#ff6b6b] bg-white rounded-full border border-[#ff6b6b] hover:bg-[#ff6b6b]/10 transition-colors"
          >
            <Edit className="w-4 h-4" />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <Section title="Personal Information" Icon={User2}>
              <FormField
                label="First Name"
                value={formData.firstName}
                editable={isEditing}
                onChange={(v) => setFormData({ ...formData, firstName: v })}
              />
              <FormField
                label="Last Name"
                value={formData.lastName}
                editable={isEditing}
                onChange={(v) => setFormData({ ...formData, lastName: v })}
              />
              <FormField
                label="Email"
                value={formData.email}
                editable={false}
                Icon={Mail}
              />
              {user.role === 'Partner' && (
                <FormField
                  label="Website URL"
                  value={(formData as Partner).websiteUrl}
                  editable={isEditing}
                  onChange={(v) =>
                    setFormData({ ...formData, websiteURL: v })
                  }
                  Icon={Globe}
                />
              )}
            </Section>

            {user.role === 'Partner' && (
              <Section title="Business Information" Icon={Briefcase}>
                <FormField
                  label="Business Name"
                  value={(formData as Partner).businessName}
                  editable={isEditing}
                  onChange={(v) =>
                    setFormData({ ...formData, businessName: v })
                  }
                  Icon={Building}
                />
                <FormField
                  label="Category"
                  value={((formData as Partner).categories ?? []).join(', ')}
                  editable={isEditing}
                  onChange={(v) =>
                    setFormData({ ...formData, categories: ['Museums'||'Books'||'Library'||'Cinema'] })
                  }
                  Icon={Briefcase}
                />
                <FormField
                  label="Location"
                  value={(formData as Partner).location}
                  editable={isEditing}
                  onChange={(v) => setFormData({ ...formData, location: v })}
                  Icon={MapPin}
                />
                <FormField
                  label="Description"
                  value={(formData as Partner).description ?? ''}
                  editable={isEditing}
                  onChange={(v) =>
                    setFormData({ ...formData, description: v })
                  }
                  Icon={Mail}
                />
              </Section>
            )}

            {isEditing && (
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#ff6b6b] text-white rounded-full hover:bg-[#ff6b6b]/90 transition-colors"
                >
                  {isLoading ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

type SectionProps = {
  title: string;
  Icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
};
const Section: React.FC<SectionProps> = ({ title, Icon, children }) => (
  <div className="bg-gray-50 rounded-lg p-6">
    <div className="mb-4 flex items-center gap-2 text-lg font-bold text-[#2e4057]">
      {Icon && <Icon className="w-5 h-5 text-[#ff6b6b]" />}
      <span>{title}</span>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
  </div>
);

type FormFieldProps = {
  label: string;
  value?: string;
  editable: boolean;
  onChange?: (val: string) => void;
  Icon?: React.ComponentType<{ className?: string }>;
};
const FormField: React.FC<FormFieldProps> = ({
  label,
  value = '',
  editable,
  onChange,
  Icon
}) => (
  <div>
    <div className="mb-1 flex items-center gap-2 text-sm text-[#82a0b6]">
      {Icon && <Icon className="w-4 h-4 text-[#ff6b6b]" />}
      <span>{label}</span>
    </div>
    {editable ? (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full rounded-lg border p-2 focus:border-transparent focus:ring-2 focus:ring-[#ff6b6b]"
      />
    ) : (
      <p className="font-medium text-[#2e4057]">{value || 'N/A'}</p>
    )}
  </div>
);

export default ProfilePage;
