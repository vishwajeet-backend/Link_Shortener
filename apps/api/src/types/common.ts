import { Types } from "mongoose";

export const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER"
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const USER_STATUS = {
  ACTIVE: "ACTIVE",
  BANNED: "BANNED",
  DELETED: "DELETED"
} as const;

export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

export const URL_STATUS = {
  ACTIVE: "ACTIVE",
  PAUSED: "PAUSED",
  DELETED: "DELETED"
} as const;

export type UrlStatus = (typeof URL_STATUS)[keyof typeof URL_STATUS];

export const EMAIL_EVENT_TYPE = {
  URL_PAUSED: "URL_PAUSED",
  URL_ACTIVATED: "URL_ACTIVATED",
  URL_DELETED: "URL_DELETED"
} as const;

export type EmailEventType =
  (typeof EMAIL_EVENT_TYPE)[keyof typeof EMAIL_EVENT_TYPE];

export const EMAIL_DELIVERY_STATUS = {
  PENDING: "PENDING",
  SENT: "SENT",
  FAILED: "FAILED"
} as const;

export type EmailDeliveryStatus =
  (typeof EMAIL_DELIVERY_STATUS)[keyof typeof EMAIL_DELIVERY_STATUS];

export type MongoId = Types.ObjectId;
