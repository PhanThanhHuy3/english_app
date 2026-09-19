import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { mockProgress } from '../../mockData';
import { BookA, Pencil, Mic } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LearnerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const progressPercent = Math.round((mockProgress.completedLessons / mockProgress.totalLessons) * 100);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.fullName?.split(' ')[0]}!</h1>
          <p className="text-gray-500 mt-1">Ready to continue your English learning journey?</p>
        </div>
        <div className="bg-orange-50 text-orange-600 px-4 py-2 rounded-lg font-medium flex items-center space-x-2 border border-orange-100">
          <span className="text-xl">🔥</span>
          <span>{user?.streak} Day Streak!</span>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="space-y-4 flex-1 w-full pr-0 md:pr-8">
              <h2 className="text-2xl font-bold">Your Course Progress</h2>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-white h-3 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-indigo-100">{mockProgress.completedLessons} of {mockProgress.totalLessons} lessons completed ({progressPercent}%)</p>
            </div>
            <div className="mt-6 md:mt-0">
              <Button onClick={() => navigate('/learner/vocabulary')} className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 rounded-xl font-bold">
                Resume Learning
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/learner/vocabulary')}>
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
              <BookA size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Vocabulary</h3>
            <p className="text-gray-500 text-sm mb-4">Master new words with interactive flashcards.</p>
            <div className="text-blue-600 font-medium text-sm flex items-center">
              Practice now →
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/learner/grammar')}>
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
              <Pencil size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Grammar</h3>
            <p className="text-gray-500 text-sm mb-4">Test your knowledge with quick quizzes.</p>
            <div className="text-green-600 font-medium text-sm flex items-center">
              Practice now →
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/learner/speaking')}>
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
              <Mic size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Speaking Lab</h3>
            <p className="text-gray-500 text-sm mb-4">Improve your pronunciation and fluency.</p>
            <div className="text-purple-600 font-medium text-sm flex items-center">
              Practice now →
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
