import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, isAuthorizedAdmin } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';

export const AdminLogin: React.FC = () => {
  const { isAuthenticated, isAuthorized } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isAuthenticated && isAuthorized) {
      navigate('/admin');
    }
  }, [isAuthenticated, isAuthorized, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      if (!isAuthorizedAdmin(user.uid)) {
        await signOut(auth);
        setErrorMessage('Access Denied: Your account UID is not authorized to access this Admin Portal.');
        setIsLoading(false);
        return;
      }

      navigate('/admin');
    } catch (err: any) {
      console.error('Firebase Auth Login Error:', err);
      let message = 'Invalid login credentials.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        message = 'Invalid email or password. Please verify your admin credentials in Firebase Auth.';
      } else if (err.code === 'auth/too-many-requests') {
        message = 'Too many failed login attempts. Please wait a few moments and try again.';
      } else if (err.message) {
        message = err.message;
      }
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-slate-800/90 border border-slate-700/80 p-8 sm:p-10 rounded-3xl shadow-2xl backdrop-blur-md">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-brand-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-brand-500/30">
            VP
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Portfolio Admin Portal
          </h2>
          <p className="text-xs text-slate-400">
            Sign in with authorized Firebase Administrator credentials
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Admin Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@vinayakpadole.dev"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <span>Verifying with Firebase...</span>
            ) : (
              <>
                <span>Sign In to Admin</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <a href="/" className="text-xs text-slate-400 hover:text-slate-200">
            ← Back to Public Website
          </a>
        </div>

      </div>
    </div>
  );
};
