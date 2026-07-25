export type SceneType = "website" | "healing" | "auth" | "dashboard_coming_soon" | "dashboard";

export interface UserProfile {
  username: string;
  email: string;
  ecoPoints: number;
  scannedItemsCount: number;
  rank: string;
  joinedAt: string;
}

export interface LeafParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotSpeed: number;
  opacity: number;
}

export interface FireflyParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  pulseSpeed: number;
}

export interface RippleEffect {
  id: number;
  x: number;
  y: number;
  scale: number;
  opacity: number;
}
