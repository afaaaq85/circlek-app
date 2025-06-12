import { BarChart3, FileText, Fuel, Database, MapPin, Calendar, Send, Settings } from "lucide-react-native";

export const superadminOptions = [
  {
    id: 1,
    title: 'Add/Edit Pipeline',
    subtitle: 'Create and manage pipeline data',
    icon: Fuel,
    enabled: true,
    color: '#DC2626',
  },
  {
    id: 2,
    title: 'User Management',
    subtitle: 'Add or remove admins/agents',
    icon: Settings,
    enabled: false,
    color: '#1D4ED8',
  },
  {
    id: 3,
    title: 'Pipeline Status Overview',
    subtitle: 'Track status of all pipelines',
    icon: BarChart3,
    enabled: false,
    color: '#059669',
  },
  {
    id: 4,
    title: 'Audit Logs',
    subtitle: 'Track changes and user activity',
    icon: FileText,
    enabled: false,
    color: '#F59E0B',
  },
];

export const  adminOptions = [
  {
    id: 1,
    title: 'Review Pipeline Entries',
    subtitle: 'View & update submitted data',
    icon: Fuel,
    enabled: true,
    color: '#DC2626',
  },
  {
    id: 2,
    title: 'Approve & Promote',
    subtitle: 'Move pipelines to active status',
    icon: Send,
    enabled: true,
    color: '#4F46E5',
  },
  {
    id: 3,
    title: 'Data Validation',
    subtitle: 'Verify information collected by agents',
    icon: Database,
    enabled: false,
    color: '#16A34A',
  },
  {
    id: 4,
    title: 'Station Overview',
    subtitle: 'Real estate and fuel station details',
    icon: MapPin,
    enabled: false,
    color: '#F97316',
  },
];


export const agentOptions = [
  {
    id: 1,
    title: 'Submit New Pipeline',
    subtitle: 'Add on-site station data',
    icon: Fuel,
    enabled: true,
    color: '#DC2626',
  },
  {
    id: 2,
    title: 'My Submissions',
    subtitle: 'Track your submitted entries',
    icon: FileText,
    enabled: true,
    color: '#10B981',
  },
  {
    id: 3,
    title: 'Schedule Visits',
    subtitle: 'Plan future station visits',
    icon: Calendar,
    enabled: false,
    color: '#3B82F6',
  },
  {
    id: 4,
    title: 'Station Locator',
    subtitle: 'Navigate to assigned stations',
    icon: MapPin,
    enabled: false,
    color: '#F59E0B',
  },
];

export const viewerOptions = [
  {
    id: 1,
    title: 'View Pipeline Dashboard',
    subtitle: 'Track live pipeline status',
    icon: BarChart3,
    enabled: false,
    color: '#6D28D9',
  },
  {
    id: 2,
    title: 'Station Listings',
    subtitle: 'Explore fuel station & land data',
    icon: MapPin,
    enabled: true,
    color: '#10B981',
  },
  {
    id: 3,
    title: 'Reports Archive',
    subtitle: 'Access downloadable reports',
    icon: FileText,
    enabled: false,
    color: '#F59E0B',
  },
  {
    id: 4,
    title: 'Analytics View',
    subtitle: 'Fuel & real estate performance',
    icon: BarChart3,
    enabled: false,
    color: '#2563EB',
  },
];

