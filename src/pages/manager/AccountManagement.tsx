import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { User, CourseLevel } from '../../types';
import { 
  Search, UserPlus, Trash2, CheckCircle, XCircle, 
  X, Shield, Mail, Award, Filter, RefreshCw
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export const AccountManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  // Modal Provision Account
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newLevel, setNewLevel] = useState<CourseLevel>('B1');
  const [createError, setCreateError] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Lỗi khi tải danh sách users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    setCreateLoading(true);

    try {
      const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          password: newPassword,
          courseLevel: newLevel,
          role: 'learner'
        })
      });

      const data = await res.json();
      if (res.ok) {
        setIsModalOpen(false);
        setNewName('');
        setNewEmail('');
        setNewPassword('');
        fetchUsers();
      } else {
        setCreateError(data.message || 'Lỗi khi tạo tài khoản');
      }
    } catch (err) {
      setCreateError('Không thể kết nối đến máy chủ');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleToggleStatus = async (id?: string) => {
    if (!id) return;
    try {
      const res = await fetch(`${API_URL}/users/${id}/toggle-status`, {
        method: 'PATCH'
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(users.map(u => (u._id === id || u.id === id) ? { ...u, isActive: data.isActive } : u));
      }
    } catch (err) {
      console.error('Lỗi cập nhật trạng thái:', err);
    }
  };

  const handleDeleteUser = async (id?: string, name?: string) => {
    if (!id) return;
    if (!window.confirm(`Bạn có chắc muốn xóa tài khoản học viên "${name}" không?`)) return;

    try {
      const res = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setUsers(users.filter(u => u._id !== id && u.id !== id));
      }
    } catch (err) {
      console.error('Lỗi xóa user:', err);
    }
  };

  const filteredUsers = users.filter(u => {
    const nameMatch = (u.name || u.fullName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const emailMatch = u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const levelMatch = selectedLevel === 'ALL' || u.courseLevel === selectedLevel;
    return (nameMatch || emailMatch) && levelMatch;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Account Management</h1>
          <p className="text-slate-600 mt-1">Cấp phát, quản lý phân quyền và trạng thái học viên trên MongoDB.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            onClick={fetchUsers}
            className="flex items-center space-x-2 border-slate-300 hover:bg-slate-100 bg-white"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Tải lại</span>
          </Button>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 text-white font-semibold rounded-xl px-5 py-2.5"
          >
            <UserPlus size={18} />
            <span>Cấp tài khoản mới</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-slate-200 shadow-sm rounded-2xl">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Tìm theo tên học viên hoặc địa chỉ email..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Filter size={16} className="text-slate-400" />
            <span className="text-xs font-semibold text-slate-600">Level:</span>
            {['ALL', 'A1', 'A2', 'B1', 'B2'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                  selectedLevel === lvl 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold text-slate-800">
            Danh sách tài khoản ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-600 uppercase bg-slate-50">
                <tr>
                  <th className="px-6 py-3.5">Học viên</th>
                  <th className="px-6 py-3.5">Email</th>
                  <th className="px-6 py-3.5">Vai trò</th>
                  <th className="px-6 py-3.5">Trình độ</th>
                  <th className="px-6 py-3.5">Trạng thái</th>
                  <th className="px-6 py-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => {
                  const userId = user._id || user.id;
                  const userName = user.name || user.fullName || 'User';
                  return (
                    <tr key={userId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900 flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm shadow-xs">
                          {userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{userName}</p>
                          <p className="text-[11px] text-slate-400">ID: {userId?.slice(-6)}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          user.role === 'manager' 
                            ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {user.role === 'manager' ? 'Admin / Giảng viên' : 'Học viên'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-bold">
                          {user.courseLevel || 'B1'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(userId)}
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                            user.isActive !== false
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                          title="Bấm để đổi trạng thái"
                        >
                          {user.isActive !== false ? (
                            <>
                              <CheckCircle size={12} className="mr-1" /> Đang hoạt động
                            </>
                          ) : (
                            <>
                              <XCircle size={12} className="mr-1" /> Đã vô hiệu hóa
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {user.role !== 'manager' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteUser(userId, userName)}
                            className="text-red-600 border-red-200 hover:bg-red-50 p-2"
                            title="Xóa tài khoản"
                          >
                            <Trash2 size={16} />
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      Không tìm thấy tài khoản nào phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal Cấp Tài Khoản Mới */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-600">
                  <UserPlus size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Cấp tài khoản học viên mới</h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              {createError && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
                  {createError}
                </div>
              )}

              <Input
                label="Họ và tên học viên *"
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn A"
                required
              />

              <Input
                label="Email đăng nhập *"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="nguyenvana@gmail.com"
                required
              />

              <Input
                label="Mật khẩu khởi tạo *"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                required
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Trình độ khởi điểm
                </label>
                <select
                  value={newLevel}
                  onChange={(e) => setNewLevel(e.target.value as CourseLevel)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="A1">A1 - Mới bắt đầu (Beginner)</option>
                  <option value="A2">A2 - Sơ cấp (Elementary)</option>
                  <option value="B1">B1 - Trung cấp (Intermediate)</option>
                  <option value="B2">B2 - Trung cao cấp (Upper Intermediate)</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsModalOpen(false)}
                  disabled={createLoading}
                >
                  Hủy
                </Button>
                <Button 
                  type="submit" 
                  disabled={createLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  {createLoading ? 'Đang tạo...' : 'Tạo tài khoản'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
