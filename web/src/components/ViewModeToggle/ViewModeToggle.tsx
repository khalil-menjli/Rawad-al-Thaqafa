import { Button } from "../ui/Button";
import { CalendarIcon, List } from "lucide-react";

interface ViewModeToggleProps {
  viewMode: 'list' | 'calendar';
  onViewModeChange: (mode: 'list' | 'calendar') => void;
}

export const ViewModeToggle = ({ viewMode, onViewModeChange }: ViewModeToggleProps) => (
  <div className="flex rounded-lg border border-gray-200">
    <Button
      variant={viewMode === 'list' ? 'primary' : 'outline'}
      size="sm"
      className="rounded-r-none"
      onClick={() => onViewModeChange('list')}
    >
      <List className="h-4 w-4" />
    </Button>
    <Button
      variant={viewMode === 'calendar' ? 'primary' : 'outline'}
      size="sm"
      className="rounded-l-none"
      onClick={() => onViewModeChange('calendar')}
    >
      <CalendarIcon className="h-4 w-4" />
    </Button>
    
  </div>
);