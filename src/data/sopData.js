// This file acts as your mock SOP database
// In a real application, this data would come from a backend database after admin uploads.

export const initialSOPData = [
  {
    id: 'emergency-power-outage',
    title: 'Emergency Power Outage Procedure',
    keywords: ['emergency', 'power', 'outage', 'blackout', 'electrical failure', 'no power', 'electricity cut'],
    summary: 'This procedure outlines steps to safely manage a sudden loss of electrical power, ensuring personnel safety and minimizing equipment damage.',
    sections: [
      {
        heading: 'Initial Assessment',
        steps: [
          '1. Immediately turn off all non-essential electrical equipment to prevent surge damage.',
          '2. Locate emergency lighting or flashlight.',
          '3. Check main circuit breaker for a tripped switch. If tripped, attempt to reset once.'
        ]
      },
      {
        heading: 'Personnel Safety',
        steps: [
          '4. Evacuate non-essential personnel if building is dark or unsafe.',
          '5. Ensure emergency lighting is functional.',
          '6. Wear appropriate PPE if investigating electrical panels (e.g., arc-flash gear).'
        ]
      },
      {
        heading: 'Restoration (if applicable)',
        steps: [
          '7. Contact facility management or power utility company.',
          '8. Follow their instructions for restoration.',
          '9. If safe and trained, attempt to reset main breaker (only once).'
        ]
      }
    ],
    glossary: [
      { term: 'PPE', definition: 'Personal Protective Equipment, such as gloves, safety glasses, or a hard hat.' },
      { term: 'Breaker', definition: 'An automatic switch that protects an electrical circuit from damage caused by excess current.' },
      { term: 'Surge', definition: 'A short-duration increase in voltage in an electrical circuit.' }
    ]
  },
  {
    id: 'generator-startup-procedure',
    title: 'Generator Startup Procedure',
    keywords: ['generator', 'startup', 'initiate power', 'backup power', 'start engine', 'auxiliary power'],
    summary: 'This guide provides instructions for safely starting the backup electrical generator in case of a main power failure.',
    sections: [
      {
        heading: 'Pre-Start Checks',
        steps: [
          '1. Ensure the generator is in a well-ventilated area, free from obstructions.',
          '2. Check fuel levels. Refill if necessary, ensuring no spills.',
          '3. Verify engine oil and coolant levels are within safe operating limits.'
        ]
      },
      {
        heading: 'Starting the Engine',
        steps: [
          '4. Verify all circuit breakers on the generator panel are in the "off" position.',
          '5. Connect the transfer switch to the generator (if applicable and safe to do so).',
          '6. Start the generator engine using the provided ignition key or pull cord. Allow a brief warm-up.'
        ]
      },
      {
        heading: 'Load Transfer & Monitoring',
        steps: [
          '7. Once stable, gradually transfer load to the generator by switching on necessary circuits at the main panel.',
          '8. Monitor generator performance, voltage, and fuel level periodically during operation.'
        ]
      }
    ],
    glossary: [
      { term: 'Transfer Switch', definition: 'A device that switches a load between two power sources, typically utility power and a generator.' },
      { term: 'Circuit Breaker', definition: 'An automatic switch that protects an electrical circuit from damage caused by excess current.' },
      { term: 'Coolant', definition: 'A fluid used to cool an engine, preventing overheating.' }
    ]
  },
  {
    id: 'daily-safety-check-protocol',
    title: 'Daily Safety Check Protocol',
    keywords: ['safety check', 'daily', 'routine', 'inspection', 'hazard', 'protocol'],
    summary: 'Standard operating procedure for conducting routine daily workplace safety inspections and reporting.',
    sections: [
        {
            heading: 'Workplace Overview',
            steps: [
                '1. Inspect all emergency exits and fire routes for obstructions. Ensure they are clear.',
                '2. Verify fire extinguishers are in designated locations, unexpired, and easily accessible.'
            ]
        },
        {
            heading: 'Equipment & Electrical Safety',
            steps: [
                '3. Check all power cords and electrical outlets for damage or signs of overheating.',
                '4. Ensure all machinery safety guards are in place and secure.'
            ]
        },
        {
            heading: 'General Environment',
            steps: [
                '5. Check for any spills or debris on walkways and work areas. Clean immediately if found.',
                '6. Ensure proper lighting in all work zones.',
                '7. Report any observed safety concerns, near misses, or incidents to the supervisor promptly.'
            ]
        }
    ],
    glossary: [
      { term: 'Hazard', definition: 'A potential source of harm or adverse health effect.' },
      { term: 'SOP', definition: 'Standard Operating Procedure, a set of step-by-step instructions compiled by an organization to help workers carry out routine operations.' }
    ]
  }
];