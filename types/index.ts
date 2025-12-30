export interface CameraInterfaceProps {
  onCapture: (imageData: string) => void;
  onError: (error: CameraError) => void;
}

export interface CameraError {
  type: 'permission_denied' | 'device_not_found' | 'unknown';
  message: string;
}

export interface CameraDevice {
  deviceId: string;
  kind: 'videoinput' | 'audioinput' | 'audiooutput';
  label: string;
  groupId: string;
}

export interface CameraConstraints {
  video: {
    deviceId?: string;
    facingMode?: 'user' | 'environment';
    width?: number;
    height?: number;
    aspectRatio?: number;
  };
}

export interface CameraState {
  isPermissionGranted: boolean;
  hasCamera: boolean;
  selectedDeviceId: string | null;
  stream: MediaStream | null;
  aspectRatio: number;
  error: CameraError | null;
}