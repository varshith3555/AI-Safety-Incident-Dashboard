import { SeverityFilter, SortOrder } from "@/types";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, AlertTriangle, SlidersHorizontal, Clock } from "lucide-react";

interface FilterBarProps {
  severityFilter: SeverityFilter;
  onFilterChange: (filter: SeverityFilter) => void;
  sortOrder: SortOrder;
  onSortToggle: () => void;
}

export default function FilterBar({ 
  severityFilter, 
  onFilterChange, 
  sortOrder, 
  onSortToggle 
}: FilterBarProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-5">
        <h3 className="text-base font-semibold text-white/80 mb-3 flex items-center">
          <AlertTriangle className="h-4 w-4 mr-1.5 text-indigo-400" />
          By Severity
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <FilterButton 
            filter="All" 
            currentFilter={severityFilter} 
            onClick={() => onFilterChange("All")} 
          />
          <FilterButton 
            filter="Low" 
            currentFilter={severityFilter} 
            onClick={() => onFilterChange("Low")} 
          />
          <FilterButton 
            filter="Medium" 
            currentFilter={severityFilter} 
            onClick={() => onFilterChange("Medium")} 
          />
          <FilterButton 
            filter="High" 
            currentFilter={severityFilter} 
            onClick={() => onFilterChange("High")} 
          />
        </div>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-white/80 flex items-center">
            <Clock className="h-4 w-4 mr-1.5 text-indigo-400" />
            Sort By Date
          </h3>
          <button 
            className="glass-button px-3 py-1.5 flex items-center text-sm font-medium bg-white/5 hover:bg-white/10"
            onClick={onSortToggle}
          >
            <span>{sortOrder === "newest" ? "Newest First" : "Oldest First"}</span>
            {sortOrder === "newest" ? (
              <ChevronDown className="ml-1 h-4 w-4" />
            ) : (
              <ChevronUp className="ml-1 h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

interface FilterButtonProps {
  filter: SeverityFilter;
  currentFilter: SeverityFilter;
  onClick: () => void;
}

function FilterButton({ filter, currentFilter, onClick }: FilterButtonProps) {
  const isActive = filter === currentFilter;
  
  // Define gradient styles for each filter type when active
  const activeGradients = {
    "All": "bg-gradient-to-r from-purple-500/80 to-indigo-500/80",
    "Low": "bg-gradient-to-r from-green-500/80 to-emerald-500/80",
    "Medium": "bg-gradient-to-r from-yellow-500/80 to-amber-500/80",
    "High": "bg-gradient-to-r from-red-500/80 to-rose-500/80"
  };

  // Define icons/indicators for each severity level
  const filterIndicators = {
    "All": null,
    "Low": <div className="h-2 w-2 rounded-full bg-green-400 mr-1.5"></div>,
    "Medium": <div className="h-2 w-2 rounded-full bg-amber-400 mr-1.5"></div>,
    "High": <div className="h-2 w-2 rounded-full bg-rose-400 mr-1.5"></div>
  };
  
  return (
    <Button
      variant={"ghost"}
      className={`
        px-4 py-2.5 rounded-xl border font-medium transition-all duration-300 flex items-center justify-center
        ${isActive 
          ? `${activeGradients[filter]} text-white shadow-lg border-white/20` 
          : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border-white/10"}
      `}
      onClick={onClick}
    >
      {filterIndicators[filter]}
      {filter}
    </Button>
  );
}
