import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { 
  Plus, BookOpen, Layers, Edit2, Trash2, CheckCircle2, 
  Upload, Download, FileSpreadsheet, Search, AlertCircle, X, HelpCircle
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

interface ParsedCard {
  term: string;
  definition: string;
  example: string;
}

export const ContentManager = () => {
  const [activeTab, setActiveTab] = useState<'vocabulary' | 'grammar'>('vocabulary');
  
  const [vocabList, setVocabList] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  
  // Single card form
  const [newTerm, setNewTerm] = useState('');
  const [newDef, setNewDef] = useState('');
  const [newExample, setNewExample] = useState('');

  // Edit card state & modal
  const [editingCard, setEditingCard] = useState<any | null>(null);
  const [editTerm, setEditTerm] = useState('');
  const [editDef, setEditDef] = useState('');
  const [editExample, setEditExample] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  // CSV Import state
  const [csvText, setCsvText] = useState('');
  const [parsedPreview, setParsedPreview] = useState<ParsedCard[]>([]);
  const [importLoading, setImportLoading] = useState(false);
  const [importStatusMessage, setImportStatusMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lấy dữ liệu từ Backend khi mở trang
  useEffect(() => {
    fetchFlashcards();
  }, []);

  const fetchFlashcards = async () => {
    try {
      const res = await fetch(`${API_URL}/flashcards`);
      const data = await res.json();
      setVocabList(data);
    } catch (err) {
      console.error('Lỗi khi tải flashcards:', err);
    }
  };

  const handleAddVocab = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTerm || !newDef) return;
    
    try {
      const res = await fetch(`${API_URL}/flashcards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ term: newTerm, definition: newDef, example: newExample })
      });
      const newCard = await res.json();
      setVocabList(prev => [newCard, ...prev]);
      
      setNewTerm('');
      setNewDef('');
      setNewExample('');
      setIsAdding(false);
    } catch (err) {
      console.error('Lỗi khi thêm flashcard:', err);
    }
  };

  const openEditModal = (card: any) => {
    setEditingCard(card);
    setEditTerm(card.term || '');
    setEditDef(card.definition || '');
    setEditExample(card.example || '');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCard || !editTerm || !editDef) return;

    setEditLoading(true);
    try {
      const res = await fetch(`${API_URL}/flashcards/${editingCard._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          term: editTerm,
          definition: editDef,
          example: editExample
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setVocabList(prev => prev.map(c => c._id === updated._id ? updated : c));
        setEditingCard(null);
      }
    } catch (err) {
      console.error('Lỗi cập nhật flashcard:', err);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa từ vựng này không?')) return;
    try {
      await fetch(`${API_URL}/flashcards/${id}`, { method: 'DELETE' });
      setVocabList(vocabList.filter(v => v._id !== id));
    } catch (err) {
      console.error('Lỗi khi xóa flashcard:', err);
    }
  };

  // Helper parse CSV text
  const parseCSVString = (text: string): ParsedCard[] => {
    const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
    const cards: ParsedCard[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (i === 0 && (line.toLowerCase().includes('term') || line.toLowerCase().includes('từ vựng'))) {
        continue;
      }

      const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(p => p.trim().replace(/^"|"$/g, ''));
      if (parts.length >= 2 && parts[0] && parts[1]) {
        cards.push({
          term: parts[0],
          definition: parts[1],
          example: parts[2] || ''
        });
      }
    }
    return cards;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvText(content);
      const parsed = parseCSVString(content);
      setParsedPreview(parsed);
    };
    reader.readAsText(file);
  };

  const handleCsvTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setCsvText(val);
    const parsed = parseCSVString(val);
    setParsedPreview(parsed);
  };

  const handleConfirmImport = async () => {
    if (parsedPreview.length === 0) return;
    setImportLoading(true);
    setImportStatusMessage(null);

    try {
      const res = await fetch(`${API_URL}/flashcards/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: parsedPreview })
      });
      const data = await res.json();

      if (res.ok) {
        setImportStatusMessage(`✅ ${data.message}`);
        setTimeout(() => {
          setIsImportModalOpen(false);
          setCsvText('');
          setParsedPreview([]);
          setImportStatusMessage(null);
          fetchFlashcards();
        }, 1200);
      } else {
        setImportStatusMessage(`❌ ${data.message || 'Lỗi khi import'}`);
      }
    } catch (err) {
      console.error(err);
      setImportStatusMessage('❌ Không thể kết nối tới server.');
    } finally {
      setImportLoading(false);
    }
  };

  // Export Flashcards to CSV
  const handleExportCSV = () => {
    if (vocabList.length === 0) {
      alert('Chưa có từ vựng nào để xuất file!');
      return;
    }

    const headers = ['Term', 'Definition', 'Example'];
    const rows = vocabList.map(item => [
      `"${(item.term || '').replace(/"/g, '""')}"`,
      `"${(item.definition || '').replace(/"/g, '""')}"`,
      `"${(item.example || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Flashcards_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredVocab = vocabList.filter(item => 
    (item.term || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.definition || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Content Studio</h1>
          <p className="text-slate-600 mt-1">Create, import, and manage learning materials for your students.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button 
            onClick={handleExportCSV}
            variant="outline"
            className="flex items-center space-x-2 border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl px-4 py-2.5 bg-white"
            title="Xuất toàn bộ từ vựng ra file CSV"
          >
            <Download size={18} />
            <span className="font-semibold text-sm">Export CSV</span>
          </Button>
          
          <Button 
            onClick={() => setIsImportModalOpen(true)}
            variant="outline"
            className="flex items-center space-x-2 border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl px-4 py-2.5"
            title="Nhập hàng loạt từ vựng từ file CSV / Excel"
          >
            <Upload size={18} />
            <span className="font-semibold text-sm">Import CSV / Excel</span>
          </Button>

          <Button 
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 rounded-xl px-5 py-2.5 text-white"
          >
            <Plus size={18} />
            <span className="font-semibold text-sm">{isAdding ? 'Cancel' : 'Add Flashcard'}</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200">
        <button
          className={`pb-4 px-4 font-semibold text-sm transition-colors relative flex items-center space-x-2 ${
            activeTab === 'vocabulary' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
          }`}
          onClick={() => setActiveTab('vocabulary')}
        >
          <Layers size={18} />
          <span>Vocabulary Lists ({vocabList.length})</span>
          {activeTab === 'vocabulary' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 rounded-t-md bg-indigo-600" />
          )}
        </button>
        <button
          className={`pb-4 px-4 font-semibold text-sm transition-colors relative flex items-center space-x-2 ${
            activeTab === 'grammar' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
          }`}
          onClick={() => setActiveTab('grammar')}
        >
          <BookOpen size={18} />
          <span>Grammar Quizzes</span>
          {activeTab === 'grammar' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 rounded-t-md bg-indigo-600" />
          )}
        </button>
      </div>

      {/* Single Add Form */}
      {isAdding && activeTab === 'vocabulary' && (
        <Card className="border-2 border-indigo-200 shadow-xl shadow-indigo-50/50 rounded-2xl overflow-hidden animate-fadeIn">
          <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100 flex justify-between items-center">
            <h3 className="font-bold text-indigo-900 flex items-center">
              <Plus size={18} className="mr-2 text-indigo-600"/> Add New Flashcard
            </h3>
            <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">
              <X size={18} />
            </button>
          </div>
          <CardContent className="p-6">
            <form onSubmit={handleAddVocab} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="English Term *"
                  type="text"
                  value={newTerm}
                  onChange={(e) => setNewTerm(e.target.value)}
                  placeholder="e.g. Ubiquitous"
                  required
                />
                <Input
                  label="Definition / Translation *"
                  type="text"
                  value={newDef}
                  onChange={(e) => setNewDef(e.target.value)}
                  placeholder="e.g. Có mặt ở khắp nơi"
                  required
                />
              </div>
              <Input
                label="Example Sentence"
                type="text"
                value={newExample}
                onChange={(e) => setNewExample(e.target.value)}
                placeholder="e.g. Smartphones have become ubiquitous in our daily lives."
              />
              <div className="pt-2 flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8">
                  <CheckCircle2 size={18} className="mr-2" /> Save to Database
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Edit Flashcard Modal */}
      {editingCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-fadeIn">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-600">
                  <Edit2 size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Chỉnh sửa từ vựng</h3>
                  <p className="text-xs text-slate-500">Cập nhật thuật ngữ, nghĩa tiếng Việt hoặc câu ví dụ</p>
                </div>
              </div>
              <button 
                onClick={() => setEditingCard(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <Input
                label="English Term *"
                type="text"
                value={editTerm}
                onChange={(e) => setEditTerm(e.target.value)}
                required
              />

              <Input
                label="Definition / Translation (Tiếng Việt) *"
                type="text"
                value={editDef}
                onChange={(e) => setEditDef(e.target.value)}
                required
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Example Sentence
                </label>
                <textarea
                  rows={3}
                  value={editExample}
                  onChange={(e) => setEditExample(e.target.value)}
                  className="w-full p-3 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  placeholder="e.g. There is no empirical evidence to support this claim."
                />
              </div>

              <div className="pt-3 flex justify-end space-x-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setEditingCard(null)}
                  disabled={editLoading}
                >
                  Hủy
                </Button>
                <Button 
                  type="submit" 
                  disabled={editLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  {editLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Import CSV */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-600">
                  <FileSpreadsheet size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Import Vocabulary via CSV / Excel</h3>
                  <p className="text-xs text-slate-500">Tải lên file .csv hoặc dán trực tiếp danh sách từ vựng</p>
                </div>
              </div>
              <button 
                onClick={() => setIsImportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* File upload input */}
              <div className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 rounded-xl p-5 text-center bg-indigo-50/30 transition-colors">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept=".csv, text/csv" 
                  onChange={handleFileChange}
                  className="hidden" 
                />
                <Upload className="mx-auto h-8 w-8 text-indigo-500 mb-2" />
                <p className="text-sm font-semibold text-slate-800">
                  Bấm để chọn file <span className="text-indigo-600 font-bold">.CSV</span> từ máy tính
                </p>
                <p className="text-xs text-slate-500 mt-1">Định dạng mỗi dòng: Term, Definition, Example</p>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => fileInputRef.current?.click()} 
                  className="mt-3 bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                >
                  Chọn file từ máy tính
                </Button>
              </div>

              {/* Hoặc paste text */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Hoặc dán nội dung CSV trực tiếp:
                  </label>
                  <span className="text-xs text-slate-400 flex items-center">
                    <HelpCircle size={14} className="mr-1" /> Term, Definition, Example
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={csvText}
                  onChange={handleCsvTextChange}
                  placeholder={`Perseverance, Sự kiên trì bền bỉ, He showed great perseverance.\nEloquent, Lưu loát hùng hồn, She gave an eloquent speech.\nPragmatic, Thực tế thực dụng, We need a pragmatic approach.`}
                  className="w-full p-3 font-mono text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Preview table */}
              {parsedPreview.length > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Xem trước dữ liệu ({parsedPreview.length} từ vựng hợp lệ)
                    </span>
                    <span className="px-2 py-0.5 text-xs font-bold bg-green-100 text-green-700 rounded-full">
                      Sẵn sàng Import
                    </span>
                  </div>
                  <div className="border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-100 text-slate-700 font-semibold sticky top-0">
                        <tr>
                          <th className="px-3 py-2">#</th>
                          <th className="px-3 py-2">Term</th>
                          <th className="px-3 py-2">Definition</th>
                          <th className="px-3 py-2">Example</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {parsedPreview.map((card, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="px-3 py-2 text-slate-400">{idx + 1}</td>
                            <td className="px-3 py-2 font-bold text-indigo-900">{card.term}</td>
                            <td className="px-3 py-2 text-slate-700">{card.definition}</td>
                            <td className="px-3 py-2 text-slate-500 italic truncate max-w-xs">{card.example || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {importStatusMessage && (
                <div className="p-3 rounded-xl bg-slate-100 text-sm font-medium text-slate-800 text-center">
                  {importStatusMessage}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setIsImportModalOpen(false)}
                disabled={importLoading}
              >
                Hủy bỏ
              </Button>
              <Button 
                onClick={handleConfirmImport} 
                disabled={parsedPreview.length === 0 || importLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
              >
                {importLoading ? 'Đang Import...' : `Xác nhận Import (${parsedPreview.length})`}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Content List */}
      <Card className="border-slate-200 shadow-sm rounded-2xl">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 rounded-t-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle className="text-lg text-slate-800 flex items-center">
            {activeTab === 'vocabulary' ? 'Published Flashcards' : 'Published Quizzes'}
            <span className="ml-3 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
              {vocabList.length} items
            </span>
          </CardTitle>

          {activeTab === 'vocabulary' && (
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Tìm kiếm từ vựng hoặc nghĩa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {activeTab === 'vocabulary' ? (
            <div className="divide-y divide-slate-100">
              {filteredVocab.map((item) => (
                <div key={item._id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-xl font-bold text-indigo-900">{item.term}</h4>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">Active</span>
                    </div>
                    <p className="text-slate-700 font-medium">{item.definition}</p>
                    {item.example && <p className="text-slate-500 italic text-sm">"{item.example}"</p>}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      className="text-slate-600 border-slate-200 hover:bg-slate-100" 
                      onClick={() => openEditModal(item)}
                      title="Chỉnh sửa từ vựng"
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button 
                      variant="outline" 
                      className="text-red-600 border-red-200 hover:bg-red-50" 
                      onClick={() => handleDelete(item._id)}
                      title="Xóa từ vựng"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
              {filteredVocab.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  <BookOpen className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                  <p className="text-lg font-medium">Không tìm thấy từ vựng nào.</p>
                  <p className="text-sm">Bấm "Add Flashcard" hoặc "Import CSV" để thêm từ vựng mới.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500">
              <Layers className="mx-auto h-12 w-12 text-slate-300 mb-4" />
              <p className="text-lg font-medium">Grammar module builder is coming soon.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
