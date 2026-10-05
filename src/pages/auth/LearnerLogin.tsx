import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { BookOpen } from 'lucide-react';

export const LearnerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user && user.role === 'learner') navigate('/learner/dashboard');
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password, 'learner');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image/Gradient */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 text-white flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="z-10 text-center max-w-lg">
          <BookOpen className="w-24 h-24 mx-auto mb-8 text-indigo-200" />
          <h1 className="text-4xl font-extrabold mb-4">Master English Today</h1>
          <p className="text-lg text-indigo-100">Join thousands of learners improving their skills daily with our interactive lessons and real-time tracking.</p>
        </div>
        {/* Decorative circles */}
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full border-4 border-white opacity-20"></div>
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white opacity-10"></div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Welcome Back</h2>
            <p className="text-slate-500 mt-2">Sign in to continue your learning journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="student@learner.com"
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
            
            <Button type="submit" className="w-full py-3 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-xl shadow-lg shadow-indigo-200">
              Sign In
            </Button>
            
            <div className="text-center text-sm text-slate-600 mt-6 font-medium">
              New here? <Link to="/learner/register" className="text-indigo-600 hover:text-indigo-800 hover:underline transition-all">Create an account</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
