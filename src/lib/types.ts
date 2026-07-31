export interface Asset {
  type: 'video-intro' | 'video-loop' | 'bgm' | 'dialogue';
  src: string;
  filename?: string;
  cached?: boolean;
}

export interface Progress {
  filename: string;
  size: number;
}
