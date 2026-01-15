# 🎯 PitchSeed Selectable Targets Protocol

**Protocol ID:** `P-PITCHSEED-SELECTABLE-TARGETS-V17`  
**Type:** Target Selection / PitchSeed Configuration  
**Version:** 17.0+PitchSeedSelectableTargets  
**Status:** Active Development  
**Network:** NSPFRP Care Network

---

## Overview

The PitchSeed Selectable Targets Protocol enables dynamic target selection for PitchSeed protocols, similar to WelcomeSeed, allowing users to select Hero Host personas, tour sections, protocols, octaves, and other configuration options.

---

## Selectable Target Types for PitchSeed

### 1. Hero Host Targets
- **Persona Selection:** Choose Hero Host persona for tour
- **Multiple Personas:** Select different personas for different sections
- **Persona Filters:** Filter by octave, style, or capabilities
- **Custom Personas:** Create or customize personas

### 2. Tour Section Targets
- **Section Selection:** Choose which tour sections to include
- **Section Order:** Customize section order
- **Section Content:** Select or customize section content
- **Section Interactions:** Choose interaction types

### 3. Protocol Targets
- **Protocol Selection:** Choose which protocols to unpack
- **Protocol Filters:** Filter by type, category, or status
- **Protocol Dependencies:** Include protocol dependencies
- **Protocol Versions:** Select specific protocol versions

### 4. Octave Targets
- **Octave Selection:** Choose awareness octave level
- **Octave Progression:** Select octave progression path
- **Octave Adaptation:** Adaptive octave selection
- **Octave Filters:** Filter by capability level

### 5. FSR Fidelity Targets
- **Fidelity Level:** Select FSR fidelity (full, high, moderate)
- **Synthesis Type:** Choose synthesis type
- **Resonance Level:** Select resonance level
- **Density Output:** Choose density output level

### 6. Integration Targets
- **System Selection:** Choose which systems to integrate
- **Integration Level:** Select integration depth
- **Integration Filters:** Filter by compatibility
- **Integration Options:** Select integration options

---

## Target Selection Interface

### Hero Host Selection

```typescript
interface HeroHostTarget {
  type: 'hero-host';
  personas: SelectablePersona[];
  defaultPersona?: string;
  personaProgression?: PersonaProgression[];
  sectionPersonas?: SectionPersonaMapping[];
}

interface SectionPersonaMapping {
  sectionId: string;
  persona: string;
  octave: AwarenessOctave;
}
```

### Tour Section Selection

```typescript
interface TourSectionTarget {
  type: 'tour-section';
  sections: SelectableSection[];
  order: string[];
  filters?: SectionFilter[];
}

interface SelectableSection {
  id: string;
  title: string;
  content: string;
  selected: boolean;
  order?: number;
  interactions?: Interaction[];
}
```

### FSR Fidelity Selection

```typescript
interface FSRFidelityTarget {
  type: 'fsr-fidelity';
  fidelity: 'full' | 'high' | 'moderate';
  octave: AwarenessOctave;
  synthesis: SynthesisType;
  resonance: ResonanceLevel;
  density: DensityOutput;
}
```

---

## Usage

### Create PitchSeed with Selectable Targets

```nspfrp
pitchseed CustomPitchSeed {
  targets: {
    heroHost: {
      select: 'william-shakespeare',
      octave: TRANSCENDENCE,
      style: 'enterprise-pitch',
      sectionPersonas: [
        { section: 'welcome', persona: 'william-shakespeare' },
        { section: 'features', persona: 'nikola-tesla' },
        { section: 'benefits', persona: 'leonardo-da-vinci' }
      ]
    },
    
    tourSections: {
      select: [
        { id: 'welcome', selected: true, order: 1 },
        { id: 'features', selected: true, order: 2 },
        { id: 'benefits', selected: true, order: 3 }
      ],
      filters: {
        type: ['intro', 'feature', 'benefit'],
        interactive: true
      }
    },
    
    protocols: {
      select: [
        'P-ENTERPRISE-SALES-CONSOLE-V17',
        'P-SALES-PITCHES-V17'
      ],
      includeDependencies: true,
      versionFilter: '17.0+'
    },
    
    octave: {
      start: WHISPER,
      progression: [WHISPER, HARMONY, RESONANCE, SYMPHONY, TRANSCENDENCE],
      end: TRANSCENDENCE,
      adaptation: 'progressive'
    },
    
    fsr: {
      fidelity: 'full',
      octave: TRANSCENDENCE,
      synthesis: 'enterprise-focused',
      resonance: 'maximum',
      density: 'maximum'
    }
  };
}
```

