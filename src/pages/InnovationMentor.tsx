import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Textarea';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Sparkles, Send, BrainCircuit, Lightbulb, Presentation, AlertCircle, Lock } from 'lucide-react';

import { useProjects } from '../hooks/useProjects';

const mentorTools = [
  { id: 'idea-generator', label: 'Idea Generator', icon: <Lightbulb size={16} />, description: 'Generate new project ideas from a topic, problem, or interest area.' },
  { id: 'idea', label: 'Idea Improver', icon: <Sparkles size={16} />, description: 'Improve an existing idea and make it stronger, clearer, and more competition-ready.' },
  { id: 'research', label: 'Research Assistant', icon: <BrainCircuit size={16} />, description: 'Help users research their idea and find useful direction.' },
  { id: 'pitch-readiness', label: 'Pitch & Readiness', icon: <Presentation size={16} />, description: 'Check how ready the project is for presentation, competition, or submission.' }
];

export function InnovationMentor() {
  const { projects, saveProject } = useProjects();
  const [activeTool, setActiveTool] = useState(mentorTools[0].id);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  
  // Idea Generator Form State
  const [generatorTopic, setGeneratorTopic] = useState('');
  const [generatorAudience, setGeneratorAudience] = useState('');
  const [generatorConstraints, setGeneratorConstraints] = useState('');

  // Real limitations stored in localStorage
  const [limits, setLimits] = useState<Record<string, { used: number, total: number | 'Unlimited', isPro?: boolean }>>(() => {
    const today = new Date().toISOString().split('T')[0];
    const storedDate = localStorage.getItem('blooplabs-mentor-limits-date');
    const stored = localStorage.getItem('blooplabs-mentor-limits');
    
    if (stored && storedDate === today) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse stored mentor limits", e);
      }
    }
    
    // Reset limits if it's a new day or no data exists
    localStorage.setItem('blooplabs-mentor-limits-date', today);
    const initialLimits = {
      'idea-generator': { used: 0, total: 5 },
      'idea': { used: 0, total: 10 },
      'research': { used: 0, total: 'Unlimited', isPro: true },
      'pitch-readiness': { used: 0, total: 'Unlimited', isPro: true }
    };
    localStorage.setItem('blooplabs-mentor-limits', JSON.stringify(initialLimits));
    return initialLimits;
  });

  const updateUsage = (toolId: string) => {
    setLimits(prev => {
      const newLimits = {
        ...prev,
        [toolId]: { ...prev[toolId], used: prev[toolId].used + 1 }
      };
      localStorage.setItem('blooplabs-mentor-limits', JSON.stringify(newLimits));
      return newLimits;
    });
  };

  const activeToolConfig = mentorTools.find(t => t.id === activeTool)!;
  const currentLimit = limits[activeTool];
  const isLimitReached = currentLimit.total !== 'Unlimited' && currentLimit.used >= currentLimit.total;
  const isLocked = currentLimit.isPro;

  const handleAsk = async () => {
    const isGenerator = activeTool === 'idea-generator';
    const isInputEmpty = !isGenerator && !input.trim();
    
    if (isInputEmpty || isLimitReached || isLocked) return;
    setLoading(true);
    
    // Deduct from limit
    if (currentLimit.total !== 'Unlimited') {
      updateUsage(activeTool);
    }

    try {
      let requestBody;
      if (isGenerator) {
        requestBody = {
          toolId: activeTool,
          input: {
            topic: generatorTopic,
            audience: generatorAudience,
            constraints: generatorConstraints
          }
        };
      } else {
        requestBody = {
          toolId: activeTool,
          input: input
        };
      }

      const res = await fetch('/api/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!res.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await res.json();
      setResponse(data.result);
      if (!isGenerator) {
        setInput('');
      }
    } catch (error) {
      console.error(error);
      setResponse('Sorry, an error occurred while generating the response.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-80 shrink-0 space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight px-2 mb-4">AI Tools</h2>
          <nav className="space-y-2">
            {mentorTools.map(tool => {
              const toolLimit = limits[tool.id];
              const isToolLocked = toolLimit.isPro;
              const isToolEmpty = toolLimit.total !== 'Unlimited' && toolLimit.used >= (toolLimit.total as number);
              
              return (
                <button
                  key={tool.id}
                  onClick={() => { setActiveTool(tool.id); setResponse(''); setInput(''); }}
                  className={`w-full flex items-start justify-between px-3 py-3 rounded-xl text-sm transition-colors ${
                    activeTool === tool.id ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-surface hover:bg-surface-hover text-muted-foreground border border-surface-border'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="pt-0.5">{tool.icon}</div>
                    <div className="text-left">
                      <div className="font-medium">{tool.label}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5 font-normal leading-snug opacity-80">{tool.description}</div>
                    </div>
                  </div>
                  {isToolLocked ? (
                    <Lock size={12} className="opacity-50 shrink-0 mt-1" />
                  ) : isToolEmpty ? (
                    <span className="text-[10px] uppercase tracking-wider text-destructive font-bold shrink-0 mt-1">Limit Reached</span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        <Card className="bg-surface-hover/30 border-none shadow-none">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Today's Usage</h4>
              <span className="text-[10px] text-muted-foreground/70 bg-surface-border/50 px-2 py-0.5 rounded-full">Resets daily</span>
            </div>
            <div className="space-y-3 pt-2">
              {mentorTools.filter(t => !limits[t.id].isPro).map(tool => {
                const l = limits[tool.id];
                const percentage = l.total === 'Unlimited' ? 0 : (l.used / (l.total as number)) * 100;
                return (
                  <div key={tool.id} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-foreground">{tool.label}</span>
                      <span className="text-muted-foreground">{l.used} / {l.total}</span>
                    </div>
                    <div className="w-full bg-surface-border rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${percentage >= 100 ? 'bg-destructive' : 'bg-primary'}`} 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="pt-4 mt-4 border-t border-surface-border space-y-3">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Unlock advanced tools for deeper project help and more usage limits.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 flex flex-col min-h-[600px]">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="border-b border-surface-border bg-surface-hover/30 pb-4">
            <div className="flex items-center gap-2 text-primary">
              {activeToolConfig.icon}
              <CardTitle>{activeToolConfig.label}</CardTitle>
            </div>
            <CardDescription className="text-sm text-muted-foreground">{activeToolConfig.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-6 flex flex-col">
            <div className="flex-1 overflow-y-auto mb-4 space-y-6">
              {response ? (
                Array.isArray(response) ? (
                  <div className="space-y-4">
                    {response.map((idea: any, idx: number) => (
                      <div key={idx} className="bg-surface-hover p-5 rounded-xl text-sm leading-relaxed border border-surface-border animate-in fade-in slide-in-from-bottom-2">
                        <h3 className="font-bold text-base mb-2">{idea.title}</h3>
                        <p className="mb-3">{idea.description}</p>
                        <p className="text-muted-foreground mb-4"><strong>Why it's strong:</strong> {idea.why_strong}</p>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            const newProject = {
                              id: crypto.randomUUID(),
                              createdAt: Date.now(),
                              updatedAt: Date.now(),
                              idea: {
                                title: idea.title,
                                description: idea.description,
                                problemArea: generatorTopic || 'Open',
                                targetAudience: generatorAudience || 'General public',
                                gradeLevel: 'General',
                                category: 'AI Generated',
                              },
                              output: {
                                title: idea.title,
                                problem_statement: '',
                                solution_summary: idea.description,
                                why_it_matters: idea.why_strong,
                                uniqueness: '',
                                feasibility: '',
                                materials: [],
                                steps: [],
                                expected_outcome: '',
                                pitch: '',
                                improvements: []
                              },
                              isDraft: true
                            };
                            saveProject(newProject);
                            alert('Idea saved to drafts!');
                          }}
                        >
                          Save Idea
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-surface-hover p-5 rounded-xl text-sm leading-relaxed border border-surface-border animate-in fade-in slide-in-from-bottom-2">
                    <div className="prose prose-sm dark:prose-invert max-w-none break-words">
                      <Markdown>{response}</Markdown>
                    </div>
                  </div>
                )
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm flex-col gap-4">
                  <div className="w-16 h-16 rounded-full bg-surface-hover flex items-center justify-center">
                    {isLocked ? <Lock size={32} className="opacity-20" /> : <BrainCircuit size={32} className="opacity-20" />}
                  </div>
                  {isLocked ? (
                    <p className="max-w-xs text-center">Unlock this tool with Pro.</p>
                  ) : isLimitReached ? (
                    <p className="text-destructive max-w-xs text-center">Daily limit reached. Try again tomorrow or upgrade to Pro.</p>
                  ) : (
                    <p>Describe your idea, paste notes, or ask a question to begin.</p>
                  )}
                </div>
              )}
            </div>
            
            <div className="relative mt-auto">
              {isLocked || isLimitReached ? (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-xl border border-surface-border">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Lock size={16} /> 
                    {isLocked ? "Pro Feature" : "Limit Reached"}
                  </div>
                </div>
              ) : null}
              
              {activeTool === 'idea-generator' ? (
                <div className="bg-surface-hover/30 border border-surface-border p-4 rounded-xl space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Field of Interest or Problem</Label>
                    <Input 
                      placeholder="e.g. Climate change, accessibility, IoT..." 
                      value={generatorTopic}
                      onChange={e => setGeneratorTopic(e.target.value)}
                      className="bg-background"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Target Audience</Label>
                      <Input 
                        placeholder="e.g. Students, elderly..." 
                        value={generatorAudience}
                        onChange={e => setGeneratorAudience(e.target.value)}
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Constraints</Label>
                      <Input 
                        placeholder="e.g. Low cost, mobile app..." 
                        value={generatorConstraints}
                        onChange={e => setGeneratorConstraints(e.target.value)}
                        className="bg-background"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button onClick={handleAsk} disabled={loading || (!generatorTopic && !generatorAudience)} className="w-full sm:w-auto shadow-md">
                      {loading ? <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" /> : <Lightbulb size={16} className="mr-2" />}
                      Generate Ideas
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Select a saved project to improve (Optional)</Label>
                    <select 
                      className="bg-background border border-surface-border text-sm rounded-lg px-3 py-2 w-full focus:outline-none focus:border-primary"
                      onChange={(e) => {
                        const proj = projects.find(p => p.id === e.target.value);
                        if (proj) {
                          setInput(proj.output.solution_summary || proj.idea.description);
                        }
                      }}
                      disabled={loading || isLocked || isLimitReached}
                    >
                      <option value="">-- Choose a project --</option>
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.output.title || p.idea.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="relative">
                    <Textarea
                      placeholder={`Ask the ${activeToolConfig.label}...`}
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      className="min-h-[120px] resize-none pr-12 pb-12 rounded-xl bg-surface-hover/30 border-surface-border focus:bg-surface"
                      disabled={loading || isLocked || isLimitReached}
                    />
                    <div className="absolute bottom-3 right-3 flex items-center justify-end z-20">
                      <Button size="sm" className="rounded-full w-10 h-10 p-0 shadow-md" onClick={handleAsk} disabled={loading || !input.trim() || isLocked || isLimitReached}>
                        {loading ? <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" /> : <Send size={16} />}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
