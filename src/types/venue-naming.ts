/**
 * Venue Dual Naming System
 * 
 * Every venue has two names:
 * 1. Vibeverse Name - The brand name (e.g., "Man Cave + Cabaret")
 * 2. Local Venue Name - The actual location hosting it (e.g., "The Men's Club Reno")
 * 
 * This allows Vibeverse experiences to naturally overlay anywhere,
 * maintaining brand identity while respecting local venue identity.
 */

export interface VenueNaming {
  /** Vibeverse brand name - the experience name */
  vibeverseName: string;
  
  /** Local venue name - the physical location hosting it */
  localVenueName: string;
  
  /** Full display name combining both */
  displayName: string;
  
  /** Short name for UI (can be either) */
  shortName?: string;
}

/**
 * Create venue naming from components
 */
export function createVenueNaming(
  vibeverseName: string,
  localVenueName: string,
  shortName?: string
): VenueNaming {
  return {
    vibeverseName,
    localVenueName,
    displayName: `${vibeverseName} at ${localVenueName}`,
    shortName: shortName || vibeverseName
  };
}

/**
 * Parse venue name into components
 * Handles formats like:
 * - "Man Cave + Cabaret at The Men's Club Reno"
 * - "Man Cave + Cabaret" (if no local venue specified)
 */
export function parseVenueName(fullName: string): VenueNaming {
  const atIndex = fullName.indexOf(' at ');
  
  if (atIndex === -1) {
    // No local venue specified, use vibeverse name for both
    return {
      vibeverseName: fullName,
      localVenueName: fullName,
      displayName: fullName,
      shortName: fullName
    };
  }
  
  const vibeverseName = fullName.substring(0, atIndex);
  const localVenueName = fullName.substring(atIndex + 4);
  
  return {
    vibeverseName,
    localVenueName,
    displayName: fullName,
    shortName: vibeverseName
  };
}

/**
 * Format venue name for display
 */
export function formatVenueName(naming: VenueNaming, format: 'full' | 'short' | 'vibeverse' | 'local' = 'full'): string {
  switch (format) {
    case 'full':
      return naming.displayName;
    case 'short':
      return naming.shortName || naming.vibeverseName;
    case 'vibeverse':
      return naming.vibeverseName;
    case 'local':
      return naming.localVenueName;
    default:
      return naming.displayName;
  }
}
