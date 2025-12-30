import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CameraManager } from '../utils/camera';

describe('Camera Error Handling Unit Tests', () => {
  let cameraManager: CameraManager;

  beforeEach(() => {
    cameraManager = new CameraManager();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cameraManager.cleanup();
  });

  describe('Permission denied scenarios', () => {
    it('should handle NotAllowedError when camera permission is denied', async () => {
      // Mock getUserMedia to throw NotAllowedError
      const permissionError = new Error('Permission denied by user');
      permissionError.name = 'NotAllowedError';
      
      vi.mocked(navigator.mediaDevices.getUserMedia).mockRejectedValue(permissionError);

      const result = await cameraManager.requestCameraPermission();
      const state = cameraManager.getState();

      expect(result).toBe(false);
      expect(state.isPermissionGranted).toBe(false);
      expect(state.error).toBeTruthy();
      expect(state.error?.type).toBe('permission_denied');
      expect(state.error?.message).toBe('Permission denied by user');
    });

    it('should handle SecurityError when camera access is blocked by policy', async () => {
      // Mock getUserMedia to throw SecurityError
      const securityError = new Error('Camera access blocked by security policy');
      securityError.name = 'SecurityError';
      
      vi.mocked(navigator.mediaDevices.getUserMedia).mockRejectedValue(securityError);

      const result = await cameraManager.requestCameraPermission();
      const state = cameraManager.getState();

      expect(result).toBe(false);
      expect(state.isPermissionGranted).toBe(false);
      expect(state.error).toBeTruthy();
      expect(state.error?.type).toBe('device_not_found');
      expect(state.error?.message).toBe('Camera access blocked by security policy');
    });

    it('should handle permission denied with generic error message', async () => {
      // Mock getUserMedia to throw a generic permission error
      const genericError = new Error('User denied camera access');
      genericError.name = 'NotAllowedError';
      
      vi.mocked(navigator.mediaDevices.getUserMedia).mockRejectedValue(genericError);

      const result = await cameraManager.requestCameraPermission();
      const state = cameraManager.getState();

      expect(result).toBe(false);
      expect(state.isPermissionGranted).toBe(false);
      expect(state.error).toBeTruthy();
      expect(state.error?.type).toBe('permission_denied');
      expect(state.error?.message).toBe('User denied camera access');
    });
  });

  describe('Device not found scenarios', () => {
    it('should handle NotFoundError when no camera device is available', async () => {
      // Mock getUserMedia to throw NotFoundError
      const deviceError = new Error('No camera device found');
      deviceError.name = 'NotFoundError';
      
      vi.mocked(navigator.mediaDevices.getUserMedia).mockRejectedValue(deviceError);

      const result = await cameraManager.requestCameraPermission();
      const state = cameraManager.getState();

      expect(result).toBe(false);
      expect(state.isPermissionGranted).toBe(false);
      expect(state.error).toBeTruthy();
      expect(state.error?.type).toBe('device_not_found');
      expect(state.error?.message).toBe('No camera device found');
    });

    it('should handle NotReadableError when camera is already in use', async () => {
      // Mock getUserMedia to throw NotReadableError
      const busyError = new Error('Camera is already in use by another application');
      busyError.name = 'NotReadableError';
      
      vi.mocked(navigator.mediaDevices.getUserMedia).mockRejectedValue(busyError);

      const result = await cameraManager.requestCameraPermission();
      const state = cameraManager.getState();

      expect(result).toBe(false);
      expect(state.isPermissionGranted).toBe(false);
      expect(state.error).toBeTruthy();
      expect(state.error?.type).toBe('device_not_found');
      expect(state.error?.message).toBe('Camera is already in use by another application');
    });

    it('should handle OverconstrainedError when camera constraints cannot be satisfied', async () => {
      // Mock getUserMedia to throw OverconstrainedError
      const constraintError = new Error('Camera constraints cannot be satisfied');
      constraintError.name = 'OverconstrainedError';
      
      vi.mocked(navigator.mediaDevices.getUserMedia).mockRejectedValue(constraintError);

      const result = await cameraManager.requestCameraPermission();
      const state = cameraManager.getState();

      expect(result).toBe(false);
      expect(state.isPermissionGranted).toBe(false);
      expect(state.error).toBeTruthy();
      expect(state.error?.type).toBe('device_not_found');
      expect(state.error?.message).toBe('Camera constraints cannot be satisfied');
    });

    it('should return empty array when enumerateDevices fails', async () => {
      // Mock enumerateDevices to throw an error
      const enumerateError = new Error('Failed to enumerate devices');
      vi.mocked(navigator.mediaDevices.enumerateDevices).mockRejectedValue(enumerateError);

      const cameras = await cameraManager.getAvailableCameras();

      expect(cameras).toEqual([]);
    });

    it('should return null when no cameras are available for selection', async () => {
      // Mock enumerateDevices to return empty array
      vi.mocked(navigator.mediaDevices.enumerateDevices).mockResolvedValue([]);

      const selectedDeviceId = await cameraManager.selectDefaultCamera();

      expect(selectedDeviceId).toBeNull();
    });
  });

  describe('Camera initialization failures', () => {
    it('should handle missing mediaDevices API', async () => {
      // Mock missing mediaDevices API
      const originalMediaDevices = navigator.mediaDevices;
      Object.defineProperty(navigator, 'mediaDevices', {
        value: undefined,
        configurable: true
      });

      const result = await cameraManager.requestCameraPermission();
      const state = cameraManager.getState();

      expect(result).toBe(false);
      expect(state.isPermissionGranted).toBe(false);
      expect(state.error).toBeTruthy();
      expect(state.error?.type).toBe('device_not_found');
      expect(state.error?.message).toBe('Camera not supported');

      // Restore original mediaDevices
      Object.defineProperty(navigator, 'mediaDevices', {
        value: originalMediaDevices,
        configurable: true
      });
    });

    it('should handle missing getUserMedia method', async () => {
      // Mock missing getUserMedia method
      const originalGetUserMedia = navigator.mediaDevices.getUserMedia;
      Object.defineProperty(navigator.mediaDevices, 'getUserMedia', {
        value: undefined,
        configurable: true
      });

      const result = await cameraManager.requestCameraPermission();
      const state = cameraManager.getState();

      expect(result).toBe(false);
      expect(state.isPermissionGranted).toBe(false);
      expect(state.error).toBeTruthy();
      expect(state.error?.type).toBe('device_not_found');
      expect(state.error?.message).toBe('Camera not supported');

      // Restore original getUserMedia
      Object.defineProperty(navigator.mediaDevices, 'getUserMedia', {
        value: originalGetUserMedia,
        configurable: true
      });
    });

    it('should handle unknown errors during camera initialization', async () => {
      // Mock getUserMedia to throw an unknown error
      const unknownError = new Error('Unknown camera initialization error');
      unknownError.name = 'UnknownError';
      
      vi.mocked(navigator.mediaDevices.getUserMedia).mockRejectedValue(unknownError);

      const result = await cameraManager.requestCameraPermission();
      const state = cameraManager.getState();

      expect(result).toBe(false);
      expect(state.isPermissionGranted).toBe(false);
      expect(state.error).toBeTruthy();
      expect(state.error?.type).toBe('device_not_found');
      expect(state.error?.message).toBe('Unknown camera initialization error');
    });

    it('should handle non-Error exceptions during camera initialization', async () => {
      // Mock getUserMedia to throw a non-Error object
      vi.mocked(navigator.mediaDevices.getUserMedia).mockRejectedValue('String error');

      const result = await cameraManager.requestCameraPermission();
      const state = cameraManager.getState();

      expect(result).toBe(false);
      expect(state.isPermissionGranted).toBe(false);
      expect(state.error).toBeTruthy();
      expect(state.error?.type).toBe('device_not_found');
      expect(state.error?.message).toBe('Unknown camera error');
    });

    it('should handle photo capture failure when camera is not initialized', async () => {
      // Create a mock video element
      const mockVideoElement = {
        videoWidth: 640,
        videoHeight: 480,
      } as HTMLVideoElement;

      // Ensure camera is not initialized (no stream, no permission)
      const result = await cameraManager.capturePhoto(mockVideoElement);
      const state = cameraManager.getState();

      expect(result).toBeNull();
      expect(state.error).toBeTruthy();
      expect(state.error?.type).toBe('unknown');
      expect(state.error?.message).toBe('Camera not available or permission not granted');
    });

    it('should handle photo capture failure when canvas context is unavailable', async () => {
      // Set up successful camera state
      const mockStream = {
        getTracks: () => [{ stop: vi.fn() }],
      } as any;
      
      cameraManager['state'].isPermissionGranted = true;
      cameraManager['state'].hasCamera = true;
      cameraManager['state'].stream = mockStream;

      // Create a mock video element
      const mockVideoElement = {
        videoWidth: 640,
        videoHeight: 480,
      } as HTMLVideoElement;

      // Mock canvas getContext to return null
      const originalGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(null);

      const result = await cameraManager.capturePhoto(mockVideoElement);
      const state = cameraManager.getState();

      expect(result).toBeNull();
      expect(state.error).toBeTruthy();
      expect(state.error?.type).toBe('unknown');
      expect(state.error?.message).toBe('Canvas context not available');

      // Restore original method
      HTMLCanvasElement.prototype.getContext = originalGetContext;
    });
  });

  describe('Error state management', () => {
    it('should clear previous errors when successful operation occurs', async () => {
      // First, cause an error
      const permissionError = new Error('Permission denied');
      permissionError.name = 'NotAllowedError';
      vi.mocked(navigator.mediaDevices.getUserMedia).mockRejectedValueOnce(permissionError);

      await cameraManager.requestCameraPermission();
      let state = cameraManager.getState();
      expect(state.error).toBeTruthy();

      // Then, simulate successful operation
      const mockStream = {
        getTracks: () => [{ stop: vi.fn() }],
        getVideoTracks: () => [{ getSettings: () => ({ width: 1920, height: 1080 }) }]
      } as any;
      vi.mocked(navigator.mediaDevices.getUserMedia).mockResolvedValue(mockStream);

      await cameraManager.requestCameraPermission();
      state = cameraManager.getState();
      
      expect(state.error).toBeNull();
      expect(state.isPermissionGranted).toBe(true);
    });

    it('should maintain error state until successful operation', async () => {
      // Cause an error
      const deviceError = new Error('No camera found');
      deviceError.name = 'NotFoundError';
      vi.mocked(navigator.mediaDevices.getUserMedia).mockRejectedValue(deviceError);

      await cameraManager.requestCameraPermission();
      const state1 = cameraManager.getState();
      expect(state1.error).toBeTruthy();
      expect(state1.error?.type).toBe('device_not_found');

      // Call again with same error
      await cameraManager.requestCameraPermission();
      const state2 = cameraManager.getState();
      expect(state2.error).toBeTruthy();
      expect(state2.error?.type).toBe('device_not_found');
      expect(state2.error?.message).toBe('No camera found');
    });
  });
});