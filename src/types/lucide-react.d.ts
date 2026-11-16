declare module 'lucide-react' {
  import * as React from 'react';

  export interface LucideProps extends React.SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
    className?: string;
  }

  export type Icon = React.ForwardRefExoticComponent<
    LucideProps & React.RefAttributes<SVGSVGElement>
  >;

  export const ArrowLeft: Icon;
  export const ArrowRight: Icon;
  export const ArrowUpRight: Icon;
  export const Award: Icon;
  export const BarChart3: Icon;
  export const Binary: Icon;
  export const BookOpen: Icon;
  export const Briefcase: Icon;
  export const Calendar: Icon;
  export const Check: Icon;
  export const CheckCircle: Icon;
  export const CheckCircle2: Icon;
  export const ChevronDown: Icon;
  export const ChevronUp: Icon;
  export const Clock: Icon;
  export const Code2: Icon;
  export const Compass: Icon;
  export const Copy: Icon;
  export const Database: Icon;
  export const Download: Icon;
  export const Edit: Icon;
  export const ExternalLink: Icon;
  export const Eye: Icon;
  export const FileCode: Icon;
  export const FileSpreadsheet: Icon;
  export const FileText: Icon;
  export const Filter: Icon;
  export const Library: Icon;
  export const Trophy: Icon;
  export const FolderGit2: Icon;
  export const FolderPlus: Icon;
  export const Globe: Icon;
  export const GraduationCap: Icon;
  export const HelpCircle: Icon;
  export const Laptop: Icon;
  export const Layers: Icon;
  export const LayoutDashboard: Icon;
  export const Loader2: Icon;
  export const Lock: Icon;
  export const LogOut: Icon;
  export const Mail: Icon;
  export const MapPin: Icon;
  export const Menu: Icon;
  export const MessageSquare: Icon;
  export const Monitor: Icon;
  export const Moon: Icon;
  export const Plus: Icon;
  export const Presentation: Icon;
  export const Quote: Icon;
  export const Search: Icon;
  export const Send: Icon;
  export const Settings: Icon;
  export const Share2: Icon;
  export const ShieldCheck: Icon;
  export const Sparkles: Icon;
  export const Star: Icon;
  export const Sun: Icon;
  export const Target: Icon;
  export const Terminal: Icon;
  export const Trash2: Icon;
  export const Upload: Icon;
  export const UserCheck: Icon;
  export const Users: Icon;
  export const Video: Icon;
  export const Wrench: Icon;
  export const X: Icon;
  export const AlertCircle: Icon;
  export const Sun: Icon;
  export const Moon: Icon;

  const icons: { [key: string]: Icon };
  export default icons;
}
