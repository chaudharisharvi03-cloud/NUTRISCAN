import { CameraError, CameraDevice, CameraState } from '../types';

export class CameraManager {
  private state: CameraState = {
    isPermissionGranted: false,
    hasCamera: false,
    selectedDeviceId: null,
    stream: null,
    aspectRatio: 16/9,
    error: null,
  };

  async requestCameraPermission(): Promise<boolean> {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      this.state.isPermissionGranted = true;
      this.state.hasCamera = true;
      this.state.stream = stream;
      
      return true;
    } catch (error) {
      const cameraError: CameraError = {
        type: error instanceof Error && error.name === 'NotAllowedError' 
          ? 'permission_denied' 
          : 'device_not_found',
        message: error instanceof Error ? error.message : 'Unknown camera error'
      };
      
      this.state.error = cameraError;
      this.state.isPermissionGranted = false;
      
      return false;
    }
  }

  async getAvailableCameras(): Promise<CameraDevice[]> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices
        .filter(device => device.kind === 'videoinput')
        .map(device => ({
          deviceId: device.deviceId,
          kind: device.kind as 'videoinput',
          label: device.label,
          groupId: device.groupId,
        }));
    } catch (error) {
      return [];
    }
  }

  async selectDefaultCamera(): Promise<string | null> {
    const cameras = await this.getAvailableCameras();
    
    // Prefer rear-facing camera (environment)
    const rearCamera = cameras.find(camera => 
      camera.label.toLowerCase().includes('back') ||
      camera.label.toLowerCase().includes('rear') ||
      camera.label.toLowerCase().includes('environment')
    );
    
    if (rearCamera) {
      this.state.selectedDeviceId = rearCamera.deviceId;
      return rearCamera.deviceId;
    }
    
    // Fallback to first available camera
    if (cameras.length > 0) {
      this.state.selectedDeviceId = cameras[0].deviceId;
      return cameras[0].deviceId;
    }
    
    return null;
  }

  calculateAspectRatio(width: number, height: number): number {
    if (height === 0) return 16/9; // Default fallback
    return width / height;
  }

  maintainAspectRatio(containerWidth: number, containerHeight: number, videoAspectRatio: number): { width: number; height: number } {
    const containerAspectRatio = containerWidth / containerHeight;
    
    if (videoAspectRatio > containerAspectRatio) {
      // Video is wider than container
      return {
        width: containerWidth,
        height: containerWidth / videoAspectRatio
      };
    } else {
      // Video is taller than container
      return {
        width: containerHeight * videoAspectRatio,
        height: containerHeight
      };
    }
  }

  async capturePhoto(videoElement: HTMLVideoElement): Promise<string | null> {
    try {
      if (!this.state.stream || !this.state.isPermissionGranted) {
        throw new Error('Camera not available or permission not granted');
      }

      // Create canvas to capture the frame
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) {
        throw new Error('Canvas context not available');
      }

      // Set canvas dimensions to match video
      canvas.width = videoElement.videoWidth || 640;
      canvas.height = videoElement.videoHeight || 480;

      // Draw the current video frame to canvas
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      // Convert to base64 data URL optimized for OCR
      const imageData = canvas.toDataURL('image/png', 0.9);
      
      return imageData;
    } catch (error) {
      const cameraError: CameraError = {
        type: 'unknown',
        message: error instanceof Error ? error.message : 'Photo capture failed'
      };
      
      this.state.error = cameraError;
      return null;
    }
  }

  getState(): CameraState {
    return { ...this.state };
  }

  cleanup(): void {
    if (this.state.stream) {
      this.state.stream.getTracks().forEach(track => track.stop());
      this.state.stream = null;
    }
  }
}