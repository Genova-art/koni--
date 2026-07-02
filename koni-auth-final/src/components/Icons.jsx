// Centralized SVG icon library — ganti semua emoji jadi icon resmi SVG
// Semua icon menggunakan lucide-react + custom SVG untuk olahraga

export {
  Trophy,
  Medal,
  Users,
  MapPin,
  Calendar,
  Globe,
  ChevronDown,
  ChevronRight,
  Search,
  X,
  ArrowUp,
  Sun,
  Moon,
  Bell,
  Share2,
  Copy,
  ExternalLink,
  Flame,
  Shield,
  Star,
  TrendingUp,
  BarChart2,
  Award,
  Target,
  Flag,
  Activity,
  Zap,
  ChevronLeft,
  Menu,
  LogOut,
  User,
  Home,
  FileText,
  Phone,
  Mail,
} from "lucide-react";

// Custom sport SVG icons
export function BadmintonIcon({ size = 24, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="6" r="3" />
      <path d="M15.5 8.5 L6 18" />
      <path d="M4 20 L6 18 M6 18 L8 20" />
      <path d="M12 6 L16 10" strokeDasharray="2 1.5" />
    </svg>
  );
}

export function WeightliftingIcon({ size = 24, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="9" width="3" height="6" rx="1" />
      <rect x="4" y="10" width="2" height="4" rx="0.5" />
      <line x1="6" y1="12" x2="18" y2="12" />
      <rect x="18" y="10" width="2" height="4" rx="0.5" />
      <rect x="20" y="9" width="3" height="6" rx="1" />
      <circle cx="12" cy="8" r="2.5" fill={color} opacity="0.3" />
      <path d="M10 8 L10 12 M14 8 L14 12" strokeWidth="1.5" />
    </svg>
  );
}

export function SilverMedalIcon({ size = 24, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="15" r="7" stroke={color} strokeWidth="1.8" fill="none" />
      <path d="M9 13 C9 11.5 10 10.5 12 10.5 C14 10.5 15 11.5 15 13 C15 14.5 13 15.5 12 16.5 L9 19 L15 19" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M10 5 L12 2 L14 5" stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <line x1="10" y1="5" x2="14" y2="5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function OlympicTorchIcon({ size = 24, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3 C11 5 9 6.5 10 9 C11 11.5 12 12 12 12 C12 12 13 11.5 14 9 C15 6.5 13 5 12 3Z" fill={color} opacity="0.85" />
      <rect x="10.5" y="12" width="3" height="8" rx="1.5" stroke={color} strokeWidth="1.6" fill="none" />
      <path d="M9 20 L15 20" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function StadiumIcon({ size = 24, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10 C3 6 7 4 12 4 C17 4 21 6 21 10" />
      <path d="M3 10 L3 16 C3 18 7 19 12 19 C17 19 21 18 21 16 L21 10" />
      <path d="M6 10 L6 16 M18 10 L18 16" />
      <ellipse cx="12" cy="10" rx="4" ry="2" />
    </svg>
  );
}

export function MedalGoldIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="15" r="7" fill="url(#goldGrad)" stroke="#B8960C" strokeWidth="1.5" />
      <path d="M12 11 L13.1 13.5 L16 13.8 L14 15.7 L14.5 18.5 L12 17.1 L9.5 18.5 L10 15.7 L8 13.8 L10.9 13.5 Z" fill="#B8960C" opacity="0.9" />
      <path d="M10 5 L12 2 L14 5" stroke="#B8960C" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <line x1="10" y1="5" x2="14" y2="5" stroke="#B8960C" strokeWidth="1.8" strokeLinecap="round" />
      <defs>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#FDE68A" />
          <stop offset="1" stopColor="#D97706" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Map: emoji → lucide/custom component for easy replacement
export const SPORT_ICONS = {
  badminton: BadmintonIcon,
  weightlifting: WeightliftingIcon,
  torch: OlympicTorchIcon,
  stadium: StadiumIcon,
};
