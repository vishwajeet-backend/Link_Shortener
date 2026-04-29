import { model, models, Schema } from "mongoose";

export interface AdminSettingDocument {
  maintenanceMode: boolean;
  maintenanceMessage?: string;
  allowedDomains: string[];
  smtp: {
    host?: string;
    port?: number;
    secure?: boolean;
    user?: string;
    pass?: string;
    fromEmail?: string;
    fromName?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const adminSettingSchema = new Schema<AdminSettingDocument>(
  {
    maintenanceMode: { type: Boolean, default: false },
    maintenanceMessage: { type: String, trim: true, maxlength: 500 },
    allowedDomains: { type: [String], default: [] },
    smtp: {
      host: { type: String, trim: true },
      port: { type: Number },
      secure: { type: Boolean },
      user: { type: String, trim: true },
      pass: { type: String, trim: true },
      fromEmail: { type: String, trim: true },
      fromName: { type: String, trim: true }
    }
  },
  { timestamps: true, versionKey: false }
);

adminSettingSchema.index({ updatedAt: -1 }, { name: "idx_admin_settings_updated" });

export const AdminSettingModel =
  models.AdminSetting || model<AdminSettingDocument>("AdminSetting", adminSettingSchema);
