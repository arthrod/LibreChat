import { z } from 'zod';

export enum OptionTypes {
  Custom = 'custom',
  Conversation = 'conversation',
  Model = 'model'
}

export type Setting = {
  key: string;
  description?: string;
  type: 'number' | 'boolean' | 'string' | 'enum' | 'array';
  default?: any;
  range?: { min: number; max: number; step?: number };
  component: 'slider' | 'switch' | 'input' | 'dropdown' | 'checkbox' | 'textarea' | 'tags';
  optionType?: OptionTypes;
  columns?: number;
  columnSpan?: number;
  label?: string;
  placeholder?: string;
  minText?: number;
  maxText?: number;
  options?: string[];
  enumMappings?: Record<string, string>;
  minTags?: number;
  maxTags?: number;
};

export type SettingsConfiguration = Setting[];

export function validateSettingDefinitions(settings: SettingsConfiguration): void {
  const errors: z.ZodIssue[] = [];
  const defaultColumns = 2;
  let columns = defaultColumns;

  // Validate columns
  const columnsSet = new Set<number>();
  for (const setting of settings) {
    if (setting.columns !== undefined) {
      if (setting.columns < 1 || setting.columns > 4) {
        errors.push({
          code: z.ZodIssueCode.custom,
          message: `Invalid columns value for setting ${setting.key}. Must be between 1 and 4.`,
          path: ['columns'],
        });
      } else {
        columnsSet.add(setting.columns);
      }
    }
  }

  // Set columns to the single value if all settings use the same value, otherwise use default
  if (columnsSet.size === 1) {
    const value = columnsSet.values().next().value;
    if (value !== undefined) {
      columns = value;
    }
  }

  for (const setting of settings) {
    // Default columnSpan to half of columns (or 1 if columns is 1)
    if (!setting.columnSpan) {
      setting.columnSpan = columns === 1 ? 1 : Math.floor(columns / 2);
    }
  }

  if (errors.length > 0) {
    throw new z.ZodError(errors);
  }
}

export function generateDynamicSchema(settings: SettingsConfiguration) {
  const schemaShape: Record<string, z.ZodTypeAny> = {};

  for (const setting of settings) {
    let fieldSchema: z.ZodTypeAny;

    switch (setting.type) {
      case 'number':
        fieldSchema = z.number();
        if (setting.range) {
          fieldSchema = (fieldSchema as z.ZodNumber).min(setting.range.min).max(setting.range.max);
        }
        break;
      case 'boolean':
        fieldSchema = z.boolean();
        break;
      case 'string':
        fieldSchema = z.string();
        if (setting.minText !== undefined) {
          fieldSchema = (fieldSchema as z.ZodString).min(setting.minText);
        }
        if (setting.maxText !== undefined) {
          fieldSchema = (fieldSchema as z.ZodString).max(setting.maxText);
        }
        break;
      case 'enum':
        if (!setting.options || setting.options.length < 2) {
          throw new Error(`Enum setting ${setting.key} must have at least 2 options`);
        }
        fieldSchema = z.enum(setting.options as [string, ...string[]]);
        break;
      case 'array':
        fieldSchema = z.array(z.string());
        if (setting.minTags !== undefined) {
          fieldSchema = (fieldSchema as z.ZodArray<z.ZodString>).min(setting.minTags);
        }
        if (setting.maxTags !== undefined) {
          fieldSchema = (fieldSchema as z.ZodArray<z.ZodString>).max(setting.maxTags);
        }
        break;
      default:
        throw new Error(`Unsupported setting type: ${setting.type}`);
    }

    // Add default value if provided
    if (setting.default !== undefined) {
      fieldSchema = fieldSchema.default(setting.default);
    }

    schemaShape[setting.key] = fieldSchema;
  }

  return z.object(schemaShape);
}

// Add export keywords to all the types and enums that need to be exposed
export type ComponentType =
  | 'input'
  | 'textarea'
  | 'slider'
  | 'checkbox'
  | 'switch'
  | 'dropdown'
  | 'combobox'
  | 'tags';

export type OptionType = 'conversation' | 'model' | 'custom';

export type Option = Record<string, unknown> & {
  label?: string;
  value: string | number | null;
};

export enum ComponentTypes {
  Input = 'input',
  Textarea = 'textarea',
  Slider = 'slider',
  Checkbox = 'checkbox',
  Switch = 'switch',
  Dropdown = 'dropdown',
  Combobox = 'combobox',
  Tags = 'tags',
}

export interface SettingDefinition {
  // ... interface definition ...
}

export type DynamicSettingProps = Partial<SettingDefinition> & {
  // ... type definition ...
};