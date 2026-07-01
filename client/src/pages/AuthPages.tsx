import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { KeyRound, Mail, User as UserIcon, ArrowRight, ShieldAlert, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/Toast';

export const LoginPage: React.FC = () => {
  const { login, userInfo, error, clearError, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const redirect = (location.state as any)?.from?.pathname || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect, { replace: true });
    }
    return () => {
      clearError();
    };
  }, [userInfo, navigate, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Welcome back!');
    } catch (err) {
      // Handled by AuthContext state
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200/10 bg-white/30 dark:bg-slate-900/30 p-8 shadow-xl backdrop-blur-md flex flex-col gap-6">
        <div className="text-center">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display mb-1">Welcome Back</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Sign in to your Nexus account</p>
        </div>

        {error && (
          <div className="rounded-xl bg-rose-500/15 border border-rose-500/30 p-3.5 flex items-center gap-2 text-rose-500 text-xs font-semibold">
            <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-500 dark:text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white/50 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
              <Link to="/forgot-password" className="text-[10px] text-violet-500 hover:underline">Forgot password?</Link>
            </div>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-500 dark:text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white/50 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-md shadow-violet-600/10 hover:shadow-violet-500/30 transition-all duration-300 flex items-center justify-center gap-1.5"
          >
            {loading ? 'Signing In...' : 'Sign In'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
          Don't have an account?{' '}
          <Link to="/signup" className="text-violet-500 hover:underline font-bold">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export const SignupPage: React.FC = () => {
  const { register, userInfo, error, clearError, loading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
    return () => {
      clearError();
    };
  }, [userInfo, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      toast.success('Registration successful!');
    } catch (err) {
      // Handled by context
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200/10 bg-white/30 dark:bg-slate-900/30 p-8 shadow-xl backdrop-blur-md flex flex-col gap-6">
        <div className="text-center">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display mb-1">Create Account</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Join Nexus Catalog store today</p>
        </div>

        {error && (
          <div className="rounded-xl bg-rose-500/15 border border-rose-500/30 p-3.5 flex items-center gap-2 text-rose-500 text-xs font-semibold">
            <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-500 dark:text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white/50 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-500 dark:text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white/50 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-500 dark:text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white/50 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-md shadow-violet-600/10 hover:shadow-violet-500/35 transition-all duration-300 flex items-center justify-center gap-1.5"
          >
            {loading ? 'Creating...' : 'Register'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-violet-500 hover:underline font-bold">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    toast.success('Reset email has been dispatched');
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200/10 bg-white/30 dark:bg-slate-900/30 p-8 shadow-xl backdrop-blur-md flex flex-col gap-6">
        {submitted ? (
          <div className="text-center flex flex-col items-center gap-4 py-4 animate-slide-in">
            <CheckCircle className="h-14 w-14 text-emerald-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">Check your email</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-[280px]">
              We have dispatched a validation message to <span className="font-semibold text-slate-200">{email}</span> containing instructions to reset password.
            </p>
            <Link to="/login" className="text-xs text-violet-500 hover:underline mt-4 block">Return to Sign In</Link>
          </div>
        ) : (
          <>
            <div className="text-center">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display mb-1">Forgot Password</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Recover your account password</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-500 dark:text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white/50 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-bold shadow-md transition-all duration-300"
              >
                Send Reset Link
              </button>
            </form>

            <Link to="/login" className="text-xs text-slate-500 dark:text-slate-400 hover:underline text-center">Return to login page</Link>
          </>
        )}
      </div>
    </div>
  );
};
