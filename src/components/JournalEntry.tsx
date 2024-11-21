import React, { useState } from 'react';
import { PenLine, Sparkles, Download } from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { ref, push, serverTimestamp, set } from 'firebase/database';
import { useIntl } from 'react-intl';
import { ShareMood } from './ShareMood';

interface JournalEntryProps {
  selectedMood: string | null;
  onEntrySaved: () => void;
}

export function JournalEntry({ selectedMood, onEntrySaved }: JournalEntryProps) {
  const [entry, setEntry] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isEntrySaved, setIsEntrySaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedEntry, setSavedEntry] = useState<{
    mood: string;
    text: string;
    id: string;
  } | null>(null);
  const intl = useIntl();

  const handleSave = async () => {
    if (!selectedMood || !entry || !auth.currentUser) return;

    setIsSaving(true);
    setError(null);
    try {
      const journalRef = ref(db, `users/${auth.currentUser.uid}/journal`);
      const newEntryRef = push(journalRef);
      
      const entryData = {
        mood: selectedMood,
        entry,
        timestamp: serverTimestamp(),
        userId: auth.currentUser.uid
      };

      await set(newEntryRef, entryData);
      
      setSavedEntry({
        mood: selectedMood,
        text: entry,
        id: newEntryRef.key || ''
      });
      setIsEntrySaved(true);
      setEntry('');
      onEntrySaved();
    } catch (error: any) {
      console.error('Error saving entry:', error);
      setError(intl.formatMessage({ 
        id: 'journal.error.save',
        defaultMessage: 'Failed to save entry. Please try again.'
      }));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg">
            <PenLine className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            {intl.formatMessage({ id: 'journal.title' })}
          </h2>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      <textarea
        className="input-field h-32 resize-none"
        placeholder={intl.formatMessage({ id: 'journal.placeholder' })}
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
      />

      <div className="space-y-4">
        <button 
          className={`btn btn-primary w-full flex items-center justify-center space-x-2 ${
            !selectedMood || !entry || isSaving ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleSave}
          disabled={!selectedMood || !entry || isSaving}
        >
          <Sparkles className={`h-4 w-4 ${isSaving ? 'animate-spin' : ''}`} />
          <span>
            {intl.formatMessage({ 
              id: isSaving ? 'journal.saving' : 'journal.save' 
            })}
          </span>
        </button>

        {isEntrySaved && savedEntry && (
          <div className="mt-4 flex justify-center">
            <ShareMood 
              mood={savedEntry.mood}
              entry={savedEntry.text}
              entryId={savedEntry.id}
              onShare={(platform) => {
                console.log(`Shared on ${platform}`);
              }}
            />
          </div>
        )}
      </div>

      <div className="bg-violet-50 rounded-xl p-4 space-y-3">
        <h3 className="font-medium text-violet-800">
          {intl.formatMessage({ id: 'journal.prompts.title' })}
        </h3>
        <ul className="space-y-2 text-sm text-violet-600">
          <li className="flex items-center space-x-2">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
            <span>{intl.formatMessage({ id: 'journal.prompts.smile' })}</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
            <span>{intl.formatMessage({ id: 'journal.prompts.grateful' })}</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
            <span>{intl.formatMessage({ id: 'journal.prompts.intention' })}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}