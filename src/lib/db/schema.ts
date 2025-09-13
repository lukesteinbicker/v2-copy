import { Generated, Insertable, Selectable, Updateable } from 'kysely';

export interface Database {
  user: UserTable;
  session: SessionTable;
  account: AccountTable;
  verification: VerificationTable;
  companies: CompaniesTable;
  embedTokens: EmbedTokensTable;
  visitors: VisitorsTable;
  leads: LeadsTable;
  calls: CallsTable;
  visitorHistory: VisitorHistoryTable;
}

export interface UserTable {
  id: string;
  name: string;
  username: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: "admin" | "user";
  companyId: string; // Foreign key to companies.id
  bannerImage: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  active: boolean;
  premium: boolean;
  premiumExpiresAt: Date | null;
  communications: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionTable {
  id: string;
  userId: string; // Foreign key to user.id
  token: string;
  expiresAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountTable {
  id: string;
  userId: string; // Foreign key to user.id
  accountId: string;
  providerId: string;
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExpiresAt: Date | null;
  refreshTokenExpiresAt: Date | null;
  scope: string | null;
  idToken: string | null;
  password: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface VerificationTable {
  id: string;
  identifier: string;
  value: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompaniesTable {
  id: string;
  name: string;
  domain: string | null;
  website: string | null;
  industry: string | null;
  size: string | null; // e.g., "1-10", "11-50", "51-200", "200+"
  logo: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zip: string | null;
  phone: string | null;
  active: boolean;
  premium: boolean;
  premiumExpiresAt: Date | null;
  settings: any | null; // JSON for company-specific settings
  createdAt: Date;
  updatedAt: Date;
}

export interface EmbedTokensTable {
  id: string;
  companyId: string; // Foreign key to companies.id
  token: string; // Unique embed token
  name: string; // Token name/description
  active: boolean;
  allowedDomains: string[] | null; // Array of allowed domains
  expiresAt: Date | null;
  lastUsedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;

export type Session = Selectable<SessionTable>;
export type NewSession = Insertable<SessionTable>;
export type SessionUpdate = Updateable<SessionTable>;

export type Account = Selectable<AccountTable>;
export type NewAccount = Insertable<AccountTable>;
export type AccountUpdate = Updateable<AccountTable>;

export type Verification = Selectable<VerificationTable>;
export type NewVerification = Insertable<VerificationTable>;
export type VerificationUpdate = Updateable<VerificationTable>;

export type Companies = Selectable<CompaniesTable>;
export type NewCompanies = Insertable<CompaniesTable>;
export type CompaniesUpdate = Updateable<CompaniesTable>;

export type EmbedTokens = Selectable<EmbedTokensTable>;
export type NewEmbedTokens = Insertable<EmbedTokensTable>;
export type EmbedTokensUpdate = Updateable<EmbedTokensTable>;

export interface VisitorsTable {
  id: string;
  companyId: string; // Foreign key to companies.id
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  referrer: string | null;
  utmParams: any; // JSON type
  enriched: boolean;
  enrichmentData: any | null; // JSON type
  currentPage: string | null;
  online: boolean;
  startedAt: Date;
  lastActivity: Date;
}

export interface LeadsTable {
  id: string;
  companyId: string; // Foreign key to companies.id
  visitorId: string; // Foreign key to visitors.id
  status: 'open' | 'claimed' | 'locked' | 'closed';
  claimedBy: string | null; // Foreign key to user.id
  claimAt: Date | null;
  slackId: string | null;
  callId: string | null; // Foreign key to calls.id
  callStatus: 'not_started' | 'in_progress' | 'finished';
  notes: string | null;
}

export interface CallsTable {
  id: string;
  companyId: string; // Foreign key to companies.id
  leadId: string; // Foreign key to leads.id
  dailyRoomId: string;
  startedAt: Date;
  endedAt: Date | null;
  transcriptUrl: string | null;
  recordingUrl: string | null;
  summary: string | null;
}

export interface VisitorHistoryTable {
  id: string;
  visitorId: string; // Foreign key to visitors.id
  responseTime: number | null; // Seconds/minutes to first contact
  callDuration: number | null; // Seconds/minutes in call
  outcome: 'sales_routed' | 'scheduled' | 'closed' | 'missed';
}

export type Visitors = Selectable<VisitorsTable>;
export type NewVisitors = Insertable<VisitorsTable>;
export type VisitorsUpdate = Updateable<VisitorsTable>;

export type Leads = Selectable<LeadsTable>;
export type NewLeads = Insertable<LeadsTable>;
export type LeadsUpdate = Updateable<LeadsTable>;

export type Calls = Selectable<CallsTable>;
export type NewCalls = Insertable<CallsTable>;
export type CallsUpdate = Updateable<CallsTable>;

export type VisitorHistory = Selectable<VisitorHistoryTable>;
export type NewVisitorHistory = Insertable<VisitorHistoryTable>;
export type VisitorHistoryUpdate = Updateable<VisitorHistoryTable>;