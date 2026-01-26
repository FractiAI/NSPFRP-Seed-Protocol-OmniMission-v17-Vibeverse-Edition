/**
 * Man Cave + Cabaret at The Men's Club Reno
 * 
 * Venue configuration with dual naming system
 */

import { createVenueNaming } from '../../types/venue-naming.js';
import { VenueConfig } from '../../enterprise/sales-console.js';
import { AwarenessOctave } from '../../types/index.js';

export const manCaveCabaretReno: VenueConfig = {
  id: 'man-cave-cabaret-reno',
  naming: createVenueNaming(
    'Man Cave + Cabaret',      // Vibeverse brand name
    'The Men\'s Club Reno'     // Local venue hosting it
  ),
  name: 'Man Cave + Cabaret at The Men\'s Club Reno',
  type: 'venue',
  heroHostPersona: 'venue-persona',
  transmissionGear: AwarenessOctave.RESONANCE,
  revenuePlan: {
    monthlyAccessFee: 0, // TBD
    revenueSharePercent: 0, // TBD
    bonusParticipation: false,
    currency: 'USD'
  },
  metadata: {
    location: 'Reno, Nevada',
    specialty: 'VIP Members Only Club',
    description: 'Man Cave + Cabaret at The Men\'s Club Reno - Where Legends Gather',
    access: 'VIP Members Only',
    features: [
      'Man Cave conversation space',
      'Cabaret entertainment',
      'VIP members-only access',
      'Post-Singularity∞ experience'
    ]
  }
};
