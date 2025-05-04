import { useState, useEffect } from "react";
import { IncidentFormData, Incident } from "@/types";
import { getCurrentDateISO } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CheckCircle, AlertTriangle, FileText, Calendar } from "lucide-react";

interface ReportFormProps {
  onSubmit: (data: IncidentFormData) => void;
  incidents?: Incident[]; // Add incidents prop to check for existing titles
}

export default function ReportForm({ onSubmit, incidents = [] }: ReportFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<"Low" | "Medium" | "High" | "">("");
  const [errors, setErrors] = useState({
    title: false,
    description: false,
    severity: false,
  });
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [existingIncident, setExistingIncident] = useState<Incident | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Get current date in ISO format for the form
  const currentDate = new Date().toLocaleDateString();

  // Define severity specific styles
  const severityStyles = {
    "": {
      color: "text-white/80",
      border: "border-white/10",
      bg: "from-indigo-500 to-purple-600",
      icon: "text-indigo-400"
    },
    "Low": {
      color: "text-green-400",
      border: "border-green-400/30",
      bg: "from-green-500 to-emerald-600",
      icon: "text-green-400"
    },
    "Medium": {
      color: "text-amber-400",
      border: "border-amber-400/30",
      bg: "from-amber-500 to-orange-600",
      icon: "text-amber-400"
    },
    "High": {
      color: "text-rose-400",
      border: "border-rose-400/30",
      bg: "from-rose-500 to-red-600",
      icon: "text-rose-400"
    }
  };

  const style = severityStyles[severity] || severityStyles[""];
  
  // Check if the current title exists in the incidents list
  useEffect(() => {
    if (title && incidents.length > 0) {
      const existing = incidents.find(
        incident => incident.title.toLowerCase() === title.toLowerCase()
      );
      
      setIsUpdateMode(!!existing);
      setExistingIncident(existing || null);
      
      // If we found an existing incident and no description has been entered yet,
      // autofill with the existing description and severity
      if (existing && description === "") {
        setDescription(existing.description);
        setSeverity(existing.severity);
      }
    } else {
      setIsUpdateMode(false);
      setExistingIncident(null);
    }
  }, [title, incidents]);

  // Hide success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {
      title: title.trim() === "",
      description: description.trim() === "",
      severity: severity === "",
    };
    
    setErrors(newErrors);
    
    // If no errors, submit the form
    if (!newErrors.title && !newErrors.description && !newErrors.severity) {
      onSubmit({
        title,
        description,
        severity: severity as "Low" | "Medium" | "High",
        reported_at: existingIncident ? existingIncident.reported_at : getCurrentDateISO(),
      });
      
      // Show success message
      if (isUpdateMode) {
        setSuccessMessage("Updation Successful");
      } else {
        setSuccessMessage("Creation Successful");
      }
      
      // Reset form
      setTitle("");
      setDescription("");
      setSeverity("");
      setIsUpdateMode(false);
      setExistingIncident(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <Label htmlFor="title" className="block text-sm font-medium text-white/80 mb-1.5 flex items-center">
          <FileText className="h-3.5 w-3.5 mr-1.5 opacity-70" />
          Title <span className="text-rose-400 ml-1">*</span>
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Brief description of the incident"
          className={`glass-input w-full ${isUpdateMode ? 'border-amber-400/50 bg-amber-500/10' : ''}`}
        />
        {errors.title && (
          <p className="text-rose-400 text-xs mt-1.5">Title is required</p>
        )}
        {isUpdateMode && !errors.title && (
          <div className="flex items-center mt-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400 mr-1" />
            <p className="text-amber-400 text-xs">An incident with this title already exists and will be updated</p>
          </div>
        )}
      </div>
      
      <div>
        <Label htmlFor="description" className="block text-sm font-medium text-white/80 mb-1.5 flex items-center">
          <FileText className="h-3.5 w-3.5 mr-1.5 opacity-70" />
          Description <span className="text-rose-400 ml-1">*</span>
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detailed description of what happened"
          rows={4}
          className={`glass-input w-full ${severity ? `border-${severity.toLowerCase()}-400/30 bg-${severity.toLowerCase()}-500/5` : ''}`}
        />
        {errors.description && (
          <p className="text-rose-400 text-xs mt-1.5">Description is required</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="severity" className="block text-sm font-medium text-white/80 mb-1.5 flex items-center">
          <AlertTriangle className="h-3.5 w-3.5 mr-1.5 opacity-70" />
          Severity <span className="text-rose-400 ml-1">*</span>
        </Label>
        <Select
          value={severity}
          onValueChange={(value) => setSeverity(value as "Low" | "Medium" | "High")}
        >
          <SelectTrigger 
            id="severity" 
            className={`glass-input w-full ${severity ? `text-${severity.toLowerCase()}-400 border-${severity.toLowerCase()}-400/30` : 'text-white'}`}
          >
            <SelectValue placeholder="Select severity" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800/90 backdrop-blur-md border border-white/10">
            <SelectItem value="Low" className="text-green-400 focus:bg-green-500/10 focus:text-white flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
              Low
            </SelectItem>
            <SelectItem value="Medium" className="text-amber-400 focus:bg-amber-500/10 focus:text-white flex items-center">
              <div className="w-2 h-2 rounded-full bg-amber-400 mr-2"></div>
              Medium
            </SelectItem>
            <SelectItem value="High" className="text-rose-400 focus:bg-rose-500/10 focus:text-white flex items-center">
              <div className="w-2 h-2 rounded-full bg-rose-400 mr-2"></div>
              High
            </SelectItem>
          </SelectContent>
        </Select>
        {errors.severity && (
          <p className="text-rose-400 text-xs mt-1.5">Severity is required</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="reported_at" className="block text-sm font-medium text-white/80 mb-1.5 flex items-center">
          <Calendar className="h-3.5 w-3.5 mr-1.5 opacity-70" />
          {isUpdateMode ? "Original Report Date" : "Report Date"}
        </Label>
        <Input
          id="reported_at"
          value={isUpdateMode && existingIncident ? new Date(existingIncident.reported_at).toLocaleDateString() : currentDate}
          disabled
          className="glass-input w-full opacity-70"
        />
      </div>
      
      {successMessage && (
        <div className={`rounded-md py-2.5 px-3 flex items-center justify-center ${
          isUpdateMode ? 'bg-amber-500/20 border border-amber-500/30' : 'bg-green-500/20 border border-green-500/30'
        }`}>
          <CheckCircle className={`h-5 w-5 mr-2 ${isUpdateMode ? 'text-amber-400' : 'text-green-400'}`} />
          <p className={`text-sm font-medium ${isUpdateMode ? 'text-amber-300' : 'text-green-300'}`}>{successMessage}</p>
        </div>
      )}
      
      <div className="pt-2">
        <Button 
          type="submit" 
          className={`w-full text-white font-medium py-2.5 bg-gradient-to-r ${
            isUpdateMode 
              ? "from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700" 
              : severity 
                ? `from-${severity.toLowerCase()}-500 to-${severity === 'Low' ? 'emerald' : severity === 'Medium' ? 'orange' : 'red'}-600 hover:from-${severity.toLowerCase()}-600 hover:to-${severity === 'Low' ? 'emerald' : severity === 'Medium' ? 'orange' : 'red'}-700`
                : "from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
          }`}
        >
          {isUpdateMode ? "Update Incident" : "Submit Report"}
        </Button>
      </div>
    </form>
  );
}
