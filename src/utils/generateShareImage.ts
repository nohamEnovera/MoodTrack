import { Heart, Sun, Smile, Cloud, CloudRain } from 'lucide-react';

const APP_URL = 'https://cool-donut-472c87.netlify.app';

const moodColors = {
  'pink-500': ['#ec4899', '#f43f5e'],
  'amber-400': ['#fbbf24', '#fb923c'],
  'emerald-400': ['#34d399', '#2dd4bf'],
  'blue-400': ['#60a5fa', '#22d3ee'],
  'violet-500': ['#8b5cf6', '#a855f7']
};

export const generateShareImage = (mood: string, description: string, color: string): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  // Set canvas size (1080x1920 is optimal for Instagram Stories)
  canvas.width = 1080;
  canvas.height = 1920;

  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  const colors = moodColors[color as keyof typeof moodColors] || moodColors['pink-500'];
  gradient.addColorStop(0, colors[0]);
  gradient.addColorStop(1, colors[1]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add decorative pattern
  ctx.save();
  ctx.globalAlpha = 0.1;
  for (let i = 0; i < 15; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 300 + 150;
    
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  }
  ctx.restore();

  // Add content container
  const padding = 60;
  const contentWidth = canvas.width - (padding * 2);
  const contentHeight = canvas.height / 2;
  const contentY = (canvas.height - contentHeight) / 2;

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
  ctx.shadowBlur = 30;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.beginPath();
  ctx.roundRect(padding, contentY, contentWidth, contentHeight, 20);
  ctx.fill();
  ctx.restore();

  // Draw app logo/name
  ctx.fillStyle = colors[0];
  ctx.textAlign = 'center';
  ctx.font = 'bold 64px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('MoodTrack', canvas.width / 2, contentY + 100);

  // Draw mood
  ctx.fillStyle = colors[1];
  ctx.font = 'bold 96px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(mood, canvas.width / 2, contentY + contentHeight / 2 - 40);

  // Draw decorative line
  ctx.strokeStyle = colors[0];
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - 150, contentY + contentHeight / 2);
  ctx.lineTo(canvas.width / 2 + 150, contentY + contentHeight / 2);
  ctx.stroke();

  // Draw description
  ctx.fillStyle = '#374151';
  ctx.font = '48px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const maxWidth = contentWidth - 120;
  const words = description.split(' ');
  let line = '';
  let y = contentY + contentHeight / 2 + 80;
  const lineHeight = 60;

  words.forEach(word => {
    const testLine = line + word + ' ';
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth) {
      ctx.fillText(line, canvas.width / 2, y);
      line = word + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  });
  ctx.fillText(line, canvas.width / 2, y);

  // Add watermark
  ctx.fillStyle = '#6B7280';
  ctx.font = '36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(APP_URL, canvas.width / 2, canvas.height - 100);

  return canvas.toDataURL('image/png');
};