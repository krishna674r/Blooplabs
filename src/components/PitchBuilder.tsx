import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { Loader2, Mic, Copy, Check } from 'lucide-react';
import { SavedProject, Pitches } from '../types';
import { useProjects } from '../hooks/useProjects';

export function PitchBuilder({ project }: { project: SavedProject }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { saveProject } = useProjects();
  const [copied30s, setCopied30s] = useState(false);
  const [copied60s, setCopied60s] = useState(false);

  const generatePitches = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project: project.output }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate pitches');
      }

      const pitches: Pitches = await response.json();
      
      const updatedProject = {
        ...project,
        updatedAt: Date.now(),
        pitches
      };
      saveProject(updatedProject);
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating pitches.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, type: '30s' | '60s') => {
    navigator.clipboard.writeText(text);
    if (type === '30s') {
      setCopied30s(true);
      setTimeout(() => setCopied30s(false), 2000);
    } else {
      setCopied60s(true);
      setTimeout(() => setCopied60s(false), 2000);
    }
  };

  return (
    <Card className="mt-8 border-primary/20 shadow-sm">
      <CardHeader className="bg-primary/5 border-b border-primary/10">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Mic className="w-5 h-5 text-primary" />
              Pitch Builder
            </CardTitle>
            <CardDescription className="mt-1">
              Generate engaging 30-second and 1-minute elevator pitches for your project.
            </CardDescription>
          </div>
          {!project.pitches && (
            <Button onClick={generatePitches} disabled={isGenerating} size="sm" className="gap-2">
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mic className="w-4 h-4" />}
              {isGenerating ? 'Generating...' : 'Generate Pitches'}
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 text-red-500 text-sm font-medium">
            {error}
          </div>
        )}

        {project.pitches ? (
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  30-Second Pitch
                </h4>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(project.pitches!.pitch30s, '30s')} className="gap-1.5 h-8 px-2 text-muted-foreground">
                  {copied30s ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied30s ? 'Copied' : 'Copy'}
                </Button>
              </div>
              <div className="p-4 bg-muted rounded-xl border border-surface-border text-sm text-foreground leading-relaxed italic">
                "{project.pitches.pitch30s}"
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  1-Minute Pitch
                </h4>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(project.pitches!.pitch60s, '60s')} className="gap-1.5 h-8 px-2 text-muted-foreground">
                  {copied60s ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied60s ? 'Copied' : 'Copy'}
                </Button>
              </div>
              <div className="p-5 bg-muted rounded-xl border border-surface-border text-sm text-foreground leading-relaxed italic">
                "{project.pitches.pitch60s}"
              </div>
            </div>
            
            <div className="flex justify-end pt-2 border-t border-surface-border">
              <Button variant="outline" onClick={generatePitches} disabled={isGenerating} size="sm" className="gap-2">
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mic className="w-4 h-4" />}
                Regenerate Pitches
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
              <Mic className="w-8 h-8" />
            </div>
            <p className="text-muted-foreground max-w-md mx-auto">
              Ready to present your idea? Let our AI coach help you craft the perfect pitch to captivate your audience in seconds.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
