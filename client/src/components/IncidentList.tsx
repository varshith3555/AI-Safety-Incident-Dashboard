import { Incident } from "@/types";
import IncidentItem from "./IncidentItem";
import { ShieldAlert } from "lucide-react";

interface IncidentListProps {
  incidents: Incident[];
  onDeleteIncident?: (id: number) => void;
}

export default function IncidentList({ incidents, onDeleteIncident }: IncidentListProps) {
  return (
    <div className="dashboard-card overflow-hidden h-full">
      <div className="border-b border-white/10 px-5 py-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20">
        <h2 className="text-xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent flex items-center">
          <ShieldAlert className="mr-2 h-5 w-5 text-indigo-400 flex-shrink-0" />
          <span className="truncate">Incidents</span>
        </h2>
      </div>
      
      {incidents.length > 0 ? (
        <ul className="p-3 space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto overflow-x-hidden">
          {incidents.map((incident) => (
            <IncidentItem 
              key={incident.id} 
              incident={incident} 
              onDelete={onDeleteIncident}
            />
          ))}
        </ul>
      ) : (
        <div className="py-12">
          <div className="text-center">
            <div className="mx-auto h-14 w-14 rounded-full bg-indigo-500/20 flex items-center justify-center backdrop-blur-sm border border-indigo-400/30">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-7 w-7 text-indigo-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              </svg>
            </div>
            <h3 className="mt-4 text-base font-medium text-white">No incidents</h3>
            <p className="mt-1 text-sm text-white/70">No incidents match your current filters.</p>
          </div>
        </div>
      )}
    </div>
  );
}
