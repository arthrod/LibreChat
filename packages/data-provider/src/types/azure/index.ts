import type { ZodError } from "zod";

export type TAzureGroups = Array<{
  group: string;
  apiKey: string;
  instanceName?: string;
  deploymentName?: string;
  version?: string;
  baseURL?: string;
  additionalHeaders?: Record<string, string>;
  models: Record<string, boolean | { deploymentName?: string; version?: string }>;
  serverless?: boolean;
}>;

export type TAzureGroupMap = Record<string, {
  apiKey: string;
  instanceName?: string;
  deploymentName?: string;
  version?: string;
  baseURL?: string;
  additionalHeaders?: Record<string, string>;
  models: Record<string, boolean | { deploymentName?: string; version?: string }>;
  serverless?: boolean;
}>;

export type TAzureModelGroupMap = Record<string, {
  group: string;
}>;

export type TValidatedAzureConfig = {
  isValid: boolean;
  modelNames: string[];
  modelGroupMap: TAzureModelGroupMap;
  groupMap: TAzureGroupMap;
  errors: (ZodError | string)[];
};

export type TAzureConfigValidationResult = TValidatedAzureConfig;

import { z } from "zod";

export const azureGroupConfigsSchema = z.array(z.object({
  group: z.string(),
  apiKey: z.string(),
  instanceName: z.string().optional(),
  deploymentName: z.string().optional(),
  version: z.string().optional(),
  baseURL: z.string().optional(),
  additionalHeaders: z.record(z.string()).optional(),
  models: z.record(z.union([z.boolean(), z.object({
    deploymentName: z.string().optional(),
    version: z.string().optional()
  })])),
  serverless: z.boolean().optional()
}));
