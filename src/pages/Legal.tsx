import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Shield, FileText, Cookie } from 'lucide-react';

export function Legal() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('privacy');

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (['privacy', 'terms', 'cookie'].includes(hash)) {
      setActiveTab(hash);
    }
  }, [location.hash]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`/legal#${tab}`);
  };

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Legal Information</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0 space-y-1">
          <button onClick={() => handleTabChange('privacy')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${activeTab === 'privacy' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-surface-hover hover:text-foreground'}`}>
            <Shield size={16} /> Privacy Policy
          </button>
          <button onClick={() => handleTabChange('terms')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${activeTab === 'terms' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-surface-hover hover:text-foreground'}`}>
            <FileText size={16} /> Terms of Service
          </button>
          <button onClick={() => handleTabChange('cookie')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${activeTab === 'cookie' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-surface-hover hover:text-foreground'}`}>
            <Cookie size={16} /> Cookie Policy
          </button>
        </aside>

        <div className="flex-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === 'privacy' && 'Privacy Policy'}
                {activeTab === 'terms' && 'Terms of Service'}
                {activeTab === 'cookie' && 'Cookie Policy'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              {activeTab === 'privacy' && (
                <>
                  <p>Last updated: July 26, 2026</p>
                  <p>At BloopLabs, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you use our services.</p>
                  <h3 className="text-foreground font-semibold mt-6 mb-2">1. Information We Collect</h3>
                  <p>We collect information you provide directly to us, such as when you create an account, create a project, or contact support. This includes your name, email address, and any content you generate using our AI tools.</p>
                  <h3 className="text-foreground font-semibold mt-6 mb-2">2. How We Use Information</h3>
                  <p>We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to personalize your experience on the BloopLabs platform.</p>
                  <h3 className="text-foreground font-semibold mt-6 mb-2">3. Data Security</h3>
                  <p>We implement appropriate technical and organizational measures to protect the security of your personal information.</p>
                </>
              )}
              {activeTab === 'terms' && (
                <>
                  <p>Last updated: July 26, 2026</p>
                  <p>These Terms of Service govern your use of BloopLabs. By accessing or using our platform, you agree to be bound by these Terms.</p>
                  <h3 className="text-foreground font-semibold mt-6 mb-2">1. Acceptance of Terms</h3>
                  <p>By registering for and/or using the Services in any manner, including but not limited to visiting or browsing the Site, you agree to these Terms of Service.</p>
                  <h3 className="text-foreground font-semibold mt-6 mb-2">2. User Accounts</h3>
                  <p>You must be at least 13 years old to use the Services. You are responsible for safeguarding the password that you use to access the Services.</p>
                  <h3 className="text-foreground font-semibold mt-6 mb-2">3. Acceptable Use</h3>
                  <p>You agree not to use the Services in any way that causes, or may cause, damage to the Services or impairment of the availability or accessibility of the Services.</p>
                </>
              )}
              {activeTab === 'cookie' && (
                <>
                  <p>Last updated: July 26, 2026</p>
                  <p>This Cookie Policy explains how BloopLabs uses cookies and similar technologies to recognize you when you visit our website.</p>
                  <h3 className="text-foreground font-semibold mt-6 mb-2">1. What are cookies?</h3>
                  <p>Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.</p>
                  <h3 className="text-foreground font-semibold mt-6 mb-2">2. Why do we use cookies?</h3>
                  <p>We use first and third party cookies for several reasons. Some cookies are required for technical reasons in order for our Websites to operate, and we refer to these as "essential" or "strictly necessary" cookies.</p>
                  <h3 className="text-foreground font-semibold mt-6 mb-2">3. How can I control cookies?</h3>
                  <p>You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Manager.</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
