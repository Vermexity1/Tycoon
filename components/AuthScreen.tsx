import React, { useState } from 'react';
import { User } from '../types';
import { INITIAL_STATE } from '../constants';
import { Lock, User as UserIcon, LogIn, UserPlus, Loader2 } from 'lucide-react';
import { generateCompanyName } from '../services/geminiService';

interface AuthScreenProps {
  onLogin: (user: User) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const usersStr = localStorage.getItem('neonTycoonUsers');
      const users: User[] = usersStr ? JSON.parse(usersStr) : [];

      if (isLogin) {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
          onLogin(user);
        } else {
          setError('Invalid username or password');
        }
      } else {
        // Register
        if (users.find(u => u.username === username)) {
          setError('Username already taken');
          setIsLoading(false);
          return;
        }

        // Auto-generate company name
        let companyName = `${username} Corp`;
        try {
          const generatedName = await generateCompanyName();
          if (generatedName) companyName = generatedName;
        } catch (err) {
          console.error("Failed to generate name, using default", err);
        }

        const newUser: User = {
          username,
          password,
          gameState: { ...INITIAL_STATE, companyName: companyName }
        };

        const updatedUsers = [...users, newUser];
        localStorage.setItem('neonTycoonUsers', JSON.stringify(updatedUsers));
        onLogin(newUser);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-900/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-900/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-96 bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
            NEON TYCOON
          </h1>
          <p className="text-slate-500 text-sm">Corporate Access Terminal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-400 uppercase">Username</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 text-slate-600" size={16} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:border-blue-500 focus:outline-none transition-colors disabled:opacity-50"
                placeholder="Enter username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-400 uppercase">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-600" size={16} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:border-blue-500 focus:outline-none transition-colors disabled:opacity-50"
                placeholder="Enter password"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-xs p-3 rounded text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
                {isLogin ? 'Sign In' : 'Create Account'}
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => { setError(''); setIsLogin(!isLogin); }}
            disabled={isLoading}
            className="text-slate-400 hover:text-white text-sm transition-colors disabled:opacity-50"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;