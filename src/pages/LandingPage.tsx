import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Rocket, Star, Globe } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-sm py-4 px-8 flex justify-between items-center">
        <div className="flex items-center gap-2 text-indigo-700 font-bold text-2xl">
          <BookOpen className="w-8 h-8" />
          <span>EngMastery</span>
        </div>
        <div className="flex gap-4">
          <Link to="/manager/login" className="text-slate-500 hover:text-indigo-600 px-4 py-2 font-medium transition-colors">
            Teacher Login
          </Link>
          <Link to="/learner/login">
            <Button variant="outline" className="border-indigo-600 text-indigo-600 hover:bg-indigo-50">Log In</Button>
          </Link>
          <Link to="/learner/register">
            <Button className="bg-indigo-600 hover:bg-indigo-700">Get Started Free</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
          Master English with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Confidence</span>
        </h1>
        <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto mb-10">
          Interactive lessons, personalized learning paths, and real-time progress tracking to help you achieve fluency faster than ever.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/learner/register">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-lg py-6 px-8 rounded-full shadow-xl shadow-indigo-200">
              Start Learning Now
            </Button>
          </Link>
          <Link to="/learner/login">
            <Button variant="outline" className="text-lg py-6 px-8 rounded-full border-2 border-slate-200 hover:border-indigo-600 hover:bg-slate-50">
              I already have an account
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Why choose EngMastery?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 text-center hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Rocket className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Fast Progression</h3>
              <p className="text-slate-600">Our structured curriculum ensures you learn exactly what you need to level up quickly.</p>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 text-center hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Gamified Learning</h3>
              <p className="text-slate-600">Earn streaks, unlock achievements, and stay motivated every single day.</p>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 text-center hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Real-world Context</h3>
              <p className="text-slate-600">Practice vocabulary and grammar that you can actually use in real-life conversations.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center">
        <p>&copy; 2026 EngMastery. Built with React, Docker, and Jenkins CI/CD.</p>
      </footer>
    </div>
  );
};
