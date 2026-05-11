export const colors = {
  bg: "#F8FAFC", // Premium off-white background
  surface: "#FFFFFF", // Pure white for cards and floating items
  surfaceHighlight: "#F1F5F9", // Soft gray for active states
  textPrimary: "#0F172A", // Deep slate for high contrast text
  textSecondary: "#475569", // Gray for secondary text
  textMuted: "#94A3B8", // Lighter gray for muted text
  border: "rgba(0, 0, 0, 0.06)", // Very subtle dark border
  primary: "#2563EB", // Vibrant blue accent
  primarySoft: "rgba(37, 99, 235, 0.1)", // Light blue tint
  secondary: "#7C3AED", // Vibrant purple accent
  success: "#10B981", 
  danger: "#EF4444", 
  warning: "#F59E0B",
  glassBg: "rgba(255, 255, 255, 0.9)", // Glassmorphism light base
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
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5
  },
  glow: {
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8
  }
};
