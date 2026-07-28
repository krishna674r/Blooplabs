import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Search, Book, MessageCircle, FileText, Bug, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function HelpCenter() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">How can we help?</h1>
        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input 
            className="w-full pl-10 py-6 text-lg rounded-full bg-surface shadow-sm border-surface-border" 
            placeholder="Search documentation, tutorials, or FAQs..."
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card className="hover:border-primary/50 transition-colors cursor-pointer">
          <CardHeader>
            <Book className="w-8 h-8 text-blue-500 mb-2" />
            <CardTitle>Documentation</CardTitle>
            <CardDescription>Detailed guides on how to use every feature.</CardDescription>
          </CardHeader>
        </Card>
        <Card className="hover:border-primary/50 transition-colors cursor-pointer">
          <CardHeader>
            <FileText className="w-8 h-8 text-green-500 mb-2" />
            <CardTitle>Tutorials</CardTitle>
            <CardDescription>Step-by-step videos and articles for beginners.</CardDescription>
          </CardHeader>
        </Card>
        <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => navigate('/contact')}>
          <CardHeader>
            <MessageCircle className="w-8 h-8 text-purple-500 mb-2" />
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>Get in touch with our team for personalized help.</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="bg-surface/50 rounded-2xl p-8 border border-surface-border">
        <h2 className="text-2xl font-bold mb-6">Feedback & Requests</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" onClick={() => navigate('/contact')}>
            <Bug size={24} className="text-red-500" />
            <span>Report a Bug</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" onClick={() => navigate('/contact')}>
            <Lightbulb size={24} className="text-yellow-500" />
            <span>Request a Feature</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
