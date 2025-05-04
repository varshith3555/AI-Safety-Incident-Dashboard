import { useState } from "react";
import { Incident } from "@/types";
import { formatDate } from "@/lib/utils";
import { ChevronDown, ChevronUp, Clock, AlertTriangle, RefreshCw, Info, Trash2 } from "lucide-react";

interface IncidentItemProps {
  incident: Incident;
  onDelete?: (id: number) => void;
}

export default function IncidentItem({ incident, onDelete }: IncidentItemProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete(incident.id);
    }
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  // Define severity specific styles
  const severityStyles = {
    Low: {
      border: "border-l-4 border-l-green-400",
      bg: "bg-gradient-to-r from-green-500/20 via-green-500/10 to-transparent",
      shadow: "shadow-[0_0_15px_rgba(74,222,128,0.15)]",
      detailsBg: "bg-green-500/10 border-green-500/30",
      icon: "text-green-400",
      badge: "severity-low"
    },
    Medium: {
      border: "border-l-4 border-l-amber-400",
      bg: "bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent",
      shadow: "shadow-[0_0_15px_rgba(251,191,36,0.15)]",
      detailsBg: "bg-amber-500/10 border-amber-500/30",
      icon: "text-amber-400",
      badge: "severity-medium"
    },
    High: {
      border: "border-l-4 border-l-rose-400",
      bg: "bg-gradient-to-r from-rose-500/20 via-rose-500/10 to-transparent",
      shadow: "shadow-[0_0_15px_rgba(251,113,133,0.15)]",
      detailsBg: "bg-rose-500/10 border-rose-500/30",
      icon: "text-rose-400",
      badge: "severity-high"
    }
  };

  const style = severityStyles[incident.severity];

  return (
    <li className={`incident-item ${style.border} ${style.bg} ${style.shadow} overflow-hidden hover:bg-opacity-30 transition-all duration-300`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div className="flex-1 flex items-start overflow-hidden">
          <div className="flex-shrink-0">
            <div className={style.badge}>
              <span className="flex items-center">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {incident.severity}
              </span>
            </div>
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-base font-bold text-white flex items-center truncate">
              {incident.title}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-1 mt-2">
              <div className="flex items-center flex-wrap text-xs">
                <Clock className={`h-3.5 w-3.5 mr-1.5 ${style.icon} flex-shrink-0`} />
                <span className="font-medium text-white/80 whitespace-nowrap">Reported:</span>
                <span className="text-white/70 ml-1.5 truncate">
                  {formatDate(incident.reported_at)}
                </span>
              </div>
              {incident.updated_at && (
                <div className="flex items-center flex-wrap text-xs">
                  <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${style.icon} flex-shrink-0`} />
                  <span className="font-medium text-white/80 whitespace-nowrap">Updated:</span>
                  <span className="text-white/70 ml-1.5 truncate">
                    {formatDate(incident.updated_at)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-3 sm:mt-0 flex-shrink-0">
          <button
            className="glass-button text-sm !px-2 py-1 flex items-center bg-red-500/10 hover:bg-red-500/20 border-red-400/20"
            onClick={handleDeleteClick}
            aria-label="Delete incident"
          >
            <Trash2 className="h-4 w-4 text-red-400" />
          </button>
          <button
            className={`glass-button text-sm px-3 py-1 flex items-center bg-${incident.severity.toLowerCase()}-500/10 hover:bg-${incident.severity.toLowerCase()}-500/20 border-${incident.severity.toLowerCase()}-400/20`}
            onClick={toggleDetails}
          >
            <span>{showDetails ? "Hide" : "View"}</span>
            {showDetails ? (
              <ChevronUp className={`ml-1 h-4 w-4 ${style.icon}`} />
            ) : (
              <ChevronDown className={`ml-1 h-4 w-4 ${style.icon}`} />
            )}
          </button>
        </div>
      </div>
      
      {/* Delete confirmation dialog */}
      {showDeleteConfirm && (
        <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-white mb-3 text-sm">Are you sure you want to delete this incident?</p>
          <div className="flex justify-end space-x-2">
            <button 
              className="glass-button !py-1 !px-3 !text-sm bg-white/5"
              onClick={handleCancelDelete}
            >
              Cancel
            </button>
            <button 
              className="glass-button !py-1 !px-3 !text-sm bg-red-500/80 hover:bg-red-600/80 border-red-400/30"
              onClick={handleConfirmDelete}
            >
              Delete
            </button>
          </div>
        </div>
      )}
      
      {/* Hidden details section */}
      <div className={`mt-4 transition-all duration-300 ease-in-out ${showDetails ? "opacity-100 max-h-96" : "opacity-0 max-h-0 overflow-hidden"}`}>
        <div className={`text-sm text-white/90 p-4 rounded-xl backdrop-blur-sm border ${style.detailsBg}`}>
          <div className="flex items-start">
            <Info className={`h-4 w-4 mr-2 mt-0.5 ${style.icon} flex-shrink-0`} />
            <p className="break-words">{incident.description}</p>
          </div>
        </div>
      </div>
    </li>
  );
}
