import React, { useState, useContext } from 'react';
import { Download, Video } from 'lucide-react';
import { ImageTemplatePanel } from './ImageTemplatePanel';
import { VideoTemplatePanel } from './VideoTemplatePanel';
import { generateImage } from '../utils/generateImage';
import { generateVideo } from '../utils/generateVideo';
import { useIntl } from 'react-intl';
import { VideoGenerationContext } from '../App';

interface ShareMoodProps {
  mood: string | null;
  entry?: string;
  entryId: string;
  onShare: (platform: string) => void;
}

export function ShareMood({ mood, entry = '', entryId, onShare }: ShareMoodProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isImageTemplatePanelOpen, setIsImageTemplatePanelOpen] = useState(false);
  const [isVideoTemplatePanelOpen, setIsVideoTemplatePanelOpen] = useState(false);
  const intl = useIntl();
  const { setIsGeneratingVideo } = useContext(VideoGenerationContext);
  
  if (!mood) return null;

  const handleTemplateSelect = async (templateId: number) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const imageUrl = await generateImage(mood, entry, templateId);
      
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `moodtrack-${mood.toLowerCase()}-${templateId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      onShare('image');
      setIsImageTemplatePanelOpen(false);
    } catch (error) {
      console.error('Error generating image:', error);
      setError(intl.formatMessage({ id: 'share.error.image' }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoTemplateSelect = async (templateId: number) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    setIsVideoTemplatePanelOpen(false);
    setIsGeneratingVideo(true);

    try {
      const videoBlob = await generateVideo(mood, entry, templateId);
      
      const url = URL.createObjectURL(videoBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `moodtrack-${mood.toLowerCase()}-${templateId}.webm`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      onShare('video');
    } catch (error) {
      console.error('Error generating video:', error);
      setError(intl.formatMessage({ id: 'share.error.video' }));
    } finally {
      setIsLoading(false);
      setIsGeneratingVideo(false);
    }
  };

  return (
    <>
      <div className="flex space-x-2">
        <button
          onClick={() => setIsImageTemplatePanelOpen(true)}
          disabled={isLoading}
          className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-100 hover:text-violet-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
          title={intl.formatMessage({ id: 'share.download.image' })}
        >
          <Download className="w-5 h-5" />
          <span className="text-sm font-medium">
            {intl.formatMessage({ id: 'share.image.button' })}
          </span>
        </button>

        <button
          onClick={() => setIsVideoTemplatePanelOpen(true)}
          disabled={isLoading}
          className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-100 hover:text-violet-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
          title={intl.formatMessage({ id: 'share.download.video' })}
        >
          <Video className="w-5 h-5" />
          <span className="text-sm font-medium">
            {intl.formatMessage({ id: 'share.video.button' })}
          </span>
        </button>
      </div>

      {error && (
        <div className="absolute top-full left-0 right-0 mt-2 p-2 text-xs text-red-600 bg-red-50 rounded-lg border border-red-100 animate-shake">
          {error}
        </div>
      )}

      <ImageTemplatePanel
        isOpen={isImageTemplatePanelOpen}
        onClose={() => setIsImageTemplatePanelOpen(false)}
        mood={mood}
        description={entry}
        onTemplateSelect={handleTemplateSelect}
      />

      <VideoTemplatePanel
        isOpen={isVideoTemplatePanelOpen}
        onClose={() => setIsVideoTemplatePanelOpen(false)}
        mood={mood}
        description={entry}
        onTemplateSelect={handleVideoTemplateSelect}
      />
    </>
  );
}