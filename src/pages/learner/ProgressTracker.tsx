import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { mockProgress } from '../../mockData';
import { Target, Award, TrendingUp } from 'lucide-react';

export const ProgressTracker = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Progress Tracker</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-4 rounded-full bg-blue-100 text-blue-600">
              <Target size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Lessons Completed</p>
              <h3 className="text-2xl font-bold text-gray-900">{mockProgress.completedLessons} / {mockProgress.totalLessons}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-4 rounded-full bg-green-100 text-green-600">
              <Award size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Accuracy Rate</p>
              <h3 className="text-2xl font-bold text-gray-900">{mockProgress.accuracyRate}%</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-4 rounded-full bg-orange-100 text-orange-600">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Learning Streak</p>
              <h3 className="text-2xl font-bold text-gray-900">5 Days</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quiz History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockProgress.quizScores.map((quiz, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                    Q
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Grammar Basics Quiz</p>
                    <p className="text-sm text-gray-500">Completed 2 days ago</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {quiz.score} / {quiz.maxScore}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{(quiz.score / quiz.maxScore) * 100}%</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
