import { useState } from "react";
import { IncidentFormData, SeverityFilter, SortOrder, Incident } from "@/types";
import FilterBar from "./FilterBar";
import ReportForm from "./ReportForm";
import { X } from "lucide-react";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  severityFilter: SeverityFilter;
  onFilterChange: (filter: SeverityFilter) => void;
  sortOrder: SortOrder;
  onSortToggle: () => void;
  onSubmit: (data: IncidentFormData) => void;
  incidents: Incident[];
}

export default function MobileSidebar({
  isOpen,
  onClose,
  severityFilter,
  onFilterChange,
  sortOrder,
  onSortToggle,
  onSubmit,
  incidents,
}: MobileSidebarProps) {
  // Handle form submission and close sidebar
  const handleSubmit = (data: IncidentFormData) => {
    onSubmit(data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50">
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="relative w-screen max-w-md">
          <div className="h-full flex flex-col py-6 bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-md shadow-xl overflow-y-auto border-l border-white/10">
            <div className="px-5 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-xl font-bold bg-gradient-to-r from-white via-purple-100 to-blue-200 bg-clip-text text-transparent">AI Safety Dashboard</h2>
                <button
                  type="button"
                  className="rounded-full p-1.5 bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all duration-200 focus:outline-none"
                  onClick={onClose}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="mt-6 px-5 sm:px-6 flex flex-col gap-6">
              <div className="dashboard-card p-5">
                <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Filter Incidents</h2>
                <FilterBar
                  severityFilter={severityFilter}
                  onFilterChange={onFilterChange}
                  sortOrder={sortOrder}
                  onSortToggle={onSortToggle}
                />
              </div>
              <div className="dashboard-card p-5">
                <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Report New Incident</h2>
                <ReportForm onSubmit={handleSubmit} incidents={incidents} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
