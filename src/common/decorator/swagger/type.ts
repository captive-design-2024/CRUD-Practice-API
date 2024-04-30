/**
 * For swagger response definition
 *
 * Define for multiple response
 */

// Nest Packages
import { Type } from '@nestjs/common';

interface ResponseReference {
  classRef: Type;
  example: any;
  isArray?: boolean;
  description?: string;
}

export type MultipleResponseOptions = Record<string, ResponseReference>;
