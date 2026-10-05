import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { CourseLevel } from '../../types';
import { GraduationCap } from 'lucide-react';

export const LearnerRegister = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [level, setLevel] = useState<CourseLevel>('A1');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register({
      email,
      password,
      fullName,
      role: 'learner',
      courseLevel: level,
      isActive: true,
      streak: 0
    });
    navigate('/learner/login');
  };

  return (
    <div className="min-h-screen flex flex-row-reverse">
      {/* Right side - Image/Gradient */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-bl from-teal-500 to-indigo-600 text-white flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="z-10 text-center max-w-lg">
          <GraduationCap className="w-24 h-24 mx-auto mb-8 text-teal-200" />
          <h1 className="text-4xl font-extrabold mb-4">Start Your Journey</h1>
          <p className="text-lg text-teal-50">Create an account and unlock a world of possibilities with our comprehensive English courses.</p>
        </div>
        {/* Decorative circles */}
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full border-4 border-white opacity-20"></div>
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white opacity-10"></div>
      </div>

      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Create Account</h2>
            <p className="text-slate-500 mt-2">Join us and start learning English</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="John Doe"
            />
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
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Starting Level</label>
              <select
                className="flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                value={level}
                onChange={(e) => setLevel(e.target.value as CourseLevel)}
              >
                <option value="A1">A1 - Beginner (Start here)</option>
                <option value="A2">A2 - Elementary</option>
                <option value="B1">B1 - Intermediate</option>
                <option value="B2">B2 - Upper Intermediate</option>
              </select>
            </div>
            
            <Button type="submit" className="w-full py-3 mt-4 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-xl shadow-lg shadow-indigo-200">
              Register Now
            </Button>
            
            <div className="text-center text-sm text-slate-600 mt-6 font-medium">
              Already have an account? <Link to="/learner/login" className="text-indigo-600 hover:text-indigo-800 hover:underline transition-all">Sign in here</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
