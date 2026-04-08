'use client';

import { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreen = async () => {
    try {
      const elem = document.documentElement;
      if (!document.fullscreenElement) {
        await elem.requestFullscreen();
        setIsFullscreen(true);
        document.body.style.cursor = 'none';
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
        document.body.style.cursor = 'auto';
      }
    } catch (err) {
      console.error('Fullscreen request failed:', err);
    }
  };

  return (
    <Button
      onClick={handleFullscreen}
      size="icon"
      variant="ghost"
      className="absolute top-4 start-4 bg-white/10 hover:bg-white/20 text-white z-50"
      title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
    >
      <Maximize2 className="w-6 h-6" />
    </Button>
  );
}
