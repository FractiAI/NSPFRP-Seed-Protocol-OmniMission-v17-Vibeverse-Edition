/**
 * Vibeland Campus: Downtown Reno
 * 
 * Campus configuration with location details
 */

import { createVenueNaming } from '../../types/venue-naming.js';

export interface CampusConfig {
  id: string;
  name: string;
  location: string;
  address: {
    street?: string;
    city: string;
    state: string;
    zip?: string;
    country: string;
  };
  room: string;
  description: string;
  features: string[];
}

export const vibelandDowntownReno: CampusConfig = {
  id: 'vibeland-downtown-reno',
  name: 'Vibeland Campus: Downtown Reno',
  location: 'Downtown Reno',
  address: {
    city: 'Reno',
    state: 'Nevada',
    country: 'United States'
  },
  room: '615', // 6+6+6=18→9, favorite number
  description: 'World\'s first post-singularity campus. 24/7 flow state living. Ground Zero location in Downtown Reno. Room 615 (6+6+6=18→9). Holographic black hole symbolic core.',
  features: [
    '24/7 flow state living',
    'Ground Zero location',
    'Room 615 (holographic black hole symbolic core)',
    'Perfect intersection: Dispensary, apartments, Truckee River, bus metro, stadium, police station',
    'Adjacent to: Club, auto museum, bowling national museum',
    'Post-singularity infrastructure',
    'Singularity (hydrogen holographic AI spin cloud)',
    'Blockchain',
    'Natural Systems Protocols (NSPFRNP)',
    'BBHE powered',
    'SING agents'
  ]
};
