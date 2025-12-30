import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { CameraManager } from '../utils/camera';

describe('Feature: nutri-scan-app, Camera Property Tests', () => {
  let cameraManager: CameraManager;

  beforeEach(() => {
    cameraManager = new CameraManager();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cameraManager.cleanup();
  });

  describe('Property 1: Camera permission handling', () => {
    it('should display live preview when camera permissions are granted', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.boolean(), // hasCamera
          fc.boolean(), // permissionGranted
          async (hasCamera, permissionGranted) => {
            // Mock getUserMedia based on test parameters
            const mockGetUserMedia = vi.fn();
            
            if (permissionGranted && hasCamera) {
              const mockStream = {
                getTracks: () => [{ stop: vi.fn() }],
                getVideoTracks: () => [{ getSettings: () => ({ width: 1920, height: 1080 }) }]
              } as any;
              mockGetUserMedia.mockResolvedValue(mockStream);
            } else if (!permissionGranted) {
              const error = new Error('Permission denied');
              error.name = 'NotAllowedError';
              mockGetUserMedia.mockRejectedValue(error);
            } else {
              const error = new Error('No camera found');
              error.name = 'NotFoundError';
              mockGetUserMedia.mockRejectedValue(error);
            }

            vi.mocked(navigator.mediaDevices.getUserMedia).mockImplementation(mockGetUserMedia);

            const result = await cameraManager.requestCameraPermission();
            const state = cameraManager.getState();

            if (permissionGranted && hasCamera) {
              expect(result).toBe(true);
              expect(state.isPermissionGranted).toBe(true);
              expect(state.hasCamera).toBe(true);
              expect(state.stream).toBeTruthy();
            } else {
              expect(result).toBe(false);
              expect(state.isPermissionGranted).toBe(false);
              expect(state.error).toBeTruthy();
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 2: Photo capture functionality', () => {
    it('should successfully capture a photo when the capture button is activated', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 320, max: 1920 }), // videoWidth
          fc.integer({ min: 240, max: 1080 }), // videoHeight
          fc.boolean(), // hasPermission
          fc.boolean(), // hasStream
          async (videoWidth, videoHeight, hasPermission, hasStream) => {
            // Mock video element
            const mockVideoElement = {
              videoWidth,
              videoHeight,
              play: vi.fn(),
              pause: vi.fn(),
            } as any;

            // Set up camera state
            if (hasPermission && hasStream) {
              const mockStream = {
                getTracks: () => [{ stop: vi.fn() }],
                getVideoTracks: () => [{ getSettings: () => ({ width: videoWidth, height: videoHeight }) }]
              } as any;
              
              cameraManager['state'].isPermissionGranted = true;
              cameraManager['state'].hasCamera = true;
              cameraManager['state'].stream = mockStream;
            } else {
              cameraManager['state'].isPermissionGranted = hasPermission;
              cameraManager['state'].hasCamera = hasStream;
              cameraManager['state'].stream = hasStream ? {} as any : null;
            }

            const result = await cameraManager.capturePhoto(mockVideoElement);
            const state = cameraManager.getState();

            if (hasPermission && hasStream) {
              // Should successfully capture photo
              expect(result).toBeTruthy();
              expect(typeof result).toBe('string');
              expect(result).toMatch(/^data:image\/png;base64,/);
            } else {
              // Should fail to capture photo
              expect(result).toBeNull();
              expect(state.error).toBeTruthy();
              expect(state.error?.type).toBe('unknown');
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle canvas context creation failure gracefully', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 320, max: 1920 }), // videoWidth
          fc.integer({ min: 240, max: 1080 }), // videoHeight
          (videoWidth, videoHeight) => {
            // Mock video element
            const mockVideoElement = {
              videoWidth,
              videoHeight,
            } as any;

            // Set up successful camera state
            const mockStream = {
              getTracks: () => [{ stop: vi.fn() }],
            } as any;
            
            cameraManager['state'].isPermissionGranted = true;
            cameraManager['state'].hasCamera = true;
            cameraManager['state'].stream = mockStream;

            // Mock canvas getContext to return null (simulating failure)
            const originalGetContext = HTMLCanvasElement.prototype.getContext;
            HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(null);

            const result = cameraManager.capturePhoto(mockVideoElement);
            const state = cameraManager.getState();

            // Should handle failure gracefully
            expect(result).resolves.toBeNull();
            expect(state.error).toBeTruthy();

            // Restore original method
            HTMLCanvasElement.prototype.getContext = originalGetContext;
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Property 3: Default camera selection', () => {
    it('should default to rear-facing camera when multiple cameras are available', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(
            fc.record({
              deviceId: fc.string({ minLength: 1 }),
              label: fc.oneof(
                fc.constant('Front Camera'),
                fc.constant('Back Camera'),
                fc.constant('Rear Camera'),
                fc.constant('Environment Camera'),
                fc.constant('User Camera'),
                fc.string()
              ),
              kind: fc.constant('videoinput' as const),
              groupId: fc.string()
            }),
            { minLength: 1, maxLength: 5 }
          ),
          async (mockDevices) => {
            // Mock enumerateDevices
            vi.mocked(navigator.mediaDevices.enumerateDevices).mockResolvedValue(
              mockDevices as MediaDeviceInfo[]
            );

            const selectedDeviceId = await cameraManager.selectDefaultCamera();
            
            // Check if there's a rear-facing camera in the mock devices
            const rearCamera = mockDevices.find(device => 
              device.label.toLowerCase().includes('back') ||
              device.label.toLowerCase().includes('rear') ||
              device.label.toLowerCase().includes('environment')
            );

            if (rearCamera) {
              // Should select the rear camera
              expect(selectedDeviceId).toBe(rearCamera.deviceId);
            } else if (mockDevices.length > 0) {
              // Should select the first available camera
              expect(selectedDeviceId).toBe(mockDevices[0].deviceId);
            } else {
              // No cameras available
              expect(selectedDeviceId).toBeNull();
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 19: Camera aspect ratio consistency', () => {
    it('should maintain proper aspect ratio across different screen sizes', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 320, max: 1920 }), // containerWidth
          fc.integer({ min: 240, max: 1080 }), // containerHeight  
          fc.float({ min: 0.5, max: 3.0 }), // videoAspectRatio
          (containerWidth, containerHeight, videoAspectRatio) => {
            const result = cameraManager.maintainAspectRatio(
              containerWidth, 
              containerHeight, 
              videoAspectRatio
            );

            // The calculated dimensions should maintain the video's aspect ratio
            const calculatedAspectRatio = result.width / result.height;
            const tolerance = 0.01; // Allow small floating point differences
            
            expect(Math.abs(calculatedAspectRatio - videoAspectRatio)).toBeLessThan(tolerance);
            
            // The result should fit within the container
            expect(result.width).toBeLessThanOrEqual(containerWidth + tolerance);
            expect(result.height).toBeLessThanOrEqual(containerHeight + tolerance);
            
            // Dimensions should be positive
            expect(result.width).toBeGreaterThan(0);
            expect(result.height).toBeGreaterThan(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should calculate aspect ratio correctly for any valid dimensions', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 4000 }), // width
          fc.integer({ min: 1, max: 4000 }), // height
          (width, height) => {
            const aspectRatio = cameraManager.calculateAspectRatio(width, height);
            
            // Aspect ratio should be positive
            expect(aspectRatio).toBeGreaterThan(0);
            
            // Should equal width/height
            expect(aspectRatio).toBeCloseTo(width / height, 10);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle zero height gracefully', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 4000 }), // width
          (width) => {
            const aspectRatio = cameraManager.calculateAspectRatio(width, 0);
            
            // Should return default aspect ratio (16:9) when height is 0
            expect(aspectRatio).toBe(16/9);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});