export const colors = {
  bg: "#0B1120", // Çok koyu mavi/siyah arka plan
  surface: "#1E293B", // Kartlar için biraz daha açık arka plan
  surfaceHighlight: "#334155", // Hover/Press durumları için
  textPrimary: "#F8FAFC", // Beyaza yakın parlak metin
  textSecondary: "#94A3B8", // Gri yardımcı metin
  textMuted: "#64748B", // Çok sönük metin
  border: "rgba(255, 255, 255, 0.08)", // Yarı saydam ince kenarlık
  primary: "#3B82F6", // Canlı mavi (Accent)
  primarySoft: "rgba(59, 130, 246, 0.15)", // Yarı saydam mavi
  success: "#10B981", // Canlı neon yeşil
  danger: "#EF4444", // Canlı kırmızı
  warning: "#F59E0B"
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
