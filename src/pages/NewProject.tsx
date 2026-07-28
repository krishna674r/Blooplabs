import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { motion } from "motion/react";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { Label } from "../components/ui/Label";
import { useProjects } from "../hooks/useProjects";
import { useAiUsage } from "../hooks/useAiUsage";
import { ProjectIdea, GeneratedProject } from "../types";
import { Loader2, Sparkles, AlertCircle } from "lucide-react";

export function NewProject() {
  const navigate = useNavigate();
  const { saveProject } = useProjects();
  const { incrementUsage, hasRemainingUsage, remainingCount } = useAiUsage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProjectIdea>({
    title: "",
    description: "",
    problemArea: "",
    targetAudience: "",
    gradeLevel: "",
    category: "Science",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hasRemainingUsage()) {
      setError("You have reached your daily limit of AI generations. Please try again tomorrow.");
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      if (!incrementUsage()) {
        throw new Error("You have reached your daily limit of AI generations.");
      }
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate project');
      }

      const generatedOutput: GeneratedProject = await response.json();
      
      const newProjectId = uuidv4();
      const now = Date.now();
      
      saveProject({
        id: newProjectId,
        createdAt: now,
        updatedAt: now,
        idea: formData,
        output: generatedOutput,
      });

      navigate(`/project/${newProjectId}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred.');
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex-1 w-full max-w-3xl mx-auto px-4 py-12"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Start a New Project</h1>
        <p className="text-muted-foreground">
          Tell us about your rough idea, and our AI will help you structure it into a complete project brief.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Idea Details</CardTitle>
          <CardDescription>Don't worry if it's not perfect yet. Just get your thoughts down.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Working Title (Optional)</Label>
              <Input 
                id="title" 
                name="title" 
                placeholder="e.g., Solar Powered Water Purifier" 
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">What is your idea? *</Label>
              <Textarea 
                id="description" 
                name="description" 
                required
                placeholder="Briefly describe what you want to build or research..." 
                className="min-h-[120px]"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="problemArea">Problem Area</Label>
                <Input 
                  id="problemArea" 
                  name="problemArea" 
                  placeholder="e.g., Clean Water, Education, Robotics" 
                  value={formData.problemArea}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Input 
                  id="targetAudience" 
                  name="targetAudience" 
                  placeholder="e.g., Rural communities, Students" 
                  value={formData.targetAudience}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gradeLevel">Your Grade Level</Label>
                <select 
                  id="gradeLevel"
                  name="gradeLevel"
                  className="flex h-12 w-full rounded-xl border border-surface-border bg-surface px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm"
                  value={formData.gradeLevel}
                  onChange={handleChange}
                >
                  <option value="">Select Grade</option>
                  <option value="Middle School (6-8)">Middle School (6-8)</option>
                  <option value="High School (9-12)">High School (9-12)</option>
                  <option value="Undergraduate">Undergraduate</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Competition Category</Label>
                <select 
                  id="category"
                  name="category"
                  className="flex h-12 w-full rounded-xl border border-surface-border bg-surface px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="Science">Science (General)</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Environmental">Environmental</option>
                  <option value="Social Sciences">Social Sciences</option>
                  <option value="Business/Pitch">Business/Pitch</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 text-red-500 text-sm font-medium">
                {error}
              </div>
            )}

            <div className="pt-4 flex flex-col sm:flex-row justify-end items-center gap-4">
              {hasRemainingUsage() ? (
                <div className="text-sm text-muted-foreground">
                  {remainingCount} generations remaining today
                </div>
              ) : (
                <div className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle size={14} /> Daily limit reached
                </div>
              )}
              <Button type="submit" size="lg" disabled={isLoading || !hasRemainingUsage()} className="w-full md:w-auto gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Project Brief
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
