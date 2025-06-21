import { JSX, useState } from "react";
import { motion } from "framer-motion";
import { 
  Edit, 
  Trash2, 
  Eye,
  Book,
  Landmark,
  Library,
  Film,
  Calendar as CalendarIcon
} from "lucide-react";
import { Offer } from "../../types/types";
const API_URL = import.meta.env.VITE_API_URL as string;

interface OffersTableProps {
  offers: Offer[];
  onView?: (offer: Offer) => void;
  onEdit: (offer: Offer) => void;
  onDelete: (offer: Offer) => void;
  isAdmin: boolean;
}

type CategoryDetails = {
  icon: JSX.Element;
  bgColor: string;
  textColor: string;
  label: string;
};

// Accept either single category or array of categories
function getCategoryDetails(input: string | string[]): CategoryDetails[] {
  const cats = Array.isArray(input) ? input : [input];
  return cats.map((cat) => {
    switch (cat?.toLowerCase()) {
      case 'books':
        return { 
          icon: <Book className="w-4 h-4" />, 
          bgColor: 'bg-green-100', 
          textColor: 'text-green-600',
          label: 'Books'
        };
      case 'museums':
        return { 
          icon: <Landmark className="w-4 h-4" />, 
          bgColor: 'bg-blue-100', 
          textColor: 'text-blue-600',
          label: 'Museums'
        };
      case 'library':
        return { 
          icon: <Library className="w-4 h-4" />, 
          bgColor: 'bg-purple-100', 
          textColor: 'text-purple-600',
          label: 'Library'
        };
      case 'cinema':
        return { 
          icon: <Film className="w-4 h-4" />, 
          bgColor: 'bg-red-100', 
          textColor: 'text-red-600',
          label: 'Cinema'
        };
      default:
        return { 
          icon: <CalendarIcon className="w-4 h-4" />, 
          bgColor: 'bg-gray-100', 
          textColor: 'text-gray-600',
          label: cat
        };
    }
  });
}

export const OffersTable = ({ offers, onView, onEdit, onDelete, isAdmin }: OffersTableProps) => {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const formatDate = (dateVal: Date | string) => {
    if (!dateVal) return 'N/A';
    const date = new Date(dateVal);
    return !isNaN(date.getTime()) 
      ? date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        }) 
      : 'Invalid date';
  };

  const getPartnerName = (createdBy: Offer['createdBy']) => {
    if (!createdBy) return 'Unknown';
    if (typeof createdBy === 'object') {
      return createdBy.businessName || createdBy.firstName || createdBy.email || 'Unknown';
    }
    return 'Unknown';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#2e4057] w-32">Image</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#2e4057]">Title</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#2e4057]">Start Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#2e4057]">Category</th>
              {isAdmin && (
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#2e4057]">Partner</th>
              )}
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#2e4057]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {offers.map((offer) => (
              <motion.tr
                key={offer._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-gray-50 transition-colors"
                onMouseEnter={() => setHoveredRow(offer._id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="px-6 py-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                    {offer.imageUrl ? (
                      <img
                          src={`http://localhost:3000${offer.imageUrl}`}
                          alt={offer.title}
                          className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <CalendarIcon className="text-gray-400 w-6 h-6" />
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-[#2e4057]">{offer.title || 'Untitled'}</div>
                  <div className="text-xs text-[#82a0b6] mt-1">
                    ID: {offer._id.substring(0, 8)}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-[#82a0b6]">
                  {formatDate(offer.dateStart)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {getCategoryDetails(offer.categories).map(({ icon, bgColor, textColor, label }, idx) => (
                      <div
                        key={idx}
                        className={`inline-flex items-center px-3 py-2 rounded-lg ${bgColor} ${textColor}`}
                      >
                        {icon}
                        <span className="ml-2 text-sm font-medium">{label}</span>
                      </div>
                    ))}
                  </div>
                </td>
                {isAdmin && (
                  <td className="px-6 py-4 text-sm text-[#82a0b6]">
                    {getPartnerName(offer.createdBy)}
                  </td>
                )}
                <td className="px-6 py-4">
                  <div className="flex space-x-3">
                    {onView && (
                      <button 
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                        onClick={() => onView(offer)}
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    )}
                    <button 
                      className="text-green-500 hover:text-green-700 transition-colors"
                      onClick={() => onEdit(offer)}
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button 
                      className="text-red-500 hover:text-red-700 transition-colors"
                      onClick={() => onDelete(offer)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {offers.length === 0 && (
        <div className="p-8 text-center text-[#82a0b6]">
          No offers found
        </div>
      )}
    </motion.div>
  );
};
