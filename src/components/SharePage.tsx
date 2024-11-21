import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { generateImage } from '../utils/generateImage';

export function SharePage() {
  const [searchParams] = useSearchParams();
  const mood = searchParams.get('mood') || '';
  const description = searchParams.get('description') || '';
  const templateId = parseInt(searchParams.get('template') || '1', 10);

  React.useEffect(() => {
    const generateAndDownload = async () => {
      try {
        const imageUrl = await generateImage(mood, description, templateId);
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `moodtrack-${mood.toLowerCase()}-${templateId}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Rediriger vers la page d'accueil après le téléchargement
        window.location.href = '/';
      } catch (error) {
        console.error('Error generating share image:', error);
        window.location.href = '/';
      }
    };

    generateAndDownload();
  }, [mood, description, templateId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-pink-50 p-4">
      <div className="card p-8 max-w-md w-full text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-600">Génération de votre image...</p>
      </div>
    </div>
  );
}