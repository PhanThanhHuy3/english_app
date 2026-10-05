import React from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Crown, Medal } from 'lucide-react';

const mockLeaderboard = [
  { id: 1, name: 'Alex Johnson', score: 2540, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', streak: 12 },
  { id: 2, name: 'Maria Garcia', score: 2310, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria', streak: 8 },
  { id: 3, name: 'You (Huy Phan)', score: 2150, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Huy', streak: 5, isCurrentUser: true },
  { id: 4, name: 'David Smith', score: 1980, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', streak: 3 },
  { id: 5, name: 'Emma Wilson', score: 1840, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma', streak: 4 },
];

export const Leaderboard = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 text-amber-500 rounded-full mb-2 shadow-inner">
          <Crown size={40} />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Global Leaderboard</h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">Compete with learners worldwide. Earn XP by completing lessons, mastering vocabulary, and passing quizzes!</p>
      </div>

      <Card className="border-0 shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
        <div className="bg-indigo-600 px-8 py-6 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">Top Learners This Week</h2>
          <span className="bg-indigo-500/50 px-4 py-1.5 rounded-full text-sm font-semibold">Ends in 2 days</span>
        </div>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {mockLeaderboard.map((user, index) => (
              <div 
                key={user.id} 
                className={`flex items-center p-6 transition-colors hover:bg-slate-50 ${user.isCurrentUser ? 'bg-indigo-50/50' : ''}`}
              >
                {/* Rank */}
                <div className="w-12 font-bold text-xl text-center">
                  {index === 0 ? <Medal className="text-yellow-500 mx-auto" size={32} /> : 
                   index === 1 ? <Medal className="text-slate-400 mx-auto" size={32} /> : 
                   index === 2 ? <Medal className="text-amber-700 mx-auto" size={32} /> : 
                   <span className="text-slate-400">#{index + 1}</span>}
                </div>
                
                {/* Avatar */}
                <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-full bg-slate-100 ml-4 mr-6 border-2 border-white shadow-sm" />
                
                {/* Name */}
                <div className="flex-1">
                  <h3 className={`text-lg font-bold ${user.isCurrentUser ? 'text-indigo-700' : 'text-slate-800'}`}>
                    {user.name}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm font-medium text-orange-500 flex items-center">
                      <span className="mr-1">🔥</span> {user.streak} day streak
                    </span>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <div className="text-2xl font-black text-indigo-600">{user.score}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">XP Points</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
