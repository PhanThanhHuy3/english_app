import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Plus, BookOpen, Layers } from 'lucide-react';

export const ContentManager = () => {
  const [activeTab, setActiveTab] = useState<'vocabulary' | 'grammar'>('vocabulary');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Content Manager</h1>
        <Button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700">
          <Plus size={18} />
          <span>Create New Module</span>
        </Button>
      </div>

      <div className="flex space-x-4 border-b border-gray-200">
        <button
          className={`pb-4 px-2 font-medium text-sm transition-colors relative ${
            activeTab === 'vocabulary' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('vocabulary')}
        >
          <div className="flex items-center space-x-2">
            <Layers size={18} />
            <span>Vocabulary Lists</span>
          </div>
          {activeTab === 'vocabulary' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
        <button
          className={`pb-4 px-2 font-medium text-sm transition-colors relative ${
            activeTab === 'grammar' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('grammar')}
        >
          <div className="flex items-center space-x-2">
            <BookOpen size={18} />
            <span>Grammar Quizzes</span>
          </div>
          {activeTab === 'grammar' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{activeTab === 'vocabulary' ? 'Published Vocabulary Lists' : 'Published Grammar Quizzes'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <p>No content available yet.</p>
            <Button variant="outline" className="mt-4">
              Add {activeTab === 'vocabulary' ? 'Vocabulary' : 'Grammar'} Content
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
