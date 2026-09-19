import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Mic, Square, Play, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';

export const SpeakingLab = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const promptText = "The quick brown fox jumps over the lazy dog. This sentence contains every letter in the English alphabet and is often used to test typewriters and computer keyboards.";

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    setIsFinished(false);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsFinished(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Speaking & Pronunciation Lab</h1>
      
      <Card className="border-2 border-indigo-100 overflow-hidden shadow-sm">
        <div className="bg-indigo-50 p-6 border-b border-indigo-100">
          <h3 className="text-sm font-bold text-indigo-800 uppercase tracking-wider mb-2">Please read the following aloud:</h3>
          <p className="text-2xl text-indigo-950 font-medium leading-relaxed">{promptText}</p>
        </div>
        
        <CardContent className="p-12 flex flex-col items-center justify-center space-y-8">
          
          <div className="relative">
            {isRecording && (
              <div className="absolute -inset-4 bg-red-100 rounded-full animate-ping opacity-75" />
            )}
            <div className={cn(
              "w-32 h-32 rounded-full flex items-center justify-center relative z-10 transition-colors",
              isRecording ? "bg-red-500 text-white shadow-xl" : "bg-indigo-100 text-indigo-600"
            )}>
              <Mic size={48} />
            </div>
          </div>

          <div className="text-center">
            {isRecording ? (
              <div className="space-y-2">
                <p className="text-red-500 font-bold text-xl animate-pulse">Recording...</p>
                <p className="text-gray-600 text-3xl font-mono">{formatTime(recordingTime)}</p>
              </div>
            ) : isFinished ? (
              <div className="space-y-2">
                <p className="text-green-600 font-bold text-xl">Recording Complete!</p>
                <p className="text-gray-500">Duration: {formatTime(recordingTime)}</p>
              </div>
            ) : (
              <p className="text-gray-500">Click start to begin recording your voice.</p>
            )}
          </div>

          <div className="flex space-x-4">
            {!isRecording && !isFinished && (
              <Button size="lg" onClick={handleStartRecording} className="w-48">
                Start Recording
              </Button>
            )}
            
            {isRecording && (
              <Button size="lg" variant="danger" onClick={handleStopRecording} className="w-48">
                <Square className="mr-2" size={18} /> Stop
              </Button>
            )}

            {isFinished && (
              <>
                <Button size="lg" variant="outline" className="w-40 border-indigo-200 hover:bg-indigo-50">
                  <Play className="mr-2" size={18} /> Playback
                </Button>
                <Button size="lg" onClick={handleStartRecording} className="w-40">
                  <RefreshCw className="mr-2" size={18} /> Retry
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {isFinished && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <h3 className="font-bold text-green-900 mb-2">Analysis Complete</h3>
            <p className="text-green-800 text-sm">Your pronunciation matches the prompt closely. Great job with the pacing! Note: This is a simulated analysis.</p>
            
            <div className="mt-4 pt-4 border-t border-green-200/50">
              <p className="text-sm text-green-700"><strong>Accuracy:</strong> 98%</p>
              <p className="text-sm text-green-700"><strong>Fluency:</strong> Good</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
