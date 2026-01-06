
export interface StatCardProps {
  icon: string;
  title: string;
  value: number;
  goal: number;
  period: string;
  isActionable?: boolean;
  actionText?: string;
  actionIcon?: string;
  onIncrement: () => void;
  onDecrement: () => void;
}

export interface GoalProgressProps {
  title: string;
  description: string;
  value: number;
  goal: number;
  isCompleted?: boolean;
  onIncrement?: () => void;
  onDecrement?: () => void;
}

export interface RoadmapChallenge {
  id: string;
  text: string;
  completed: boolean;
  category: 'venta' | 'habito' | 'formacion';
}

export interface RoadmapStep {
  month: number;
  title: string;
  description: string;
  status: 'completed' | 'active' | 'locked';
  icon: string;
  challenges: RoadmapChallenge[];
}

export interface Habit {
  id: number;
  text: string;
  completed: boolean;
}

export interface User {
  name: string;
  title: string;
  email: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface RegisteredUser extends RegisterCredentials {
  title: string;
}

export interface DailyStats {
  contacts: number;
  appointments: number;
  demos: number;
  closes: number;
}

export interface WeeklyStats {
  carSales: number;
  motorcycleSales: number;
  qualifiedGuests: number;
  attendedDays: string[]; // Lista de fechas ISO (YYYY-MM-DD)
}

export interface Goals {
  daily: DailyStats;
  weekly: WeeklyStats;
}

export type SaleStatus = 'paid' | 'pending' | 'cancelled';

export interface SaleRecord {
  id: string;
  customerName: string;
  phone: string;
  vehicleType: 'car' | 'motorcycle';
  date: string;
  status: SaleStatus;
}

export interface UserData {
  stats: DailyStats;
  weeklyStats: WeeklyStats;
  goals: Goals;
  roadmapProgress: Record<string, boolean>; // challengeId -> completed
  salesRecords: SaleRecord[];
  lastUpdated: string;
}

export interface CalendarEvent {
  id: string;
  date: string; // ISO format YYYY-MM-DD
  title: string;
  type: 'Cita' | 'Demo' | 'Cierre';
}
