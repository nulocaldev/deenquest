/**
 * Content types for the unlocking system
 */

/**
 * Content unlock engine result
 */
export interface ContentUnlockResult {
  unlocked: boolean;
  content: UnlockableContent;
  reason: string;
  priority: number;
  recommendedTiming: string;
}

/**
 * Unlockable content object
 */
export interface UnlockableContent {
  id: string;
  content_type: string;
  title: string;
  description: string;
  content_data: Record<string, any>;
  unlock_conditions: Record<string, any>;
  spiritual_themes: string[];
  islamic_topics?: string[];
  difficulty_level?: number;
  unlock_priority?: number;
}
