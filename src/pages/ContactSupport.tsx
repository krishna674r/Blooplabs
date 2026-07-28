import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Mail, MessageSquare, Send } from 'lucide-react';

export function ContactSupport() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-3">Contact Support</h1>
        <p className="text-muted-foreground text-lg">We're here to help. Send us a message and we'll respond as soon as possible.</p>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Send a Message</CardTitle>
          <CardDescription>Fill out the form below and our team will get back to you.</CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="bg-primary/10 text-primary border border-primary/20 rounded-lg p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Send size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Message Sent!</h3>
              <p className="text-primary/80">Thank you for reaching out. Our support team will respond to your inquiry shortly.</p>
              <Button onClick={() => setSuccess(false)} variant="outline" className="mt-4 border-primary/20 hover:bg-primary/20">
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="name">Name</label>
                  <Input id="name" required placeholder="John Doe" className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="email">Email</label>
                  <Input id="email" type="email" required placeholder="john@example.com" className="bg-background/50" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="subject">Subject</label>
                <Input id="subject" required placeholder="How can we help you?" className="bg-background/50" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="message">Message</label>
                <textarea 
                  id="message" 
                  required 
                  rows={6}
                  className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background/50 focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Please describe your issue in detail..."
                ></textarea>
              </div>

              <Button type="submit" disabled={loading} className="w-full h-11 text-base">
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center mt-10">
        <Card className="bg-surface border-border hover:border-primary/50 transition-colors max-w-sm w-full">
          <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
            <Mail className="w-8 h-8 text-primary" />
            <h3 className="font-semibold">Email Us</h3>
            <p className="text-sm text-muted-foreground">Prefer email? Send your queries directly to our support inbox.</p>
            <a href="mailto:krishna674r@gmail.com" className="text-primary hover:underline text-sm font-medium">krishna674r@gmail.com</a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
