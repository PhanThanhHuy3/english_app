import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Plus, BookOpen, Layers, Edit2, Trash2, CheckCircle2 } from 'lucide-react';

export const ContentManager = () => {
  const [activeTab, setActiveTab] = useState<'vocabulary' | 'grammar'>('vocabulary');
  
  // Local state for demonstration purposes
  const [vocabList, setVocabList] = useState([
    { id: 1, term: 'Ubiquitous', definition: 'Present, appearing, or found everywhere.', example: 'His ubiquitous influence was felt by all the family.' },
    { id: 2, term: 'Ephemeral', definition: 'Lasting for a very short time.', example: 'Fashions are ephemeral.' },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newTerm, setNewTerm] = useState('');
  const [newDef, setNewDef] = useState('');
  const [newExample, setNewExample] = useState('');

  const handleAddVocab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTerm || !newDef) return;
    
    setVocabList([...vocabList, { 
      id: Date.now(), 
      term: newTerm, 
      definition: newDef, 
      example: newExample 
    }]);
    
    setNewTerm('');
    setNewDef('');
    setNewExample('');
    setIsAdding(false);
  };

  const handleDelete = (id: number) => {
    setVocabList(vocabList.filter(v => v.id !== id));
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Content Studio</h1>
          <p className="text-slate-500 mt-1">Create and manage learning materials for your students.</p>
        </div>
        <Button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 rounded-xl px-6 py-4"
        >
          <Plus size={20} />
          <span className="font-semibold text-lg">{isAdding ? 'Cancel' : 'Create New Module'}</span>
        </Button>
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
          <span>Vocabulary Lists</span>
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

      {/* Add Form */}
      {isAdding && activeTab === 'vocabulary' && (
        <Card className="border-2 border-indigo-100 shadow-xl shadow-indigo-50/50 rounded-2xl overflow-hidden">
          <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
            <h3 className="font-bold text-indigo-900 flex items-center"><Plus size={18} className="mr-2"/> Add New Flashcard</h3>
          </div>
          <CardContent className="p-6">
            <form onSubmit={handleAddVocab} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="English Term"
                  type="text"
                  value={newTerm}
                  onChange={(e) => setNewTerm(e.target.value)}
                  placeholder="e.g. Ubiquitous"
                  required
                />
                <Input
                  label="Definition / Translation"
                  type="text"
                  value={newDef}
                  onChange={(e) => setNewDef(e.target.value)}
                  placeholder="e.g. Present everywhere"
                  required
                />
              </div>
              <Input
                label="Example Sentence"
                type="text"
                value={newExample}
                onChange={(e) => setNewExample(e.target.value)}
                placeholder="e.g. Smartphones have become ubiquitous in our society."
              />
              <div className="pt-2 flex justify-end">
                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold px-8">
                  <CheckCircle2 size={18} className="mr-2" /> Save to Database
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Content List */}
      <Card className="border-slate-200 shadow-sm rounded-2xl">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
          <CardTitle className="text-lg text-slate-700">
            {activeTab === 'vocabulary' ? 'Published Flashcards' : 'Published Quizzes'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {activeTab === 'vocabulary' ? (
            <div className="divide-y divide-slate-100">
              {vocabList.map((item) => (
                <div key={item.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-xl font-bold text-indigo-900">{item.term}</h4>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">Active</span>
                    </div>
                    <p className="text-slate-700 font-medium">{item.definition}</p>
                    {item.example && <p className="text-slate-500 italic text-sm">"{item.example}"</p>}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" className="text-slate-600 border-slate-200 hover:bg-slate-100">
                      <Edit2 size={16} />
                    </Button>
                    <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleDelete(item.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
              {vocabList.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  <BookOpen className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                  <p className="text-lg font-medium">No vocabulary cards found.</p>
                  <p className="text-sm">Click "Create New Module" to add some.</p>
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
