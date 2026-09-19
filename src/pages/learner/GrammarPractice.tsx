import React, { useState } from 'react';
import { mockQuiz } from '../../mockData';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export const GrammarPractice = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const question = mockQuiz[currentQuestionIndex];
  const isFinished = currentQuestionIndex >= mockQuiz.length;

  const handleSubmit = () => {
    if (selectedOption === null) return;
    
    setIsSubmitted(true);
    if (selectedOption === question.correctAnswerIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    setCurrentQuestionIndex(i => i + 1);
  };

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-6">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Quiz Completed!</h2>
        <p className="text-xl text-gray-600">You scored {score} out of {mockQuiz.length}</p>
        <Button 
          onClick={() => {
            setCurrentQuestionIndex(0);
            setScore(0);
            setSelectedOption(null);
            setIsSubmitted(false);
          }}
          className="mt-8"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Grammar Practice</h1>
        <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full">
          Question {currentQuestionIndex + 1} of {mockQuiz.length}
        </span>
      </div>

      <Card className="border-2 border-indigo-50 shadow-sm overflow-hidden">
        <div className="bg-indigo-600 p-8 text-white">
          <h2 className="text-2xl font-medium leading-relaxed">{question.question}</h2>
        </div>
        <CardContent className="p-8 space-y-4 bg-white">
          {question.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const isCorrect = index === question.correctAnswerIndex;
            
            let buttonVariant = 'outline';
            let buttonClass = 'w-full justify-start text-left h-auto py-4 px-6 text-lg border-2 hover:bg-indigo-50 transition-all';
            
            if (isSubmitted) {
              if (isCorrect) {
                buttonClass = cn(buttonClass, 'border-green-500 bg-green-50 text-green-700');
              } else if (isSelected && !isCorrect) {
                buttonClass = cn(buttonClass, 'border-red-500 bg-red-50 text-red-700');
              } else {
                buttonClass = cn(buttonClass, 'opacity-50 cursor-not-allowed');
              }
            } else if (isSelected) {
              buttonClass = cn(buttonClass, 'border-indigo-600 bg-indigo-50');
            }

            return (
              <button
                key={index}
                disabled={isSubmitted}
                onClick={() => setSelectedOption(index)}
                className={cn(
                  'w-full flex items-center justify-between rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
                  buttonClass
                )}
              >
                <span>{option}</span>
                {isSubmitted && isCorrect && <CheckCircle2 className="text-green-600" />}
                {isSubmitted && isSelected && !isCorrect && <XCircle className="text-red-600" />}
              </button>
            );
          })}

          {isSubmitted && (
            <div className={cn(
              "mt-8 p-6 rounded-xl border",
              selectedOption === question.correctAnswerIndex 
                ? "bg-green-50 border-green-200 text-green-900" 
                : "bg-orange-50 border-orange-200 text-orange-900"
            )}>
              <h4 className="font-bold mb-2 flex items-center">
                {selectedOption === question.correctAnswerIndex ? 'Correct!' : 'Not quite right.'}
              </h4>
              <p>{question.explanation}</p>
            </div>
          )}

          <div className="pt-6 flex justify-end">
            {!isSubmitted ? (
              <Button 
                size="lg" 
                onClick={handleSubmit} 
                disabled={selectedOption === null}
              >
                Check Answer
              </Button>
            ) : (
              <Button size="lg" onClick={handleNext}>
                {currentQuestionIndex === mockQuiz.length - 1 ? 'Finish Quiz' : 'Next Question'} <ArrowRight className="ml-2" size={18} />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
