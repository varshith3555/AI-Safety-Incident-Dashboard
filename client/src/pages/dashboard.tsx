import { useState, useEffect } from "react";
import IncidentList from "@/components/IncidentList";
import FilterBar from "@/components/FilterBar";
import ReportForm from "@/components/ReportForm";
import MobileSidebar from "@/components/MobileSidebar";
import { Incident, SeverityFilter, SortOrder } from "@/types";
import { getCurrentDateISO, generateId } from "@/lib/utils";
import { ShieldCheck, CheckCircle } from "lucide-react";

// Initial incidents data
const initialIncidents: Incident[] = [
  {
    id: 1,
    title: "Biased Recommendation Algorithm",
    description: "Algorithm consistently favored certain demographics...",
    severity: "Medium",
    reported_at: "2025-03-15T07:30:00Z", // Updated to match the time shown in UI (7:30 PM in GMT+5:30)
    updated_at: "2025-05-04T05:22:00Z"    // Updated to match the time shown in UI (5:22 PM)
  },
  {
    id: 2,
    title: "LLM Hallucination in Critical Info",
    description: "LLM provided incorrect safety procedure information...",
    severity: "High",
    reported_at: "2025-04-01T14:30:00Z",
    updated_at: "2025-04-01T14:30:00Z"
  },
  {
    id: 3,
    title: "Minor Data Leak via Chatbot",
    description: "Chatbot inadvertently exposed non-sensitive user metadata...",
    severity: "Low",
    reported_at: "2025-03-20T09:15:00Z",
    updated_at: "2025-03-20T09:15:00Z"
  }
];

// Storage key for localStorage
const STORAGE_KEY = 'ai_safety_incidents';

export default function Dashboard() {
  // Initialize incidents state from localStorage or use initialIncidents as fallback
  const [incidents, setIncidents] = useState<Incident[]>(() => {
    // Try to get saved incidents from localStorage
    const savedIncidents = localStorage.getItem(STORAGE_KEY);
    return savedIncidents ? JSON.parse(savedIncidents) : initialIncidents;
  });
  
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("All");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [deleteNotification, setDeleteNotification] = useState<string | null>(null);
  
  // Save incidents to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(incidents));
  }, [incidents]);

  // Hide delete notification after 5 seconds
  useEffect(() => {
    if (deleteNotification) {
      const timer = setTimeout(() => {
        setDeleteNotification(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [deleteNotification]);

  // Filter incidents based on severity
  const filteredIncidents = incidents.filter(incident => 
    severityFilter === "All" || incident.severity === severityFilter
  );

  // Sort incidents based on reported_at date
  const sortedIncidents = [...filteredIncidents].sort((a, b) => {
    const dateA = new Date(a.reported_at).getTime();
    const dateB = new Date(b.reported_at).getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  // Handle adding a new incident
  const handleAddIncident = (formData: Omit<Incident, "id">) => {
    // Check if an incident with the same title already exists
    const existingIncidentIndex = incidents.findIndex(
      incident => incident.title.toLowerCase() === formData.title.toLowerCase()
    );

    if (existingIncidentIndex !== -1) {
      // Update the existing incident with new description and updated timestamp
      const updatedIncidents = [...incidents];
      updatedIncidents[existingIncidentIndex] = {
        ...updatedIncidents[existingIncidentIndex],
        description: formData.description,
        severity: formData.severity,
        updated_at: getCurrentDateISO()
      };
      
      setIncidents(updatedIncidents);
    } else {
      // For new incidents, the reported_at and updated_at are initially the same
      const newIncident = {
        ...formData,
        id: generateId(),
        updated_at: getCurrentDateISO()
      };
      
      setIncidents([newIncident, ...incidents]);
    }
  };

  // Handle deleting an incident
  const handleDeleteIncident = (id: number) => {
    const incidentToDelete = incidents.find(incident => incident.id === id);
    const updatedIncidents = incidents.filter(incident => incident.id !== id);
    setIncidents(updatedIncidents);
    
    if (incidentToDelete) {
      setDeleteNotification(`Successfully deleted incident "${incidentToDelete.title}"`);
    }
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "newest" ? "oldest" : "newest");
  };

  // Reset incidents to initial data (for testing/development purposes)
  const resetIncidents = () => {
    setIncidents(initialIncidents);
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Decorative elements - constrained within the viewport */}
      <div className="fixed top-20 left-0 w-64 h-64 bg-purple-500/30 rounded-full filter blur-3xl opacity-20 animate-float pointer-events-none"></div>
      <div className="fixed top-40 right-0 w-64 h-64 bg-blue-500/30 rounded-full filter blur-3xl opacity-20 animate-float pointer-events-none" style={{ animationDelay: '1s' }}></div>
      <div className="fixed bottom-20 left-1/4 w-60 h-60 bg-teal-500/20 rounded-full filter blur-3xl opacity-20 animate-float pointer-events-none" style={{ animationDelay: '2s' }}></div>
      
      {/* Delete notification */}
      {deleteNotification && (
        <div className="fixed top-5 right-5 z-50 bg-red-500/20 border border-red-500/30 rounded-md py-2.5 px-4 flex items-center shadow-lg backdrop-blur-sm">
          <CheckCircle className="h-5 w-5 text-red-400 mr-2" />
          <p className="text-white text-sm font-medium">{deleteNotification}</p>
        </div>
      )}
      
      <header className="dashboard-card relative backdrop-blur-md z-10">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-5">
          <div className="flex justify-between items-center bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-xl p-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-gradient-to-r from-white via-purple-100 to-blue-200 bg-clip-text flex items-center">
              <ShieldCheck className="mr-3 text-indigo-400 h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0" />
              <span className="truncate">AI Safety Incident Dashboard</span>
            </h1>
            <div className="flex items-center">
              <button 
                type="button" 
                className="lg:hidden glass-button"
                onClick={() => setIsMobileSidebarOpen(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full max-w-[1400px] relative z-10 mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Sidebar - visible on desktop */}
          <div className="lg:col-span-3 xl:col-span-3 lg:block hidden space-y-6">
            <div className="dashboard-card p-5">
              <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Filter Incidents</h2>
              <FilterBar 
                severityFilter={severityFilter} 
                onFilterChange={setSeverityFilter}
                sortOrder={sortOrder}
                onSortToggle={toggleSortOrder}
              />
            </div>
            
            <div className="dashboard-card p-5">
              <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Report New Incident</h2>
              <ReportForm onSubmit={handleAddIncident} incidents={incidents} />
            </div>
          </div>

          {/* Mobile sidebar toggle (only shows on mobile) */}
          <div className="lg:hidden mb-4">
            <button 
              className="w-full glass-button py-3 px-4 flex justify-center items-center"
              onClick={() => setIsMobileSidebarOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Filters & New Report</span>
            </button>
          </div>

          {/* Mobile sidebar */}
          <MobileSidebar 
            isOpen={isMobileSidebarOpen}
            onClose={() => setIsMobileSidebarOpen(false)}
            severityFilter={severityFilter}
            onFilterChange={setSeverityFilter}
            sortOrder={sortOrder}
            onSortToggle={toggleSortOrder}
            onSubmit={handleAddIncident}
            incidents={incidents}
          />

          {/* Main content - Incident List */}
          <div className="lg:col-span-9 xl:col-span-9">
            <IncidentList incidents={sortedIncidents} onDeleteIncident={handleDeleteIncident} />
          </div>
        </div>
      </main>
    </div>
  );
}
