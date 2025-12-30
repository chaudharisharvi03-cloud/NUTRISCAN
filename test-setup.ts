// Mock getUserMedia for testing
Object.defineProperty(global.navigator, 'mediaDevices', {
  writable: true,
  value: {
    getUserMedia: vi.fn(),
    enumerateDevices: vi.fn(),
  },
});

// Mock HTMLVideoElement
Object.defineProperty(global.HTMLVideoElement.prototype, 'play', {
  writable: true,
  value: vi.fn().mockResolvedValue(undefined),
});

Object.defineProperty(global.HTMLVideoElement.prototype, 'pause', {
  writable: true,
  value: vi.fn(),
});

// Mock canvas context for image capture
Object.defineProperty(global.HTMLCanvasElement.prototype, 'getContext', {
  writable: true,
  value: vi.fn().mockReturnValue({
    drawImage: vi.fn(),
    getImageData: vi.fn(),
  }),
});

Object.defineProperty(global.HTMLCanvasElement.prototype, 'toDataURL', {
  writable: true,
  value: vi.fn().mockReturnValue('data:image/png;base64,mock-image-data'),
});