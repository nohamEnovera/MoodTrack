import { templateBackgrounds } from './templates';

export async function generateVideo(mood: string, description: string, templateId: number): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  canvas.width = 1080;
  canvas.height = 1920;

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
        case 'rose-400': return '#fb7185';
        case 'pink-600': return '#db2777';
        case 'amber-500': return '#f59e0b';
        case 'red-500': return '#ef4444';
        case 'teal-400': return '#2dd4bf';
        case 'emerald-600': return '#059669';
        case 'blue-500': return '#3b82f6';
        case 'indigo-600': return '#4f46e5';
        case 'purple-400': return '#c084fc';
        case 'violet-600': return '#7c3aed';
        default: return '#8b5cf6';
      }
    });

  // Generate frames
  const frames: Blob[] = [];
  const duration = 3; // 3 seconds
  const fps = 30;
  const totalFrames = duration * fps;

  for (let i = 0; i < totalFrames; i++) {
    const progress = i / totalFrames;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, gradientColors[0]);
    gradient.addColorStop(1, gradientColors[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add animated pattern
    ctx.save();
    ctx.globalAlpha = 0.1;
    const time = progress * Math.PI * 2;

    // Draw pattern based on template
    switch (template.pattern) {
      case 'circles':
        for (let j = 0; j < 10; j++) {
          const x = Math.sin(time + j) * 200 + canvas.width / 2;
          const y = Math.cos(time + j) * 200 + canvas.height / 2;
          ctx.beginPath();
          ctx.arc(x, y, 50, 0, Math.PI * 2);
          ctx.fillStyle = 'white';
          ctx.fill();
        }
        break;

      case 'hearts':
        for (let j = 0; j < 8; j++) {
          const x = Math.sin(time + j) * 200 + canvas.width / 2;
          const y = Math.cos(time + j) * 200 + canvas.height / 2;
          const size = 40;
          
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

      case 'waves':
        for (let y = 0; y < canvas.height; y += 200) {
          ctx.beginPath();
          for (let x = 0; x < canvas.width; x += 10) {
            const offset = Math.sin(x * 0.02 + time) * 50;
            ctx.lineTo(x, y + offset);
          }
          ctx.strokeStyle = 'white';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        break;

      case 'stars':
        for (let j = 0; j < 8; j++) {
          const x = Math.sin(time + j) * 200 + canvas.width / 2;
          const y = Math.cos(time + j) * 200 + canvas.height / 2;
          const size = 30;
          
          ctx.beginPath();
          for (let k = 0; k < 5; k++) {
            ctx.lineTo(
              x + size * Math.cos(k * 4 * Math.PI / 5 + time),
              y + size * Math.sin(k * 4 * Math.PI / 5 + time)
            );
          }
          ctx.closePath();
          ctx.fillStyle = 'white';
          ctx.fill();
        }
        break;

      case 'bubbles':
        for (let j = 0; j < 12; j++) {
          const x = Math.sin(time + j) * 200 + canvas.width / 2;
          const y = Math.cos(time + j) * 200 + canvas.height / 2;
          const radius = 20 + Math.sin(time * 2 + j) * 10;
          
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = 'white';
          ctx.fill();
        }
        break;

      case 'clouds':
        for (let j = 0; j < 6; j++) {
          const x = Math.sin(time + j) * 200 + canvas.width / 2;
          const y = Math.cos(time + j) * 200 + canvas.height / 2;
          const size = 60;
          
          ctx.beginPath();
          ctx.arc(x, y, size * 0.4, 0, Math.PI * 2);
          ctx.arc(x + size * 0.3, y - size * 0.2, size * 0.3, 0, Math.PI * 2);
          ctx.arc(x + size * 0.6, y, size * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = 'white';
          ctx.fill();
        }
        break;

      case 'diamonds':
        for (let j = 0; j < 8; j++) {
          const x = Math.sin(time + j) * 200 + canvas.width / 2;
          const y = Math.cos(time + j) * 200 + canvas.height / 2;
          const size = 40;
          
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(time);
          
          ctx.beginPath();
          ctx.moveTo(0, -size);
          ctx.lineTo(size, 0);
          ctx.lineTo(0, size);
          ctx.lineTo(-size, 0);
          ctx.closePath();
          ctx.fillStyle = 'white';
          ctx.fill();
          
          ctx.restore();
        }
        break;

      case 'sunbursts':
        for (let j = 0; j < 6; j++) {
          const x = Math.sin(time + j) * 200 + canvas.width / 2;
          const y = Math.cos(time + j) * 200 + canvas.height / 2;
          
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(time);
          
          for (let k = 0; k < 12; k++) {
            const angle = (k / 12) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(
              60 * Math.cos(angle),
              60 * Math.sin(angle)
            );
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();
          }
          
          ctx.restore();
        }
        break;

      case 'leaves':
        for (let j = 0; j < 8; j++) {
          const x = Math.sin(time + j) * 200 + canvas.width / 2;
          const y = Math.cos(time + j) * 200 + canvas.height / 2;
          const size = 40;
          
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(time + j);
          
          ctx.beginPath();
          ctx.moveTo(0, -size);
          ctx.quadraticCurveTo(size/2, 0, 0, size);
          ctx.quadraticCurveTo(-size/2, 0, 0, -size);
          ctx.fillStyle = 'white';
          ctx.fill();
          
          ctx.restore();
        }
        break;

      default:
        // Default pattern (dots)
        for (let j = 0; j < 12; j++) {
          const x = Math.sin(time + j) * 200 + canvas.width / 2;
          const y = Math.cos(time + j) * 200 + canvas.height / 2;
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fillStyle = 'white';
          ctx.fill();
        }
    }
    ctx.restore();

    // Draw text
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.font = 'bold 96px system-ui';
    ctx.fillText(mood, canvas.width / 2, canvas.height / 3);

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

    // Convert frame to blob
    const frameBlob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => resolve(blob!), 'image/webp', 0.8);
    });
    frames.push(frameBlob);
  }

  // Create video using MediaRecorder
  const stream = canvas.captureStream(30);
  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'video/webm;codecs=vp9'
  });

  const chunks: Blob[] = [];
  mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

  const recordingPromise = new Promise<Blob>((resolve) => {
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      resolve(blob);
    };
  });

  mediaRecorder.start();
  
  // Animate frames
  for (let i = 0; i < frames.length; i++) {
    const img = new Image();
    img.src = URL.createObjectURL(frames[i]);
    await new Promise(resolve => {
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(img.src);
        setTimeout(resolve, 1000 / fps);
      };
    });
  }

  mediaRecorder.stop();
  return recordingPromise;
}