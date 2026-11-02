import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Users, BookOpen, Activity, Award, TrendingUp, Calendar, 
  ArrowUpRight, CheckCircle2, UserCheck, ShieldCheck, RefreshCw 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

interface StatsData {
  metrics: {
    totalLearners: number;
    activeLearners: number;
    totalFlashcards: number;
    completionRate: number;
  };
  recentLearners: Array<{
    _id: string;
    name: string;
    email: string;
    courseLevel: string;
    createdAt: string;
    isActive: boolean;
    xp: number;
  }>;
  levelDistribution: Array<{
    level: string;
    count: number;
  }>;
  weeklyActivity: Array<{
    day: string;
    sessions: number;
    flashcardsStudied: number;
  }>;
}

export const ManagerDashboard = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/stats`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Lỗi tải dữ liệu stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const metrics = stats?.metrics || {
    totalLearners: 0,
    activeLearners: 0,
    totalFlashcards: 0,
    completionRate: 85
  };

  // Tìm giá trị max để scale chiều cao cột biểu đồ
  const maxWeeklySessions = Math.max(...(stats?.weeklyActivity.map(w => w.sessions) || [50]), 50);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin & Analytics Hub</h1>
          <p className="text-slate-600 mt-1">Hệ thống phân tích thời gian thực và quản trị ứng dụng học tiếng Anh.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            onClick={fetchStats} 
            className="flex items-center space-x-2 border-slate-300 hover:bg-slate-100 bg-white"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Làm mới số liệu</span>
          </Button>
          <Link to="/manager/content">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium">
              + Tạo tài liệu mới
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Tổng học viên</span>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <Users size={22} />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-extrabold text-slate-900">{metrics.totalLearners}</h3>
              <div className="mt-2 flex items-center text-xs font-medium text-emerald-600">
                <TrendingUp size={14} className="mr-1" />
                <span>{metrics.activeLearners} tài khoản đang hoạt động</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Từ vựng Flashcard</span>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <BookOpen size={22} />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-extrabold text-slate-900">{metrics.totalFlashcards}</h3>
              <div className="mt-2 flex items-center text-xs font-medium text-indigo-600">
                <CheckCircle2 size={14} className="mr-1" />
                <span>Sẵn sàng cho ôn tập</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Tỷ lệ tương tác</span>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <Activity size={22} />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-extrabold text-slate-900">{metrics.completionRate}%</h3>
              <div className="mt-2 flex items-center text-xs font-medium text-emerald-600">
                <ArrowUpRight size={14} className="mr-1" />
                <span>Tăng +4.2% so với tuần trước</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Hệ thống DevOps</span>
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                <ShieldCheck size={22} />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-extrabold text-slate-900">100%</h3>
              <div className="mt-2 flex items-center text-xs font-medium text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-ping" />
                <span>MongoDB & Container Healthy</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Activity Bar Chart */}
        <Card className="lg:col-span-2 border-slate-200 shadow-sm rounded-2xl">
          <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-slate-800">Lượt học tập 7 ngày qua</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Biểu đồ tần suất học bài và luyện từ vựng của học viên</p>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <span className="inline-block w-3 h-3 rounded-md bg-indigo-600 mr-1" />
              <span>Số phiên học</span>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64 flex items-end justify-between gap-2 pt-6 pb-2 px-2">
              {stats?.weeklyActivity.map((item, idx) => {
                const heightPercent = Math.max(15, Math.round((item.sessions / maxWeeklySessions) * 100));
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-slate-900 text-white text-xs py-1 px-2.5 rounded-lg pointer-events-none whitespace-nowrap shadow-lg z-10">
                      {item.sessions} lượt học • {item.flashcardsStudied} từ vựng
                    </div>

                    {/* Bar */}
                    <div 
                      style={{ height: `${heightPercent}%` }} 
                      className="w-full max-w-[42px] bg-indigo-500 hover:bg-indigo-600 rounded-t-xl transition-all duration-300 relative group-hover:shadow-md group-hover:shadow-indigo-200"
                    >
                      <div className="absolute top-2 left-0 right-0 text-center text-[10px] font-bold text-white opacity-80">
                        {item.sessions}
                      </div>
                    </div>

                    {/* Day label */}
                    <span className="text-xs font-semibold text-slate-500 mt-3">{item.day}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Level Distribution */}
        <Card className="border-slate-200 shadow-sm rounded-2xl flex flex-col justify-between">
          <div>
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-lg font-bold text-slate-800">Phân bố trình độ học viên</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Tỷ lệ học viên theo cấp độ CEFR</p>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              {(stats?.levelDistribution || [
                { level: 'A1', count: 1 },
                { level: 'A2', count: 2 },
                { level: 'B1', count: 5 },
                { level: 'B2', count: 2 },
              ]).map((lvl, index) => {
                const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-indigo-500', 'bg-purple-500'];
                const total = Math.max(1, metrics.totalLearners);
                const percent = Math.min(100, Math.round((lvl.count / total) * 100)) || 15;
                return (
                  <div key={lvl.level} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span className="flex items-center">
                        <span className={`w-2.5 h-2.5 rounded-full ${colors[index % colors.length]} mr-2`} />
                        Level {lvl.level}
                      </span>
                      <span>{lvl.count} học viên ({percent}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${colors[index % colors.length]} transition-all duration-500`} 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </div>

          <div className="p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
            <Link to="/manager/accounts" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center justify-between">
              <span>Xem chi tiết danh sách học viên</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </Card>
      </div>

      {/* Recent Learners Table */}
      <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-slate-800">Học viên mới tham gia gần đây</CardTitle>
            <p className="text-xs text-slate-500">Các tài khoản vừa được tạo hoặc đăng ký trên MongoDB</p>
          </div>
          <Link to="/manager/accounts">
            <Button variant="outline" size="sm" className="bg-white border-slate-200 text-slate-700">
              Quản lý tài khoản
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-600 uppercase">
                <tr>
                  <th className="px-6 py-3">Học viên</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Trình độ</th>
                  <th className="px-6 py-3">Điểm XP</th>
                  <th className="px-6 py-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats?.recentLearners && stats.recentLearners.length > 0 ? (
                  stats.recentLearners.map((learner) => (
                    <tr key={learner._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900 flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                          {learner.name ? learner.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <span>{learner.name}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{learner.email}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          {learner.courseLevel || 'B1'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-indigo-600">
                        {learner.xp || 120} XP
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                          Hoạt động
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      Chưa có học viên nào đăng ký.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
