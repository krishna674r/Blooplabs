import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Label } from '../components/ui/Label';

type OnboardingData = {
  fullName: string;
  preferredName: string;
  grade: string;
  school: string;
  location: string;
  
  goals: string[];
  subjects: string[];
  projectTypes: string[];
  
  experience: string;
  builtBefore: string;
  needsGuidance: string;
  
  answerStyle: string;
  mentorStyle: string;
  
  language: string;
  englishLevel: string;
  
  competition: string;
  evaluationType: string;
  
  helpWanted: string;
  reminders: string;
  autoSave: string;
};

const defaultData: OnboardingData = {
  fullName: '', preferredName: '', grade: '', school: '', location: '',
  goals: [], subjects: [], projectTypes: [],
  experience: '', builtBefore: '', needsGuidance: '',
  answerStyle: '', mentorStyle: '',
  language: '', englishLevel: '',
  competition: '', evaluationType: '',
  helpWanted: '', reminders: '', autoSave: ''
};

export function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(defaultData);
  const totalSteps = 7;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const completeOnboarding = () => {
    localStorage.setItem('blooplabs_profile_completed', 'true');
    localStorage.setItem('blooplabs_profile_data', JSON.stringify(data));
    navigate('/dashboard');
  };

  const handleSkip = () => {
    handleNext();
  };

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };
  
  const toggleArrayItem = (field: keyof OnboardingData, item: string) => {
    setData(prev => {
      const arr = prev[field] as string[];
      if (arr.includes(item)) {
        return { ...prev, [field]: arr.filter(i => i !== item) };
      } else {
        return { ...prev, [field]: [...arr, item] };
      }
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Background blobs for premium feel */}
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-indigo-500/10 to-blue-500/10 dark:from-indigo-500/20 dark:to-blue-500/20 blur-[100px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tl from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 blur-[120px] pointer-events-none z-0"></div>

      <div className="w-full max-w-xl z-10">
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-3xl font-bold mb-2">Set up your profile</h1>
          <p className="text-muted-foreground">Help BloopLabs personalize your project ideas, tools, and guidance.</p>
        </div>

        <Card className="bg-surface/50 backdrop-blur-xl border-surface-border shadow-lg animate-in fade-in slide-in-from-bottom-6 duration-700">
          <CardContent className="p-8">
            {/* Progress Bar */}
            <div className="w-full bg-surface-border h-1.5 rounded-full mb-8 overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300 rounded-full"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              ></div>
            </div>

            <div className="min-h-[300px]">
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                  <h2 className="text-xl font-semibold mb-4">1. Basic details</h2>
                  <div className="space-y-2">
                    <Label>What is your full name?</Label>
                    <input type="text" className="w-full bg-surface border border-surface-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary" value={data.fullName} onChange={e => updateData('fullName', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>What should we call you?</Label>
                    <input type="text" className="w-full bg-surface border border-surface-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary" value={data.preferredName} onChange={e => updateData('preferredName', e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Which grade/class are you in?</Label>
                      <select className="w-full bg-surface border border-surface-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary" value={data.grade} onChange={e => updateData('grade', e.target.value)}>
                        <option value="">Select...</option>
                        <option value="middle">Middle School</option>
                        <option value="high">High School</option>
                        <option value="college">College/University</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Which city or country are you from?</Label>
                      <input type="text" className="w-full bg-surface border border-surface-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary" value={data.location} onChange={e => updateData('location', e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Which school do you study in?</Label>
                    <input type="text" className="w-full bg-surface border border-surface-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary" value={data.school} onChange={e => updateData('school', e.target.value)} />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <h2 className="text-xl font-semibold mb-4">2. Interests and goals</h2>
                  
                  <div className="space-y-3">
                    <Label>What are you here for? (Select all that apply)</Label>
                    <div className="flex flex-wrap gap-2">
                      {['Idea generation', 'Project building', 'Research help', 'Competition submission'].map(item => (
                        <button key={item} onClick={() => toggleArrayItem('goals', item)} className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${data.goals.includes(item) ? 'bg-primary text-primary-foreground border-primary' : 'bg-surface border-surface-border text-muted-foreground hover:border-primary/50'}`}>{item}</button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>What subjects or domains interest you most?</Label>
                    <div className="flex flex-wrap gap-2">
                      {['Physics', 'Biology', 'Computer Science', 'Engineering', 'Chemistry', 'Math', 'Design'].map(item => (
                        <button key={item} onClick={() => toggleArrayItem('subjects', item)} className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${data.subjects.includes(item) ? 'bg-primary text-primary-foreground border-primary' : 'bg-surface border-surface-border text-muted-foreground hover:border-primary/50'}`}>{item}</button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>What kind of projects do you usually like?</Label>
                    <div className="flex flex-wrap gap-2">
                      {['Science', 'Technology', 'Environment', 'Health', 'Agriculture', 'Social impact', 'Business'].map(item => (
                        <button key={item} onClick={() => toggleArrayItem('projectTypes', item)} className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${data.projectTypes.includes(item) ? 'bg-primary text-primary-foreground border-primary' : 'bg-surface border-surface-border text-muted-foreground hover:border-primary/50'}`}>{item}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <h2 className="text-xl font-semibold mb-4">3. Experience level</h2>
                  
                  <div className="space-y-3">
                    <Label>How comfortable are you with project work?</Label>
                    <select className="w-full bg-surface border border-surface-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary" value={data.experience} onChange={e => updateData('experience', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <Label>Have you built any project before?</Label>
                    <div className="flex gap-4">
                      {['Yes', 'No'].map(item => (
                        <button key={item} onClick={() => updateData('builtBefore', item)} className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${data.builtBefore === item ? 'bg-primary/10 border-primary text-primary' : 'bg-surface border-surface-border hover:bg-surface-hover'}`}>{item}</button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Do you need step-by-step guidance?</Label>
                    <div className="flex gap-4">
                      {['Yes, please', 'No, I can manage'].map(item => (
                        <button key={item} onClick={() => updateData('needsGuidance', item)} className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${data.needsGuidance === item ? 'bg-primary/10 border-primary text-primary' : 'bg-surface border-surface-border hover:bg-surface-hover'}`}>{item}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <h2 className="text-xl font-semibold mb-4">4. Working style</h2>
                  
                  <div className="space-y-3">
                    <Label>Do you prefer:</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Short answers', 'Detailed answers', 'Simple explanations', 'Technical explanations'].map(item => (
                        <button key={item} onClick={() => updateData('answerStyle', item)} className={`py-2 px-3 text-sm rounded-lg border transition-colors text-left ${data.answerStyle === item ? 'bg-primary/10 border-primary text-primary' : 'bg-surface border-surface-border hover:bg-surface-hover'}`}>{item}</button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Do you want BloopLabs to act more like a:</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Mentor', 'Research assistant', 'Idea generator', 'Project planner'].map(item => (
                        <button key={item} onClick={() => updateData('mentorStyle', item)} className={`py-2 px-3 text-sm rounded-lg border transition-colors text-left ${data.mentorStyle === item ? 'bg-primary/10 border-primary text-primary' : 'bg-surface border-surface-border hover:bg-surface-hover'}`}>{item}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <h2 className="text-xl font-semibold mb-4">5. Language preferences</h2>
                  
                  <div className="space-y-3">
                    <Label>What language do you want to use?</Label>
                    <select className="w-full bg-surface border border-surface-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary" value={data.language} onChange={e => updateData('language', e.target.value)}>
                      <option value="">Select language...</option>
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <Label>Do you want simple English or detailed English?</Label>
                    <div className="flex gap-4">
                      {['Simple', 'Detailed'].map(item => (
                        <button key={item} onClick={() => updateData('englishLevel', item)} className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${data.englishLevel === item ? 'bg-primary/10 border-primary text-primary' : 'bg-surface border-surface-border hover:bg-surface-hover'}`}>{item}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 6 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <h2 className="text-xl font-semibold mb-4">6. Competition profile</h2>
                  
                  <div className="space-y-3">
                    <Label>Are you preparing for any specific competition? (Optional)</Label>
                    <input type="text" placeholder="e.g. Science Fair, Hackathon" className="w-full bg-surface border border-surface-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary" value={data.competition} onChange={e => updateData('competition', e.target.value)} />
                  </div>

                  <div className="space-y-3">
                    <Label>What type of evaluation will you face?</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {['School judge', 'Science fair panel', 'Exhibition', 'Online submission'].map(item => (
                        <button key={item} onClick={() => updateData('evaluationType', item)} className={`py-2 px-3 text-sm rounded-lg border transition-colors text-left ${data.evaluationType === item ? 'bg-primary/10 border-primary text-primary' : 'bg-surface border-surface-border hover:bg-surface-hover'}`}>{item}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 7 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <h2 className="text-xl font-semibold mb-4">7. Preferences</h2>
                  
                  <div className="space-y-3">
                    <Label>What kind of help do you want most?</Label>
                    <input type="text" placeholder="e.g. Brainstorming, Structuring, Writing..." className="w-full bg-surface border border-surface-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary" value={data.helpWanted} onChange={e => updateData('helpWanted', e.target.value)} />
                  </div>

                  <div className="space-y-3">
                    <Label>Do you want reminders and progress tracking?</Label>
                    <div className="flex gap-4">
                      {['Yes', 'No'].map(item => (
                        <button key={item} onClick={() => updateData('reminders', item)} className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${data.reminders === item ? 'bg-primary/10 border-primary text-primary' : 'bg-surface border-surface-border hover:bg-surface-hover'}`}>{item}</button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Do you want your projects saved automatically?</Label>
                    <div className="flex gap-4">
                      {['Yes, auto-save', 'No, I\'ll save manually'].map(item => (
                        <button key={item} onClick={() => updateData('autoSave', item)} className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${data.autoSave === item ? 'bg-primary/10 border-primary text-primary' : 'bg-surface border-surface-border hover:bg-surface-hover'}`}>{item}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>

            <div className="mt-8 pt-6 border-t border-surface-border flex items-center justify-between">
              <Button variant="ghost" onClick={handleBack} disabled={step === 1} className="gap-2 text-muted-foreground">
                <ArrowLeft size={16} /> Back
              </Button>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={handleSkip} className="text-muted-foreground">
                  Skip for now
                </Button>
                <Button onClick={handleNext} className="gap-2">
                  {step === totalSteps ? 'Complete Setup' : 'Continue'} <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
