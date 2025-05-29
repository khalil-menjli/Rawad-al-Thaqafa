import React from 'react';
import { Book, Building2, Library, Film } from 'lucide-react';
import { JSX } from 'react/jsx-runtime';

 type Category = string;

export interface CategoryFilterProps {
  categories: Category[];
  selected: Category;
  counts?: Record<Category, number>;
  onChange: (category: Category) => void;
  allLabel?: string;
}

const iconMap: Record<string, JSX.Element> = {
  Books: <Book className="w-4 h-4" />,
  Museums: <Building2 className="w-4 h-4" />,
  Library: <Library className="w-4 h-4" />,
  Cinema: <Film className="w-4 h-4" />,
};

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selected,
  counts = {},
  onChange,
  allLabel = 'All',
}) => {
  return (
    <div className="mb-6 flex items-center">
      <span className="text-sm text-gray-500 mr-3">Filter by category:</span>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => onChange(allLabel)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            selected === allLabel
              ? 'bg-[#ff6b6b] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {allLabel} ({counts[allLabel] ?? categories.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 transition-colors ${
              selected === cat
                ? 'bg-[#ff6b6b] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {(iconMap[cat] || null)} {cat} ({counts[cat] ?? 0})
          </button>
        ))}
      </div>
    </div>
  );
};