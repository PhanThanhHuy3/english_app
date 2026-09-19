import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Users, BookOpen, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ManagerDashboard = () => {
  // In a real app, these would be fetched from an API
  const metrics = [
    { title: 'Total Active Learners', value: '1,234', icon: Users, color: 'text-blue-500' },
    { title: 'Lessons Completed', value: '8,542', icon: BookOpen, color: 'text-green-500' },
    { title: 'Avg. Accuracy Rate', value: '78%', icon: Activity, color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6 flex items-center space-x-4">
                <div className={`p-4 rounded-full bg-slate-100 ${metric.color}`}>
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">{metric.title}</p>
                  <h3 className="text-2xl font-bold text-slate-900">{metric.value}</h3>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                    L
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Learner {i} completed Grammar Quiz B1</p>
                    <p className="text-xs text-slate-500">{i * 2} hours ago</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-green-600">Score: 90%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
