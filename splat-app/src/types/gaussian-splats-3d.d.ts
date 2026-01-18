declare module '@mkkellogg/gaussian-splats-3d' {
  import * as THREE from 'three';

  export class Viewer {
    constructor(options?: {
      cameraUp?: [number, number, number];
      initialCameraPosition?: [number, number, number];
      initialCameraLookAt?: [number, number, number];
      sharedMemoryForWorkers?: boolean;
      integerBasedSort?: boolean;
      halfPrecisionCovariancesOnGPU?: boolean;
      devicePixelRatio?: number;
      enableSIMDInSort?: boolean;
      enableOptionalEffects?: boolean;
      webXRMode?: string;
      renderMode?: string;
      sceneRevealMode?: string;
      antialiased?: boolean;
      focalAdjustment?: number;
      logLevel?: number;
      sphericalHarmonicsDegree?: number;
      enableOptionalEffects?: boolean;
    });

    addSplatScene(
      path: string,
      options?: {
        splatAlphaRemovalThreshold?: number;
        position?: [number, number, number];
        rotation?: [number, number, number, number];
        scale?: [number, number, number];
        showLoadingUI?: boolean;
        progressiveLoad?: boolean;
        onProgress?: (progress: number, message: string, stage?: string) => void;
      }
    ): Promise<void>;

    start(): void;
    stop(): void;
    dispose(): void;
    getSplatMesh(): SplatMesh | null;

    rootElement: HTMLElement;
    camera: THREE.Camera;
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    controls: any;
    splatMesh: any;
  }

  export class SplatMesh extends THREE.Object3D {
    getSplatCount(): number;
    getBoundingBox(target?: THREE.Box3, ignoreViewFrustum?: boolean): THREE.Box3;
  }

  export const SceneRevealMode: {
    Default: string;
    Instant: string;
    Gradual: string;
    FadeIn: string;
  };

  export const LogLevel: {
    None: number;
    Error: number;
    Warn: number;
    Info: number;
    Debug: number;
  };
}
