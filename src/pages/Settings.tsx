import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { User, Bell, Shield, Key, CreditCard, Globe, Link as LinkIcon, Palette, Loader2 } from 'lucide-react';
import { useTheme } from '../components/ThemeProvider';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile } from 'firebase/auth';

export function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');

  const handleUpdateProfile = async () => {
    if (!user) return;
    setIsUpdating(true);
    setUpdateMessage('');
    try {
      await updateProfile(user, { displayName });
      setUpdateMessage('Profile updated successfully!');
    } catch (error: any) {
      setUpdateMessage(error.message || 'Failed to update profile.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Account Settings</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0 space-y-1">
          <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${activeTab === 'profile' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-surface-hover hover:text-foreground'}`}>
            <User size={16} /> Profile
          </button>
          <button onClick={() => setActiveTab('account')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${activeTab === 'account' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-surface-hover hover:text-foreground'}`}>
            <Shield size={16} /> Account & Security
          </button>
          <button onClick={() => setActiveTab('appearance')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${activeTab === 'appearance' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-surface-hover hover:text-foreground'}`}>
            <Palette size={16} /> Appearance & Theme
          </button>
        </aside>
        <div className="flex-1 space-y-6">
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>Public Profile</CardTitle>
                <CardDescription>This information will be displayed on your shared project pages.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input 
                    id="name" 
                    value={displayName} 
                    onChange={(e) => setDisplayName(e.target.value)} 
                    placeholder="e.g. Student Innovator" 
                  />
                </div>
                {updateMessage && (
                  <p className={`text-sm ${updateMessage.includes('Failed') ? 'text-red-500' : 'text-success'}`}>
                    {updateMessage}
                  </p>
                )}
                <Button onClick={handleUpdateProfile} disabled={isUpdating}>
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === 'account' && (
            <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
                <CardDescription>Manage your email address and password.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={user?.email || 'No email provided'} disabled />
                  <p className="text-xs text-muted-foreground mt-1">Contact support to change your email address.</p>
                </div>
                <Button variant="outline">Reset Password</Button>
              </CardContent>
            </Card>
          )}

          {activeTab === 'appearance' && (
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how BloopLabs looks on your device.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Theme Preference</Label>
                  <div className="flex gap-4">
                    <Button variant={theme === 'light' ? 'default' : 'outline'} onClick={() => setTheme('light')}>Light</Button>
                    <Button variant={theme === 'dark' ? 'default' : 'outline'} onClick={() => setTheme('dark')}>Dark</Button>
                    <Button variant={theme === 'system' ? 'default' : 'outline'} onClick={() => setTheme('system')}>System</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
