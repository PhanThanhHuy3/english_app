import React, { useState } from 'react';
import { mockFlashcards } from '../../mockData';
import { Button } from '../../components/ui/Button';
import { Volume2, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '../../lib/utils';

export const VocabularyHub = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cards, setCards] = useState(mockFlashcards);

  const currentCard = cards[currentIndex];

  const handleSpeak = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech not supported in this browser.');
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 150);
  };

  const markMastered = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCards(prevCards => {
      const newCards = [...prevCards];
      newCards[currentIndex].isMastered = true;
      return newCards;
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 flex flex-col items-center pt-8">
      <div className="w-full flex justify-between items-center px-4">
        <h1 className="text-3xl font-bold text-gray-900">Vocabulary Hub</h1>
        <span className="text-sm font-medium text-gray-500">
          Card {currentIndex + 1} of {cards.length}
        </span>
      </div>

      {/* Flashcard Container */}
      <div 
        className="relative w-full aspect-[4/3] cursor-pointer perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={cn(
          "w-full h-full transition-transform duration-500 transform-style-3d relative",
          isFlipped ? "rotate-y-180" : ""
        )}>
          
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden bg-white border-2 border-indigo-100 rounded-3xl shadow-lg flex flex-col items-center justify-center p-8">
            <button 
              onClick={(e) => handleSpeak(currentCard.term, e)}
              className="absolute top-6 right-6 p-3 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
            >
              <Volume2 size={24} />
            </button>
            <h2 className="text-5xl font-bold text-gray-900 mb-4">{currentCard.term}</h2>
            <p className="text-gray-400 font-medium">Click to flip</p>
            {currentCard.isMastered && (
              <div className="absolute top-6 left-6 flex items-center space-x-1 text-green-500">
                <CheckCircle size={20} />
                <span className="text-sm font-bold">Mastered</span>
              </div>
            )}
          </div>

          {/* Back */}
          <div className="absolute w-full h-full backface-hidden bg-indigo-600 border-2 border-indigo-600 text-white rounded-3xl shadow-lg flex flex-col items-center justify-center p-12 rotate-y-180">
             <button 
              onClick={(e) => handleSpeak(currentCard.definition, e)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
            >
              <Volume2 size={24} />
            </button>
            <div className="space-y-6 text-center w-full">
              <div>
                <h3 className="text-indigo-200 text-sm font-bold uppercase tracking-wider mb-2">Definition</h3>
                <p className="text-2xl font-medium leading-relaxed">{currentCard.definition}</p>
              </div>
              <div className="h-px w-full bg-indigo-400/50" />
              <div>
                <h3 className="text-indigo-200 text-sm font-bold uppercase tracking-wider mb-2">Example</h3>
                <p className="text-lg italic text-indigo-50">"{currentCard.example}"</p>
              </div>
            </div>
            
            {!currentCard.isMastered && (
              <Button 
                variant="secondary"
                className="absolute bottom-8 bg-white text-indigo-600 hover:bg-gray-100"
                onClick={markMastered}
              >
                <CheckCircle size={18} className="mr-2" /> Mark as Mastered
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <Button variant="outline" size="lg" onClick={handlePrev} className="rounded-full w-14 h-14 p-0 flex items-center justify-center">
          <ArrowLeft size={24} />
        </Button>
        <div className="text-sm font-medium text-gray-500">
          Mastered: {cards.filter(c => c.isMastered).length} / {cards.length}
        </div>
        <Button variant="outline" size="lg" onClick={handleNext} className="rounded-full w-14 h-14 p-0 flex items-center justify-center">
          <ArrowRight size={24} />
        </Button>
      </div>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};
