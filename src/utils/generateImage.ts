import { templateBackgrounds } from './templates';

export async function generateImage(mood: string, description: string, templateId: number): Promise<string> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  // Set canvas size
  canvas.width = 1080;
  canvas.height = 1920;

  // Get template configuration
  const template = templateBackgrounds.find(t => t.id === templateId);
  if (!template) throw new Error('Template not found');

  // Parse gradient colors from template
  const gradientColors = template.gradient
    .replace('from-', '')
    .replace('to-', '')
    .split(' ')
    .map(color => {
      switch (color) {
        case 'pink-500': return '#ec4899';
        case 'rose-500': return '#f43f5e';
        case 'amber-400': return '#fbbf24';
        case 'orange-500': return '#f97316';
        case 'emerald-400': return '#34d399';
        case 'teal-500': return '#14b8a6';
        case 'blue-400': return '#60a5fa';
        case 'cyan-500': return '#06b6d4';
        case 'violet-500': return '#8b5cf6';
        case 'purple-500': return '#a855f7';
        default: return '#8b5cf6';
      }
    });

  // Draw gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, gradientColors[0]);
  gradient.addColorStop(1, gradientColors[1]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add pattern overlay based on template
  ctx.save();
  ctx.globalAlpha = 0.1;
  
  switch (template.pattern) {
    case 'circles':
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 50 + 10;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
      }
      break;

    case 'waves':
      for (let y = 0; y < canvas.height; y += 100) {
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x += 10) {
          const offset = Math.sin(x * 0.02) * 30;
          ctx.lineTo(x, y + offset);
        }
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      break;

    case 'hearts':
      for (let i = 0; i < 30; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 40 + 20;
        
        ctx.beginPath();
        ctx.moveTo(x, y + size / 4);
        ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + size / 4);
        ctx.bezierCurveTo(x - size / 2, y + size / 2, x, y + size * 3/4, x, y + size);
        ctx.bezierCurveTo(x, y + size * 3/4, x + size / 2, y + size / 2, x + size / 2, y + size / 4);
        ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + size / 4);
        ctx.fillStyle = 'white';
        ctx.fill();
      }
      break;

    default:
      // Default pattern (dots)
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
      }
  }
  
  ctx.restore();

  // Draw text
  ctx.textAlign = 'center';
  ctx.fillStyle = 'white';

  // Draw mood text
  ctx.font = 'bold 96px system-ui';
  ctx.fillText(mood, canvas.width / 2, canvas.height / 3);

  // Draw description with word wrap
  ctx.font = '48px system-ui';
  const words = description.split(' ');
  let line = '';
  let y = canvas.height / 2;
  const maxWidth = canvas.width - 200;
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
  ctx.font = '32px system-ui';
  ctx.fillText('MoodTrack', canvas.width / 2, canvas.height - 100);

  return canvas.toDataURL('image/png');
}