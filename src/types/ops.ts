export interface VerificationFunnel {
  fully_verified: number;
  semi_verified: number;
  pending_id_card: number;
}

export interface KpiData {
  online_now: number;
  today_dau: number;
  dau_growth_pct: number;
  avg_session_duration_mins: number;
  verification_funnel: VerificationFunnel;
}

export interface HourlyHeatmap {
  hour: string;
  active_users: number;
  tag?: string | null;
}

export interface StudentTelemetry {
  id: string;
  student_name: string;
  roll_no: string;
  college: string;
  year: string;
  section: string;
  in_time: string;
  out_time: string;
  duration: string;
  status: "online" | "offline";
}

export interface CommunityRadarData {
  posts_today: number;
  polls_voted_today: number;
  chat_messages_today: number;
}

export interface ReportedPost {
  id: number;
  content: string;
  is_anonymous: boolean;
  author_id: number;
  author_roll: string;
  author_name: string;
  author_email?: string;
  reports_count: number;
  reasons: string[];
  is_hidden: boolean;
  created_at: string;
}

export interface ModerationStats {
  pending_reports: number;
  auto_hidden_posts: number;
  doxxing_attempts_blocked: number;
  banned_users: number;
}


export interface OpsOverviewResponse {
  status: "success" | "fallback";
  timestamp: string;
  is_mock?: boolean;
  kpis: KpiData;
  campus_peak_hours: HourlyHeatmap[];
  telemetry: StudentTelemetry[];
  community_radar: CommunityRadarData;
}
