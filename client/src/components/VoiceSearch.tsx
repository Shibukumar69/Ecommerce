import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Loader } from 'lucide-react';
import { toast } from './Toast';

interface VoiceSearchProps {
  onTranscript: (text: string) => void;
}

const VoiceSearch: React.FC<VoiceSearchProps> = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Check SpeechRecognition compatibility
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.lang = 'en-US';
      recog.interimResults = false;

      recog.onstart = () => {
        setIsListening(true);
        toast.info('Listening... Speak now.');
      };

      recog.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
        toast.success(`Voice query: "${transcript}"`);
        setIsListening(false);
      };

      recog.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        toast.error(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recog.onend = () => {
        setIsListening(false);
      };

      setRecognition(recog);
    }
  }, [onTranscript]);

  const toggleListening = () => {
    if (!recognition) {
      toast.error('Voice search is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      try {
        recognition.start();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <button
      onClick={toggleListening}
      type="button"
      className={`relative p-2.5 rounded-xl border transition-all duration-300 flex items-center justify-center shrink-0 ${
        isListening
          ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 animate-pulse'
          : 'bg-white/5 border-slate-700/30 text-slate-400 hover:text-slate-200 hover:border-slate-500/40 dark:bg-slate-900/50'
      }`}
      title="Search by voice"
    >
      {isListening ? (
        <>
          <Loader className="h-5 w-5 animate-spin absolute" />
          <MicOff className="h-5 w-5 opacity-20" />
        </>
      ) : (
        <Mic className="h-5 w-5" />
      )}
    </button>
  );
};

export default VoiceSearch;