---

## Selection UI

### PitchSeed Target Selection Interface

```
┌─────────────────────────────────────────┐
│  Select PitchSeed Targets               │
├─────────────────────────────────────────┤
│  Hero Host:                              │
│  ● William Shakespeare                   │
│    Octave: [TRANSCENDENCE ▼]            │
│    Style: [Enterprise Pitch ▼]          │
│                                          │
│  Tour Sections:                          │
│  ☑ Welcome (Order: 1)                   │
│  ☑ Features (Order: 2)                  │
│  ☑ Benefits (Order: 3)                  │
│  ☐ Advanced (Order: 4)                  │
│                                          │
│  Protocols:                              │
│  ☑ Enterprise Sales Console             │
│  ☑ Sales Pitches Protocol               │
│  ☐ Inspection System                    │
│                                          │
│  Octave:                                 │
│  Start: [WHISPER ▼]                     │
│  End: [TRANSCENDENCE ▼]                  │
│  Progression: [Progressive ▼]           │
│                                          │
│  FSR Fidelity:                           │
│  Fidelity: [Full ▼]                     │
│  Synthesis: [Enterprise-Focused ▼]      │
│  Resonance: [Maximum ▼]                 │
│                                          │
│  [Generate PitchSeed]                    │
└─────────────────────────────────────────┘
```

---

## Integration with WelcomeSeed

### Unified Target Selection

Both WelcomeSeed and PitchSeed now support the same selectable target system:

- **Document Targets:** Select documents and line ranges
- **Hero Host Targets:** Select personas and configurations
- **Octave Targets:** Select octave levels and progressions
- **Protocol Targets:** Select protocols and dependencies
- **Integration Targets:** Select systems and integration options

### Shared Selection System

```nspfrp
// Shared target selection for both WelcomeSeed and PitchSeed
selectTargets SeedProtocol {
  type: 'welcome-seed' | 'pitch-seed';
  
  // Common targets
  documents: { ... };
  heroHost: { ... };
  octave: { ... };
  protocols: { ... };
  integrations: { ... };
  
  // PitchSeed-specific targets
  tourSections?: { ... };
  fsrFidelity?: { ... };
  
  // WelcomeSeed-specific targets
  onboardingFlow?: { ... };
  buttonMenu?: { ... };
}
```

---

## Benefits

### Flexibility
- **Customizable:** Select exactly what you need
- **Adaptive:** Adapt to different use cases
- **Flexible:** Mix and match targets
- **Configurable:** Full configuration control

### Consistency
- **Unified System:** Same system for WelcomeSeed and PitchSeed
- **Consistent UI:** Consistent selection interfaces
- **Shared Logic:** Shared target selection logic
- **Easy Migration:** Easy to switch between seed types

### User Experience
- **Intuitive:** Easy target selection
- **Visual:** Visual selection interfaces
- **Clear:** Clear target options
- **Efficient:** Efficient selection process

---

## Status

**Current Status:** Active Development  
**Target Types:** Hero Host, Tour Sections, Protocols, Octaves, FSR Fidelity, Integrations  
**Integration:** WelcomeSeed, PitchSeed, All Seed Protocols  
**UI:** Selection interfaces for all target types

---

**Protocol ID:** `P-PITCHSEED-SELECTABLE-TARGETS-V17`  
**Version:** `17.0+PitchSeedSelectableTargets`  
**Status:** Active Development  
**Network:** NSPFRP Care Network / Syntheverse

