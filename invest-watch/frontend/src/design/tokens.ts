export const colors = {
  bg: "#F2F4F7", // Very light gray/blue background (Neobank style)
  surface: "#FFFFFF", 
  surfaceHighlight: "#F8FAFC", 
  textPrimary: "#111827", // Almost black for extreme readability
  textSecondary: "#6B7280", 
  textMuted: "#9CA3AF", 
  border: "#E5E7EB", // Solid light gray border
  primary: "#000000", // Black primary buttons (super premium)
  primarySoft: "rgba(0, 0, 0, 0.05)",
  secondary: "#3B82F6", // Bright blue accent for links/highlights
  success: "#10B981", 
  danger: "#EF4444", 
  warning: "#F59E0B",
  glassBg: "rgba(255, 255, 255, 0.95)", 
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
