export type AdminSmtpSettings = {
  host?: string;
  port?: number;
  secure?: boolean;
  user?: string;
  pass?: string;
  fromEmail?: string;
  fromName?: string;
};

export type AdminSettings = {
  maintenanceMode: boolean;
  maintenanceMessage?: string;
  allowedDomains: string[];
  smtp: AdminSmtpSettings;
  updatedAt: Date;
};

export type UpdateAdminSettingsInput = {
  maintenanceMode?: boolean;
  maintenanceMessage?: string;
  allowedDomains?: string[];
  smtp?: AdminSmtpSettings;
};
