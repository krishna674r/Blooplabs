import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { useProjects } from "../hooks/useProjects";
import { ArrowLeft, Copy, Check, AlertCircle, Sparkles, LayoutTemplate, FlaskConical, Target, MessageSquare, X } from "lucide-react";
import { PitchBuilder } from "../components/PitchBuilder";

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects } = useProjects();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('canvas');
  const [mentorOpen, setMentorOpen] = useState(false);
  const [mentorFeedback, setMentorFeedback] = useState<{
    structuralFeedback: string;
    feasibilityTip: string;
    pitchRefinement: string;
  } | null>(null);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [hasGeneratedFeedback, setHasGeneratedFeedback] = useState(false);
  
  const project = projects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Project not found</h2>
        <p className="text-muted-foreground mb-6">The project you're looking for doesn't exist or was deleted.</p>
        <Link to="/dashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const { output } = project;

  const generateMentorFeedback = async () => {
    if (isGeneratingFeedback) return;
    setIsGeneratingFeedback(true);
    try {
      const response = await fetch('/api/project-mentor-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project: output })
      });
      if (!response.ok) throw new Error('Failed to fetch feedback');
      const data = await response.json();
      setMentorFeedback(data);
      setHasGeneratedFeedback(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  const handleOpenMentor = () => {
    setMentorOpen(!mentorOpen);
    if (!mentorOpen && !hasGeneratedFeedback && !mentorFeedback) {
      generateMentorFeedback();
    }
  };

  const copyToClipboard = () => {
    const text = `
Title: ${output.title}

Pitch:
${output.pitch}

Problem Statement:
${output.problem_statement}

Solution Summary:
${output.solution_summary}

Why It Matters:
${output.why_it_matters}

Uniqueness:
${output.uniqueness}

Feasibility:
${output.feasibility}

Materials Needed:
${output.materials.map(m => `- ${m}`).join('\n')}

Steps:
${output.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Expected Outcome:
${output.expected_outcome}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const Section = ({ title, content }: { title: string, content: React.ReactNode }) => (
    <div className="space-y-2 mb-6">
      <h4 className="text-xs font-bold text-muted-foreground uppercase">{title}</h4>
      <div className="text-sm leading-relaxed text-muted-foreground">
        {content}
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row relative"
    >
      <div className={`flex-1 transition-all duration-300 w-full ${mentorOpen ? 'md:pr-80 lg:pr-96' : ''}`}>
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <Button variant="ghost" className="gap-2 -ml-4" onClick={() => navigate('/dashboard')}>
              <ArrowLeft size={18} />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-surface/50 px-3 py-1.5 rounded-full border border-surface-border shadow-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              Auto-saved locally at {new Date(project.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button variant="outline" className="gap-2 flex-1 sm:flex-none" onClick={handleOpenMentor}>
              <MessageSquare size={16} />
              {mentorOpen ? 'Hide AI Mentor' : 'AI Mentor'}
            </Button>
            <Button variant="outline" className="gap-2 flex-1 sm:flex-none" onClick={copyToClipboard}>
              {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
              {copied ? "Copied!" : "Copy Brief"}
            </Button>
            <Link to="/export">
               <Button variant="default">Export Project</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Workspace Nav */}
          <div className="lg:col-span-1 space-y-2">
            <div className="bg-surface border border-surface-border p-4 rounded-xl mb-4">
              <h3 className="font-bold text-lg mb-1 truncate" title={output.title}>{output.title}</h3>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                {project.idea.category || "General"}
              </span>
            </div>

            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-2">Workspace Tools</h4>
            
            <nav className="space-y-1">
              <button onClick={() => setActiveTab('canvas')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'canvas' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-surface-hover hover:text-foreground'}`}>
                <LayoutTemplate size={16} /> Project Canvas
              </button>
              <button onClick={() => setActiveTab('methodology')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'methodology' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-surface-hover hover:text-foreground'}`}>
                <FlaskConical size={16} /> Methodology Builder
              </button>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8">
            
            {activeTab === 'canvas' && (
              <>
                <div className="pt-2">
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 flex items-start space-x-4">
                    <div className="w-10 h-10 rounded bg-primary flex-shrink-0 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-primary">Elevator Pitch</h5>
                      <p className="text-sm italic text-primary leading-relaxed mt-1">
                        "{output.pitch}"
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <Section title="Problem Statement" content={<p className="break-words whitespace-pre-wrap">{output.problem_statement}</p>} />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <Section title="Solution Summary" content={<p className="break-words whitespace-pre-wrap">{output.solution_summary}</p>} />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <Section title="Why It Matters" content={<p className="break-words whitespace-pre-wrap">{output.why_it_matters}</p>} />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <Section title="Expected Outcome" content={<p className="break-words whitespace-pre-wrap">{output.expected_outcome}</p>} />
                    </CardContent>
                  </Card>
                  <Card className="md:col-span-2">
                    <CardContent className="pt-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-xs font-bold text-muted-foreground uppercase mb-2">Uniqueness</h4>
                          <p className="text-sm break-words whitespace-pre-wrap">{output.uniqueness}</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-muted-foreground uppercase mb-2">Feasibility</h4>
                          <p className="text-sm text-success break-words whitespace-pre-wrap">{output.feasibility}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}

            {activeTab === 'methodology' && (
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-4">Methodology & Steps</h3>
                    <ol className="space-y-4">
                      {output.steps.map((step, idx) => (
                        <li key={idx} className="flex gap-4 p-4 bg-surface rounded-lg border border-surface-border">
                          <div className="w-8 h-8 shrink-0 bg-primary/10 text-primary font-bold rounded-full flex items-center justify-center">
                            {idx + 1}
                          </div>
                          <p className="text-sm pt-1">{step}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                  
                  <div className="pt-6 border-t border-surface-border">
                    <h3 className="text-xl font-bold mb-4">Materials Needed</h3>
                    <div className="flex flex-wrap gap-2">
                      {output.materials.map((item, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-surface border border-surface-border rounded-full text-sm">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* AI Mentor Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-80 lg:w-96 bg-surface border-l border-surface-border shadow-2xl transition-transform duration-300 ease-in-out z-50 pt-20 ${mentorOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-4 border-b border-surface-border flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-bold">
            <Sparkles size={18} />
            AI Innovation Mentor
          </div>
          <button onClick={() => setMentorOpen(false)} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>
        <div className="p-4 space-y-6 h-[calc(100vh-5rem)] overflow-y-auto">
          
          {isGeneratingFeedback ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary animate-pulse" />
              </div>
              <p className="text-sm text-muted-foreground animate-pulse">Analyzing project structure and feasibility...</p>
            </div>
          ) : mentorFeedback ? (
            <>
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                <h4 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                  <AlertCircle size={14} /> Structural Feedback
                </h4>
                <p className="text-sm text-muted-foreground">
                  {mentorFeedback.structuralFeedback}
                </p>
              </div>

              <div className="bg-secondary/5 rounded-lg p-4 border border-secondary/10">
                <h4 className="text-sm font-semibold text-secondary-foreground mb-2 flex items-center gap-2">
                  <Target size={14} /> Feasibility Tip
                </h4>
                <p className="text-sm text-muted-foreground">
                  {mentorFeedback.feasibilityTip}
                </p>
              </div>

              <div className="bg-surface-hover rounded-lg p-4 border border-surface-border">
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <MessageSquare size={14} /> Pitch Refinement
                </h4>
                <p className="text-sm text-muted-foreground">
                  {mentorFeedback.pitchRefinement}
                </p>
              </div>

              <Button className="w-full gap-2 mt-4" variant="outline" onClick={generateMentorFeedback}>
                <Sparkles size={16} /> Regenerate Analysis
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
              <Button onClick={generateMentorFeedback} className="gap-2">
                <Sparkles size={16} /> Generate Feedback
              </Button>
            </div>
          )}

        </div>
      </div>

    </motion.div>
  );
}
