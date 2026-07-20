import {
  Activity,
  Award,
  Briefcase,
  Eye,
  FileText,
  FolderOpen,
  HeartHandshake,
  Home,
  LifeBuoy,
  MessageSquare,
  Scale,
  ShieldCheck,
  Stamp,
  Target,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  Briefcase,
  MessageSquare,
  FileText,
  Target,
  Scale,
  Stamp,
  FolderOpen,
  Home,
  Activity,
  Users,
  Eye,
  ShieldCheck,
  HeartHandshake,
  LifeBuoy,
  Award,
  Zap,
};

export function getIcon(name: string): LucideIcon {
  return map[name] ?? Briefcase;
}
