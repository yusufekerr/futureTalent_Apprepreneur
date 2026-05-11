export const colors = {
  bg: "#050B14", // Deeper, more luxurious dark blue/black
  surface: "#0F172A", // Richer surface color
  surfaceHighlight: "#1E293B", // Softer highlight
  textPrimary: "#F8FAFC", 
  textSecondary: "#94A3B8", 
  textMuted: "#475569", 
  border: "rgba(255, 255, 255, 0.05)", // More subtle border
  primary: "#3B82F6", // Vibrant accent
  primarySoft: "rgba(59, 130, 246, 0.15)",
  secondary: "#8B5CF6", // Purple accent for gradients
  success: "#10B981", 
  danger: "#EF4444", 
  warning: "#F59E0B",
  glassBg: "rgba(15, 23, 42, 0.8)", // Glassmorphism base
};

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 32
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999
};

export const typography = {
  h1: 32,
  h2: 24,
  h3: 18,
  body: 15,
  caption: 13
};

export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5
  },
  glow: {
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10
  }
};
