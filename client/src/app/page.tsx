'use client';

import { useEffect, useState } from 'react';
import { socket } from '../lib/socket';
import { fetchVulnerabilities, generateMockFindings, createRemediationPlan, applyRemediation } from '../lib/api';
import { VulnerabilityList } from '../components/VulnerabilityList';
import { RemediationModal } from '../components/RemediationModal';
import { RiskFeed } from '../components/RiskFeed';
import { SecurityProbe } from '../components/SecurityProbe';
import {
  Scan,
  ShieldCheck,
  LayoutDashboard,
  LogOut,
  Settings as SettingsIcon,
  Bell,
  Cloud,
  Key,
  HelpCircle,
  ArrowRight,
  MessageSquare,
  BarChart3,
  Activity,
  User as UserIcon,
  Search,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Database,
  Cpu
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

type Tab = 'overview' | 'security' | 'feedback' | 'settings';

export default function Dashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [remediatingId, setRemediatingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  // Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) setToken(savedToken);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Login failed');
        return;
      }

      if (data.access_token) {
        setToken(data.access_token);
        localStorage.setItem('token', data.access_token);
        toast.success('Privacy secured!', { description: 'Welcome back to DataGuard.' });
      }
    } catch (err) {
      toast.error('Connection error', { description: 'Is the backend online?' });
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    toast.info('Session ended');
  };

  const loadData = async () => {
    if (!token) return;
    try {
      const data = await fetchVulnerabilities(token);
      setVulnerabilities(data);
    } catch (err: any) {
      console.error(err);
      if (err.message.includes('401')) {
        handleLogout();
      }
    }
  };

  useEffect(() => {
    if (token) {
      loadData();
      socket.connect();
      socket.on('vulnerabilities.updated', loadData);
    }
    return () => {
      socket.off('vulnerabilities.updated');
    };
  }, [token]);

  const runScan = async () => {
    if (!token) return;
    setLoading(true);
    try {
      await toast.promise(generateMockFindings(token), {
        loading: 'Scanning infrastructure...',
        success: 'Scan complete. Findings updated.',
        error: 'Scan failed to complete.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemediate = async (id: string) => {
    setRemediatingId(id);
    try {
      const plan = await createRemediationPlan(id, token!);
      setCurrentPlan(plan);
      setModalOpen(true);
    } catch (err) {
      toast.error('REMEDIATION ERROR', { description: 'Failed to generate fix with AI.' });
    } finally {
      setRemediatingId(null);
    }
  };

  const handleApplyFix = async () => {
    if (!currentPlan) return;
    setIsApplying(true);
    try {
      await applyRemediation(currentPlan.vulnerabilityId, token!);
      setModalOpen(false);
      toast.success('Fix applied!', { description: 'Terrform plan executed successfully.' });
    } catch (err) {
      toast.error('APPLICATION FAILED');
    } finally {
      setIsApplying(false);
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 p-4">
        <div className="w-full max-w-md p-8 bg-white border border-zinc-200 rounded-3xl shadow-2xl dark:bg-zinc-900 dark:border-zinc-800 backdrop-blur-xl">
          <div className="flex flex-col items-center mb-8">
            <div className="p-4 bg-black/[0.03] dark:bg-white/[0.03] rounded-2xl mb-4 border border-zinc-200 dark:border-zinc-800">
              <ShieldCheck className="w-10 h-10 text-black dark:text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">DataGuard.ai</h1>
            <p className="text-zinc-500 dark:text-zinc-400">Autonomous CSPM Platform</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                placeholder="agent@dataguard.ai"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 text-white bg-black rounded-xl hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-bold text-lg transition-all active:scale-[0.98]"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8 text-center space-y-2">
            <p className="text-sm text-zinc-500">
              Don't have an account?{' '}
              <Link href="/signup" className="font-bold text-black dark:text-white hover:underline decoration-2">
                Join the platform
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col sticky top-0 h-screen z-50">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <ShieldCheck className="w-8 h-8 text-black dark:text-white" />
            <span className="font-ex-bold text-xl tracking-tighter">DATAGUARD.AI</span>
          </div>

          <nav className="space-y-1">
            <NavItem
              icon={<LayoutDashboard className="w-5 h-5" />}
              label="Overview"
              active={activeTab === 'overview'}
              onClick={() => setActiveTab('overview')}
            />
            <NavItem
              icon={<Search className="w-5 h-5" />}
              label="Security Scanner"
              active={activeTab === 'security'}
              onClick={() => setActiveTab('security')}
            />
            <NavItem
              icon={<MessageSquare className="w-5 h-5" />}
              label="Feedback Insights"
              active={activeTab === 'feedback'}
              onClick={() => setActiveTab('feedback')}
            />
            <NavItem
              icon={<SettingsIcon className="w-5 h-5" />}
              label="Settings"
              active={activeTab === 'settings'}
              onClick={() => setActiveTab('settings')}
            />
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              <UserIcon className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate">Security Analyst</p>
              <p className="text-[10px] text-zinc-500 truncate">agent@dataguard.ai</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/50 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-40">
          <h2 className="text-lg font-bold capitalize">{activeTab}</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">System Operational</span>
            </div>
            <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-zinc-500" />
            </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight">Command Center</h1>
                <p className="text-zinc-500 mt-2">Unified visibility across all autonomous security operations.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<ShieldCheck className="text-green-500" />} label="Security Score" value="94/100" trend="+2.4%" />
                <StatCard icon={<AlertTriangle className="text-orange-500" />} label="Open Findings" value={vulnerabilities.length.toString()} trend="-1" />
                <StatCard icon={<MessageSquare className="text-blue-500" />} label="Feedback Rx" value="24" trend="New" />
                <StatCard icon={<Activity className="text-purple-500" />} label="AI Remediation" value="12" trend="Verified" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <section className="bg-black text-white rounded-3xl p-8 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Globe className="w-48 h-48 rotate-12" />
                    </div>
                    <div className="relative z-10 space-y-4">
                      <h3 className="text-2xl font-bold">Launch Security Probe</h3>
                      <p className="text-zinc-400 max-w-md">Run an active heuristic scan across your multi-cloud infrastructure to detect misconfigurations in real-time.</p>
                      <button
                        onClick={() => setActiveTab('security')}
                        className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-zinc-200 transition-all active:scale-95"
                      >
                        Enter Security Lab
                      </button>
                    </div>
                  </section>

                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6">
                    <h3 className="font-bold text-lg mb-6">Recent Vulnerabilities</h3>
                    <VulnerabilityList
                      vulnerabilities={vulnerabilities.slice(0, 3)}
                      onRemediate={handleRemediate}
                      loadingId={remediatingId}
                    />
                  </div>
                </div>

                <aside className="space-y-8">
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-purple-500" />
                      Live Event Stream
                    </h3>
                    <div className="h-[400px]">
                      <RiskFeed />
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <SecurityProbe onComplete={loadData} />

              <div className="space-y-6">
                <header className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">Detailed Findings</h3>
                    <p className="text-zinc-500">Comprehensive list of detected vulnerabilities and AI fixes.</p>
                  </div>
                  <button
                    onClick={runScan}
                    disabled={loading}
                    className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold flex items-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50"
                  >
                    <Scan className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    REFRESH DATABASE
                  </button>
                </header>

                <VulnerabilityList
                  vulnerabilities={vulnerabilities}
                  onRemediate={handleRemediate}
                  loadingId={remediatingId}
                />
              </div>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
              <div className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-20">
                  <MessageSquare className="w-32 h-32 -rotate-12" />
                </div>
                <h2 className="text-3xl font-extrabold mb-4">Feedback Intelligence</h2>
                <p className="text-blue-100 max-w-xl mb-6">Insights collected from the NexGen Form MVP. Use this data to refine security policies based on organizational feedback.</p>
                <Link
                  href="/mvp-form-collector/client/index.html"
                  target="_blank"
                  className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all"
                >
                  Open Collector Form <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-4">
                  <BarChart3 className="w-6 h-6 text-blue-500" />
                  <h4 className="font-bold">Total Transmissions</h4>
                  <p className="text-4xl font-extrabold">1,204</p>
                  <p className="text-xs text-zinc-500 tracking-wider font-bold">LAST 30 DAYS</p>
                </div>
                <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-4">
                  <Activity className="w-6 h-6 text-green-500" />
                  <h4 className="font-bold">Resolution Rate</h4>
                  <p className="text-4xl font-extrabold">98.2%</p>
                  <p className="text-xs text-zinc-500 tracking-wider font-bold">AUTO-RESPONDER ACTIVE</p>
                </div>
                <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-4">
                  <Cpu className="w-6 h-6 text-purple-500" />
                  <h4 className="font-bold">Sentiment Score</h4>
                  <p className="text-4xl font-extrabold">4.8/5</p>
                  <p className="text-xs text-zinc-500 tracking-wider font-bold">AI ANALYSIS ENABLED</p>
                </div>
              </div>

              <div className="bg-zinc-100 dark:bg-zinc-900/50 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-3xl p-12 text-center space-y-4">
                <Database className="w-12 h-12 mx-auto text-zinc-400" />
                <h4 className="font-bold text-xl">Feedback Repository</h4>
                <p className="text-zinc-500 max-w-sm mx-auto">Access the full database of institutional feedback collected via the NexGen MVP system.</p>
                <button className="text-black dark:text-white font-bold hover:underline">View All Submissions</button>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-4xl space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SettingsCard icon={<Cloud />} title="Cloud Integrations" desc="Connect AWS, Azure or GCP accounts." />
                <SettingsCard icon={<Key />} title="API Access" desc="Manage programmable tokens & webhooks." />
                <SettingsCard icon={<Bell />} title="Notifications" desc="Set up Slack or Email security alerts." />
                <SettingsCard icon={<HelpCircle />} title="Support & Ethics" desc="Access documentation & AI policy." />
              </div>
            </div>
          )}
        </div>
      </main>

      <RemediationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        plan={currentPlan}
        onApply={handleApplyFix}
        isApplying={isApplying}
      />
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${active
          ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg shadow-black/10'
          : 'text-zinc-500 hover:text-black dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900'
        }`}
    >
      {icon}
      <span className="font-bold text-sm">{label}</span>
    </button>
  );
}

function StatCard({ icon, label, value, trend }: any) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
          {icon}
        </div>
        <span className={`text-[10px] font-ex-bold px-2 py-0.5 rounded-full ${trend.startsWith('+') ? 'bg-green-100 text-green-700' : trend.startsWith('-') ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
          {trend}
        </span>
      </div>
      <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{label}</p>
      <p className="text-3xl font-extrabold mt-1">{value}</p>
    </div>
  );
}

function SettingsCard({ icon, title, desc }: any) {
  return (
    <div className="p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-4 hover:border-black dark:hover:border-white transition-all group">
      <div className="p-3 bg-zinc-100 dark:bg-zinc-800 w-fit rounded-xl group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-all">
        {icon}
      </div>
      <h3 className="font-bold text-xl">{title}</h3>
      <p className="text-zinc-500 text-sm">{desc}</p>
      <button className="text-sm font-bold pt-2 flex items-center gap-2 hover:gap-3 transition-all">
        Configure <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
