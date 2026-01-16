"use client";

import React from 'react';
import { Search, Loader2, Mic, MicOff, BookOpen, ChevronDown, ChevronUp, Radio, Square, User, Moon, Sun } from 'lucide-react';

type ResidentYear = "R1" | "R2" | "R3";

type DefaultRange = number[]; // accept arrays like [1,2]

type DefaultsByYear = Record<ResidentYear, DefaultRange>;

type MicStatus =
  | 'unknown'
  | 'unsupported'
  | 'ready'
  | 'requesting'
  | 'denied'
  | 'listening'
  | 'error';

const MilestonesApp = () => {
  const [query, setQuery] = React.useState<string>('');
  const [results, setResults] = React.useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isListening, setIsListening] = React.useState(false);
  const [isAmbientListening, setIsAmbientListening] = React.useState(false);
  const [recognition, setRecognition] = React.useState<any>(null);
  const [activeTab, setActiveTab] = React.useState('search');
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [expandedMilestone, setExpandedMilestone] = React.useState<string | null>(null);
  const [residentYear, setResidentYear] = React.useState<ResidentYear>('R1');
  const [ambientTranscript, setAmbientTranscript] = React.useState('');
  const [includeDefaults, setIncludeDefaults] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(true);
  const [micStatus, setMicStatus] = React.useState<MicStatus>('unknown');
  const [micMessage, setMicMessage] = React.useState('');

  const milestonesData = [
    {
      name: "Patient Care 1: Care of the Acutely Ill Patient",
      category: "Patient Care",
      levels: [
        {
          level: 1,
          bullets: [
            {
              id: "1-1",
              text: "Generates differential diagnosis for acute presentations"
            },
            {
              id: "1-2",
              text: "Recognizes role of clinical protocols and guidelines in acute situations"
            },
            {
              id: "1-3",
              text: "Recognizes that acute conditions have an impact beyond the immediate disease process"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.5,
              4.0
            ]
          }
        },
        {
          level: 2,
          bullets: [
            {
              id: "2-1",
              text: "Prioritizes the differential diagnosis for acute presentations"
            },
            {
              id: "2-2",
              text: "Develops management plans for patients with common acute conditions"
            },
            {
              id: "2-3",
              text: "Identifies the interplay between psychosocial factors and acute illness"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.5,
              4.0
            ]
          }
        },
        {
          level: 3,
          bullets: [
            {
              id: "3-1",
              text: "Promptly recognizes urgent and emergent situations and coordinates appropriate diagnostic strategies",
              requirements: [
                "ICU rotation required",
                "ED rotation required",
                "2nd year FMC Inpatient Wards rotation often required"
              ]
            },
            {
              id: "3-2",
              text: "Implements management plans for patients with complex acute conditions, including stabilizing acutely ill patients",
              requirements: [
                "ICU rotation required",
                "ED rotation required",
                "2nd year FMC Inpatient Wards rotation often required"
              ]
            },
            {
              id: "3-3",
              text: "Incorporates psychosocial factors into management plans of acute illness for patients and caregivers"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.5,
              4.0
            ]
          },
          highlight: "pink"
        },
        {
          level: 4,
          bullets: [
            {
              id: "4-1",
              text: "Mobilizes the multidisciplinary team to manage care for simultaneous patient visits"
            },
            {
              id: "4-2",
              text: "Independently coordinates care for acutely ill patients with complex comorbidities"
            },
            {
              id: "4-3",
              text: "Modifies management plans for acute illness based on complex psychosocial factors and patient preferences"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.5,
              4.0
            ]
          },
          highlight: "pink",
          requirements: [
            "FMC Inpatient Wards rotation as senior required"
          ]
        },
        {
          level: 5,
          bullets: [
            {
              id: "5-1",
              text: "Efficiently manages and coordinates the care of multiple patients with a range of severity, including life-threatening conditions"
            },
            {
              id: "5-2",
              text: "Directs the use of resources to manage a complex patient care environment or situation"
            },
            {
              id: "5-3",
              text: "Implements strategies to address the psychosocial impacts of acute illness on populations"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.5,
              4.0
            ]
          },
          highlight: "yellow",
          requirements: [
            "Above and beyond examples required"
          ]
        }
      ]
    },
    {
      name: "Patient Care 2: Care of Patients with Chronic Illness",
      category: "Patient Care",
      levels: [
        {
          level: 1,
          bullets: [
            {
              id: "1-1",
              text: "Recognizes that common conditions may be chronic (e.g., anxiety, high blood pressure)"
            },
            {
              id: "1-2",
              text: "Formulates a basic management plan that addresses a chronic illness"
            },
            {
              id: "1-3",
              text: "Recognizes that chronic conditions have an impact beyond the disease process"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.5
            ],
            R2: [
              2.5,
              3.5
            ],
            R3: [
              3.5,
              4.0
            ]
          }
        },
        {
          level: 2,
          bullets: [
            {
              id: "2-1",
              text: "Identifies variability in presentation and progression of chronic conditions"
            },
            {
              id: "2-2",
              text: "Identifies and accesses appropriate clinical guidelines to develop and implement plans for management of chronic conditions"
            },
            {
              id: "2-3",
              text: "Identifies the impact of chronic conditions on individual patients and the others involved in their care"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.5
            ],
            R2: [
              2.5,
              3.5
            ],
            R3: [
              3.5,
              4.0
            ]
          }
        },
        {
          level: 3,
          bullets: [
            {
              id: "3-1",
              text: "Determines the potential impact of comorbidities on disease progression"
            },
            {
              id: "3-2",
              text: "Synthesizes a patient centered management plan that acknowledges the relationship between comorbidities and disease progression"
            },
            {
              id: "3-3",
              text: "Develops collaborative goals of care and engages the patient in self-management of chronic conditions"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.5
            ],
            R2: [
              2.5,
              3.5
            ],
            R3: [
              3.5,
              4.0
            ]
          },
          highlight: "pink",
          requirements: [
            "Specific examples of patient self-management required (e.g.: asthma action plan, self-titrating insulin)"
          ]
        },
        {
          level: 4,
          bullets: [
            {
              id: "4-1",
              text: "Balances the competing needs of patients’ comorbidities"
            },
            {
              id: "4-2",
              text: "Applies experience with patients while incorporating evidence based medicine in the management of patients with chronic conditions"
            },
            {
              id: "4-3",
              text: "Facilitates efforts at self-management of chronic conditions, including engagement of family and community resources"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.5
            ],
            R2: [
              2.5,
              3.5
            ],
            R3: [
              3.5,
              4.0
            ]
          },
          highlight: "pink",
          requirements: [
            "Specific examples of patient self-management required"
          ]
        },
        {
          level: 5,
          bullets: [
            {
              id: "5-1",
              text: "Leads multidisciplinary initiatives to manage patient populations with chronic conditions and comorbidities"
            },
            {
              id: "5-2",
              text: "Initiates supplemental strategies (e.g., leads patient and family advisory councils, community health, practice innovation) to improve the care of patients with chronic conditions"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.5
            ],
            R2: [
              2.5,
              3.5
            ],
            R3: [
              3.5,
              4.0
            ]
          }
        }
      ]
    },
    {
      name: "Patient Care 3: Health Promotion and Wellness",
      category: "Patient Care",
      levels: [
        {
          level: 1,
          bullets: [
            {
              id: "1-1",
              text: "Identifies screening and prevention guidelines by various organizations"
            },
            {
              id: "1-2",
              text: "Identifies opportunities to maintain and promote wellness in patients"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              3.5
            ],
            R3: [
              3.5,
              3.5
            ]
          }
        },
        {
          level: 2,
          bullets: [
            {
              id: "2-1",
              text: "Reconciles competing prevention guidelines to develop a plan for an individual patient, and considers how these guidelines apply to the patient population"
            },
            {
              id: "2-2",
              text: "Recommends management plans to maintain and promote health"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              3.5
            ],
            R3: [
              3.5,
              3.5
            ]
          }
        },
        {
          level: 3,
          bullets: [
            {
              id: "3-1",
              text: "Identifies barriers and alternatives to preventive health tests, with the goal of shared decision making"
            },
            {
              id: "3-2",
              text: "Implements plans to maintain and promote health, including addressing barriers"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              3.5
            ],
            R3: [
              3.5,
              3.5
            ]
          }
        },
        {
          level: 4,
          bullets: [
            {
              id: "4-1",
              text: "Incorporates screening and prevention guidelines in patient care outside of designated wellness visits"
            },
            {
              id: "4-2",
              text: "Implements comprehensive plans to maintain and promote health, incorporating pertinent psychosocial factors and other determinants of health"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              3.5
            ],
            R3: [
              3.5,
              3.5
            ]
          },
          highlight: "pink",
          requirements: [
            "Regular meetings with Population Health AND improved screening rates",
            "Evidence of collaboration with Behavioral Health, Social Work"
          ]
        },
        {
          level: 5,
          bullets: [
            {
              id: "5-1",
              text: "Participates in guideline development or implementation across a system of care or community"
            },
            {
              id: "5-2",
              text: "Partners with the community to promote health"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              3.5
            ],
            R3: [
              3.5,
              3.5
            ]
          }
        }
      ]
    },
    {
      name: "Patient Care 4: Ongoing Care of Patients with Undifferentiated Signs, Symptoms, or Health Concerns",
      category: "Patient Care",
      levels: [
        {
          level: 1,
          bullets: [
            {
              id: "1-1",
              text: "Acknowledges the value of continuity in caring for patients with undifferentiated illness"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.0,
              3.0
            ]
          }
        },
        {
          level: 2,
          bullets: [
            {
              id: "2-1",
              text: "Accepts uncertainty and maintains continuity while managing patients with undifferentiated illness"
            },
            {
              id: "2-2",
              text: "Develops a differential diagnosis for patients with undifferentiated illness"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.0,
              3.0
            ]
          }
        },
        {
          level: 3,
          bullets: [
            {
              id: "3-1",
              text: "Facilitates patients’ understanding of their expected course and events that require physician notification"
            },
            {
              id: "3-2",
              text: "Prioritizes cost-effective diagnostic testing and consultations that will change the management of undifferentiated illness"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.0,
              3.0
            ]
          },
          highlight: "green",
          requirements: [
            "Documentation of specific patient examples with longitudinal relationships required"
          ]
        },
        {
          level: 4,
          bullets: [
            {
              id: "4-1",
              text: "Coordinates collaborative treatment plans for patients with undifferentiated illness"
            },
            {
              id: "4-2",
              text: "Uses multidisciplinary resources to assist patients with undifferentiated illness to deliver health care more efficiently"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.0,
              3.0
            ]
          },
          highlight: "green",
          requirements: [
            "Documentation of specific patient examples with longitudinal relationships required"
          ]
        },
        {
          level: 5,
          bullets: [
            {
              id: "5-1",
              text: "Coordinates expanded initiatives to facilitate care of patients with undifferentiated illness"
            },
            {
              id: "5-2",
              text: "Contributes to the development of medical knowledge around undifferentiated illness"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.0,
              3.0
            ]
          }
        }
      ]
    },
    {
      name: "Patient Care 5: Management of Procedural Care",
      category: "Patient Care",
      levels: [
        {
          level: 1,
          bullets: [
            {
              id: "1-1",
              text: "Identifies the breadth of procedures that family physicians perform"
            },
            {
              id: "1-2",
              text: "Recognizes family physicians’ role in referring patients for appropriate procedural care"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              2.5
            ],
            R3: [
              3.0,
              4.0
            ]
          }
        },
        {
          level: 2,
          bullets: [
            {
              id: "2-1",
              text: "Identifies patients for whom a procedure is indicated and who is equipped to perform it"
            },
            {
              id: "2-2",
              text: "Counsels patients about expectations for common procedures performed by family physicians and consultants"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              2.5
            ],
            R3: [
              3.0,
              4.0
            ]
          }
        },
        {
          level: 3,
          bullets: [
            {
              id: "3-1",
              text: "Demonstrates confidence and motor skills while performing procedures, including addressing complications"
            },
            {
              id: "3-2",
              text: "Performs independent risk and appropriateness assessment based on patient-centered priorities for procedures performed by consultants"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              2.5
            ],
            R3: [
              3.0,
              4.0
            ]
          }
        },
        {
          level: 4,
          bullets: [
            {
              id: "4-1",
              text: "Identifies and acquires the skills to independently perform procedures in the current practice environment"
            },
            {
              id: "4-2",
              text: "Collaborates with procedural colleagues to match patients with appropriate procedures, including declining support for procedures that are not in the patient’s best interest"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              2.5
            ],
            R3: [
              3.0,
              4.0
            ]
          },
          highlight: "pink",
          requirements: [
            "Independent on majority of FMC Core Procedures"
          ]
        },
        {
          level: 5,
          bullets: [
            {
              id: "5-1",
              text: "Identifies procedures needed in future practice and pursues supplemental training to independently perform"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              2.5
            ],
            R3: [
              3.0,
              4.0
            ]
          }
        }
      ]
    },
    {
      name: "Medical Knowledge 1: Demonstrates Medical Knowledge of Sufficient Breadth and Depth to Practice Family Medicine",
      category: "Medical Knowledge",
      levels: [
        {
          level: 1,
          bullets: [
            {
              id: "1-1",
              text: "Describes the pathophysiology and treatments of patients with common conditions"
            },
            {
              id: "1-2",
              text: "Describes how behaviors impact patient health"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.5,
              3.5
            ]
          }
        },
        {
          level: 2,
          bullets: [
            {
              id: "2-1",
              text: "Applies knowledge of pathophysiology with intellectual curiosity for treatment of patients with common conditions"
            },
            {
              id: "2-2",
              text: "Identifies behavioral strategies to improve health"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.5,
              3.5
            ]
          }
        },
        {
          level: 3,
          bullets: [
            {
              id: "3-1",
              text: "Demonstrates knowledge of complex pathophysiology and the comprehensive management of patients across the lifespan"
            },
            {
              id: "3-2",
              text: "Engages in learning behavioral strategies to address patient care needs"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.5,
              3.5
            ]
          },
          highlight: "pink",
          requirements: [
            "In-Training Exam score predictive of passing boards"
          ]
        },
        {
          level: 4,
          bullets: [
            {
              id: "4-1",
              text: "Integrates clinical experience and comprehensive knowledge in the management of patients across the lifespan"
            },
            {
              id: "4-2",
              text: "Demonstrates comprehensive knowledge of behavioral strategies and resources to address patient’s needs"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.5,
              3.5
            ]
          }
        },
        {
          level: 5,
          bullets: [
            {
              id: "5-1",
              text: "Expands the knowledge base of family medicine through dissemination of original research"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.5,
              3.5
            ]
          }
        }
      ]
    },
    {
      name: "Medical Knowledge 2: Critical Thinking and Decision Making",
      category: "Medical Knowledge",
      levels: [
        {
          level: 1,
          bullets: [
            {
              id: "1-1",
              text: "Incorporates key elements of a patient story into an accurate depiction of their presentation"
            },
            {
              id: "1-2",
              text: "Describes common causes of clinical reasoning error"
            },
            {
              id: "1-3",
              text: "Interprets results of common diagnostic testing"
            }
          ],
          defaults: {
            R1: [
              1.0,
              1.5
            ],
            R2: [
              2.0,
              2.5
            ],
            R3: [
              3.0,
              3.5
            ]
          }
        },
        {
          level: 2,
          bullets: [
            {
              id: "2-1",
              text: "Develops an analytic, prioritized differential diagnosis for common presentations"
            },
            {
              id: "2-2",
              text: "Identifies types of clinical reasoning errors within patient care, with guidance"
            },
            {
              id: "2-3",
              text: "Interprets complex diagnostic information"
            }
          ],
          defaults: {
            R1: [
              1.0,
              1.5
            ],
            R2: [
              2.0,
              2.5
            ],
            R3: [
              3.0,
              3.5
            ]
          }
        },
        {
          level: 3,
          bullets: [
            {
              id: "3-1",
              text: "Develops a prioritized differential diagnosis for complex presentations"
            },
            {
              id: "3-2",
              text: "Demonstrates a structured approach to personally identify clinical reasoning errors"
            },
            {
              id: "3-3",
              text: "Synthesizes complex diagnostic information accurately to reach high probability diagnoses"
            }
          ],
          defaults: {
            R1: [
              1.0,
              1.5
            ],
            R2: [
              2.0,
              2.5
            ],
            R3: [
              3.0,
              3.5
            ]
          },
          highlight: "pink",
          requirements: [
            "Patient Safety Conference required"
          ]
        },
        {
          level: 4,
          bullets: [
            {
              id: "4-1",
              text: "Synthesizes information to reach high probability diagnoses with continuous re-appraisal to minimize clinical reasoning errors"
            },
            {
              id: "4-2",
              text: "Anticipates and accounts for errors and biases when interpreting diagnostic tests"
            }
          ],
          defaults: {
            R1: [
              1.0,
              1.5
            ],
            R2: [
              2.0,
              2.5
            ],
            R3: [
              3.0,
              3.5
            ]
          }
        },
        {
          level: 5,
          bullets: [
            {
              id: "5-1",
              text: "Engages in deliberate practice and coaches others to minimize clinical reasoning errors"
            },
            {
              id: "5-2",
              text: "Pursues knowledge of new and emerging diagnostic tests"
            }
          ],
          defaults: {
            R1: [
              1.0,
              1.5
            ],
            R2: [
              2.0,
              2.5
            ],
            R3: [
              3.0,
              3.5
            ]
          }
        }
      ]
    },
    {
      name: "Systems-Based Practice 1: Patient Safety and Quality Improvement",
      category: "Systems-Based Practice",
      levels: [
        {
          level: 1,
          bullets: [
            {
              id: "1-1",
              text: "Demonstrates knowledge of common patient safety events"
            },
            {
              id: "1-2",
              text: "Demonstrates knowledge of how to report patient safety events"
            },
            {
              id: "1-3",
              text: "Demonstrates knowledge of basic quality improvement methodologies and metrics"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.5,
              3.5
            ],
            defaultsNote: "R2: 3.0 if Patient Safety Conference done",
          }
        },
        {
          level: 2,
          bullets: [
            {
              id: "2-1",
              text: "Identifies system factors that lead to patient safety events"
            },
            {
              id: "2-2",
              text: "Reports patient safety events through institutional reporting systems (simulated or actual)"
            },
            {
              id: "2-3",
              text: "Describes local quality improvement initiatives (e.g., community vaccination rate, infection rate, smoking cessation)"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.5,
              3.5
            ],
            defaultsNote: "R2: 3.0 if Patient Safety Conference done",
          },
          highlight: "pink",
          requirements: [
            "Incident Report AND logging in New Innovations"
          ]
        },
        {
          level: 3,
          bullets: [
            {
              id: "3-1",
              text: "Participates in analysis of patient safety events (simulated or actual)"
            },
            {
              id: "3-2",
              text: "Participates in disclosure of patient safety events to patients and families (simulated or actual)"
            },
            {
              id: "3-3",
              text: "Participates in local quality improvement initiatives"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.5,
              3.5
            ],
            defaultsNote: "R2: 3.0 if Patient Safety Conference done",
          },
          highlight: "pink",
          requirements: [
            "Attendance at multiple Patient Safety Conferences"
          ]
        },
        {
          level: 4,
          bullets: [
            {
              id: "4-1",
              text: "Conducts analysis of patient safety events and offers error prevention strategies (simulated or actual)"
            },
            {
              id: "4-2",
              text: "Discloses patient safety events to patients and families (simulated or actual)"
            },
            {
              id: "4-3",
              text: "Demonstrates skills required to identify, develop, implement, and analyze a quality improvement project"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.5,
              3.5
            ],
            defaultsNote: "R2: 3.0 if Patient Safety Conference done",
          },
          highlight: "pink",
          requirements: [
            "Give Patient Safety Conference (logged in New Innovations)",
            "Completion of ABFM QI project"
          ]
        },
        {
          level: 5,
          bullets: [
            {
              id: "5-1",
              text: "Actively engages teams and processes to modify systems to prevent patient safety events"
            },
            {
              id: "5-2",
              text: "Role models or mentors others in the disclosure of patient safety events"
            },
            {
              id: "5-3",
              text: "Designs, implements, and assesses quality improvement initiatives at the institutional or community level"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.5,
              3.5
            ],
            defaultsNote: "R2: 3.0 if Patient Safety Conference done",
          }
        }
      ]
    },
    {
      name: "Systems-Based Practice 2: System Navigation for Patient-Centered Care",
      category: "Systems-Based Practice",
      levels: [
        {
          level: 1,
          bullets: [
            {
              id: "1-1",
              text: "Demonstrates knowledge of care coordination"
            },
            {
              id: "1-2",
              text: "Identifies key elements for safe and effective transitions of care and hand-offs"
            },
            {
              id: "1-3",
              text: "Demonstrates knowledge of population and community health needs and disparities"
            }
          ],
          defaults: {
            R1: [
              1.5,
              1.5
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.5,
              3.5
            ]
          }
        },
        {
          level: 2,
          bullets: [
            {
              id: "2-1",
              text: "Coordinates care of patients in routine clinical situations effectively using the roles of the interprofessional team members"
            },
            {
              id: "2-2",
              text: "Performs safe and effective transitions of care/hand-offs in routine clinical situations"
            },
            {
              id: "2-3",
              text: "Identifies specific population and community health needs and inequities in their local population"
            }
          ],
          defaults: {
            R1: [
              1.5,
              1.5
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.5,
              3.5
            ]
          },
          highlight: "pink",
          requirements: [
            "Community Medicine rotation and community needs assessment"
          ]
        },
        {
          level: 3,
          bullets: [
            {
              id: "3-1",
              text: "Coordinates care of patients in complex clinical situations effectively using the roles of the interprofessional team member"
            },
            {
              id: "3-2",
              text: "Performs safe and effective transitions of care/hand-offs in complex clinical situations"
            },
            {
              id: "3-3",
              text: "Uses local resources effectively to meet the needs of a patient population and community"
            }
          ],
          defaults: {
            R1: [
              1.5,
              1.5
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.5,
              3.5
            ]
          },
          highlight: "pink",
          requirements: [
            "Evidence of consultations with Behavioral Health and Social Work",
            "Community Medicine rotation and community needs assessment"
          ]
        },
        {
          level: 4,
          bullets: [
            {
              id: "4-1",
              text: "Role models effective coordination of patient centered care among different disciplines and specialties"
            },
            {
              id: "4-2",
              text: "Role models and advocates for safe and effective transitions of care/hand-offs within and across health care delivery systems including outpatient settings"
            },
            {
              id: "4-3",
              text: "Participates in changing and adapting practice to provide for the needs of specific populations"
            }
          ],
          defaults: {
            R1: [
              1.5,
              1.5
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.5,
              3.5
            ]
          }
        },
        {
          level: 5,
          bullets: [
            {
              id: "5-1",
              text: "Analyses the process of care coordination and leads in the design and implementation of improvements"
            },
            {
              id: "5-2",
              text: "Improves quality of transitions of care within and across health care delivery systems to optimize patient outcomes"
            },
            {
              id: "5-3",
              text: "Leads innovations and advocates for populations and communities with health care inequities"
            }
          ],
          defaults: {
            R1: [
              1.5,
              1.5
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.5,
              3.5
            ]
          }
        }
      ]
    },
    {
      name: "Systems-Based Practice 3: Physician Role in Health Care Systems",
      category: "Systems-Based Practice",
      levels: [
        {
          level: 1,
          bullets: [
            {
              id: "1-1",
              text: "Identifies key components of the complex health care system (e.g., hospital, skilled nursing facility, finance, personnel, technology)"
            },
            {
              id: "1-2",
              text: "Describes basic health payment systems, (including government, private, public, uninsured care) and practice models"
            },
            {
              id: "1-3",
              text: "Identifies basic knowledge domains for effective transition to practice (e.g., information technology, legal, billing and coding, financial, personnel)"
            }
          ],
          defaults: {
            R1: [
              1.5,
              1.5
            ],
            R2: [
              2.5,
              2.5
            ],
            R3: [
              3.0,
              4.0
            ]
          }
        },
        {
          level: 2,
          bullets: [
            {
              id: "2-1",
              text: "Describes how components of a complex health care system are interrelated, and how this impacts patient care"
            },
            {
              id: "2-2",
              text: "Delivers care with consideration of each patient’s payment model (e.g., insurance type)"
            },
            {
              id: "2-3",
              text: "Demonstrates use of information technology required for medical practice (e.g., electronic health record, documentation required for billing and coding)"
            }
          ],
          defaults: {
            R1: [
              1.5,
              1.5
            ],
            R2: [
              2.5,
              2.5
            ],
            R3: [
              3.0,
              4.0
            ]
          }
        },
        {
          level: 3,
          bullets: [
            {
              id: "3-1",
              text: "Discusses how individual practice affects the broader system (e.g., length of stay, readmission rates, clinical efficiency)"
            },
            {
              id: "3-2",
              text: "Engages with patients in shared decision making, informed by each patient’s payment models"
            },
            {
              id: "3-3",
              text: "Describes core administrative knowledge needed for transition to practice (e.g., contract negotiations, malpractice insurance, government regulation, compliance)"
            }
          ],
          defaults: {
            R1: [
              1.5,
              1.5
            ],
            R2: [
              2.5,
              2.5
            ],
            R3: [
              3.0,
              4.0
            ]
          }
        },
        {
          level: 4,
          bullets: [
            {
              id: "4-1",
              text: "Manages various components of the complex health care system to provide efficient and effective patient care and transition of care"
            },
            {
              id: "4-2",
              text: "Advocates for patient care needs (e.g., community resources, patient assistance resources)"
            },
            {
              id: "4-3",
              text: "Analyzes individual practice patterns and prepares for professional requirements to enter practice"
            }
          ],
          defaults: {
            R1: [
              1.5,
              1.5
            ],
            R2: [
              2.5,
              2.5
            ],
            R3: [
              3.0,
              4.0
            ]
          }
        },
        {
          level: 5,
          bullets: [
            {
              id: "5-1",
              text: "Advocates for or leads systems change that enhances high-value, efficient, and effective patient care and transition of care"
            },
            {
              id: "5-2",
              text: "Participates in health policy advocacy activities"
            }
          ],
          defaults: {
            R1: [
              1.5,
              1.5
            ],
            R2: [
              2.5,
              2.5
            ],
            R3: [
              3.0,
              4.0
            ]
          }
        }
      ]
    },
    {
      name: "Systems-Based Practice 4: Advocacy",
      category: "Systems-Based Practice",
      levels: [
        {
          level: 1,
          bullets: [
            {
              id: "1-1",
              text: "Identifies that advocating for patient populations is a professional responsibility"
            }
          ],
          defaults: {
            R1: [
              2.0,
              2.0
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.0,
              3.0
            ]
          }
        },
        {
          level: 2,
          bullets: [
            {
              id: "2-1",
              text: "Identifies that advocating for family medicine is a professional responsibility"
            }
          ],
          defaults: {
            R1: [
              2.0,
              2.0
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.0,
              3.0
            ]
          }
        },
        {
          level: 3,
          bullets: [
            {
              id: "3-1",
              text: "Describes how stakeholders influence and are affected by health policy at the local, state, and federal level"
            }
          ],
          defaults: {
            R1: [
              2.0,
              2.0
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.0,
              3.0
            ]
          }
        },
        {
          level: 4,
          bullets: [
            {
              id: "4-1",
              text: "Accesses advocacy tools and other resources needed to achieve (or prevent a deleterious) policy change"
            }
          ],
          defaults: {
            R1: [
              2.0,
              2.0
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.0,
              3.0
            ]
          }
        },
        {
          level: 5,
          bullets: [
            {
              id: "5-1",
              text: "Develops a relationship with stakeholders that advances or prevents a policy change that improves individual or community health"
            }
          ],
          defaults: {
            R1: [
              2.0,
              2.0
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.0,
              3.0
            ]
          }
        }
      ]
    },
    {
      name: "Practice-Based Learning and Improvement 1: Evidence-Based and Informed Practice",
      category: "Practice-Based Learning",
      levels: [
        {
          level: 1,
          bullets: [
            {
              id: "1-1",
              text: "Demonstrates how to access, categorize, and analyze clinical evidence"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.5,
              4.0
            ]
          }
        },
        {
          level: 2,
          bullets: [
            {
              id: "2-1",
              text: "Articulates clinical questions and elicits patient preferences and values in order to guide evidence-based care"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.5,
              4.0
            ]
          },
          highlight: "pink",
          requirements: [
            "2 PICO presentations (logged in New Innovations)"
          ]
        },
        {
          level: 3,
          bullets: [
            {
              id: "3-1",
              text: "Locates and applies the best available evidence, integrated with patient preference, to the care of complex patients"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.5,
              4.0
            ]
          },
          highlight: "pink",
          requirements: [
            "Journal Club presentation (logged in New Innovations)"
          ]
        },
        {
          level: 4,
          bullets: [
            {
              id: "4-1",
              text: "Critically appraises and applies evidence even in the face of uncertainty and conflicting evidence to guide care, tailored to the individual patient"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.5,
              4.0
            ]
          },
          highlight: "pink",
          requirements: [
            "Both EBM presentations (logged in New Innovations)"
          ]
        },
        {
          level: 5,
          bullets: [
            {
              id: "5-1",
              text: "Coaches others to critically appraise and apply evidence for complex patients; and/or collaboratively develops evidence-based decisionmaking tools"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.5,
              4.0
            ]
          }
        }
      ]
    },
    {
      name: "Practice-Based Learning and Improvement 2: Reflective Practice and Commitment to Personal Growth",
      category: "Practice-Based Learning",
      levels: [
        {
          level: 1,
          bullets: [
            {
              id: "1-1",
              text: "Accepts responsibility for personal and professional development by establishing goals"
            },
            {
              id: "1-2",
              text: "Identifies the factors which contribute to gap(s) between expectations and actual performance"
            },
            {
              id: "1-3",
              text: "Acknowledges there are always opportunities for self-improvement"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.5,
              3.5
            ]
          }
        },
        {
          level: 2,
          bullets: [
            {
              id: "2-1",
              text: "Demonstrates openness to performance data (feedback and other input) in order to inform goals"
            },
            {
              id: "2-2",
              text: "Self-reflects and analyzes factors which contribute to gap(s) between expectations and actual performance"
            },
            {
              id: "2-3",
              text: "Designs and implements a learning plan, with prompting"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.5,
              3.5
            ]
          },
          highlight: "pink",
          requirements: [
            "Individualized Learning Plan in New Innovations every 6 months"
          ]
        },
        {
          level: 3,
          bullets: [
            {
              id: "3-1",
              text: "Intermittently seeks additional performance data with adaptability and humility"
            },
            {
              id: "3-2",
              text: "Self-reflects, analyzes, and institutes behavioral change(s) to narrow the gap(s) between expectations and actual performance"
            },
            {
              id: "3-3",
              text: "Independently creates and implements a learning plan"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.5,
              3.5
            ]
          },
          highlight: "pink",
          requirements: [
            "Individualized Learning Plan in New Innovations every 6 months"
          ]
        },
        {
          level: 4,
          bullets: [
            {
              id: "4-1",
              text: "Consistently seeks performance data with adaptability and humility"
            },
            {
              id: "4-2",
              text: "Challenges assumptions and considers alternatives in narrowing the gap(s) between expectations and actual performance"
            },
            {
              id: "4-3",
              text: "Uses performance data to measure the effectiveness of the learning plan and when necessary, improves it"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.5,
              3.5
            ]
          }
        },
        {
          level: 5,
          bullets: [
            {
              id: "5-1",
              text: "Leads performance review processes"
            },
            {
              id: "5-2",
              text: "Coaches others on reflective practice"
            },
            {
              id: "5-3",
              text: "Facilitates the design and implementing learning plans for others"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.5,
              3.5
            ]
          }
        }
      ]
    },
    {
      name: "Professionalism 1: Professional Behavior and Ethical Principles",
      category: "Professionalism",
      levels: [
        {
          level: 1,
          bullets: [
            {
              id: "1-1",
              text: "Describes professional behavior and potential triggers for personal lapses in professionalism"
            },
            {
              id: "1-2",
              text: "Takes responsibility for personal lapses in professionalism"
            },
            {
              id: "1-3",
              text: "Demonstrates knowledge of ethical principles"
            }
          ],
          defaults: {
            R1: [
              1.0,
              1.5
            ],
            R2: [
              2.0,
              2.5
            ],
            R3: [
              2.5,
              3.5
            ]
          }
        },
        {
          level: 2,
          bullets: [
            {
              id: "2-1",
              text: "Demonstrates professional behavior in routine situations"
            },
            {
              id: "2-2",
              text: "Describes when and how to report professionalism lapses in self and others"
            },
            {
              id: "2-3",
              text: "Analyzes straightforward situations using ethical principles"
            }
          ],
          defaults: {
            R1: [
              1.0,
              1.5
            ],
            R2: [
              2.0,
              2.5
            ],
            R3: [
              2.5,
              3.5
            ]
          }
        },
        {
          level: 3,
          bullets: [
            {
              id: "3-1",
              text: "Demonstrates professional behavior in complex or stressful situations"
            },
            {
              id: "3-2",
              text: "Recognizes need to seek help in managing and resolving complex professionalism lapses"
            },
            {
              id: "3-3",
              text: "Analyzes complex situations using ethical principles"
            }
          ],
          defaults: {
            R1: [
              1.0,
              1.5
            ],
            R2: [
              2.0,
              2.5
            ],
            R3: [
              2.5,
              3.5
            ]
          }
        },
        {
          level: 4,
          bullets: [
            {
              id: "4-1",
              text: "Recognizes situations that may trigger professionalism lapses and intervenes to prevent lapses in self and others"
            },
            {
              id: "4-2",
              text: "Recognizes and uses appropriate resources for managing and resolving dilemmas as needed"
            }
          ],
          defaults: {
            R1: [
              1.0,
              1.5
            ],
            R2: [
              2.0,
              2.5
            ],
            R3: [
              2.5,
              3.5
            ]
          }
        },
        {
          level: 5,
          bullets: [
            {
              id: "5-1",
              text: "Mentors others in professional behavior"
            },
            {
              id: "5-2",
              text: "Identifies and seeks to address system-level factors that induce or exacerbate ethical problems and professionalism lapses or impede their resolution"
            }
          ],
          defaults: {
            R1: [
              1.0,
              1.5
            ],
            R2: [
              2.0,
              2.5
            ],
            R3: [
              2.5,
              3.5
            ]
          }
        }
      ]
    },
    {
      name: "Professionalism 2: Accountability/Conscientiousness",
      category: "Professionalism",
      levels: [
        {
          level: 1,
          bullets: [
            {
              id: "1-1",
              text: "Takes responsibility for failure to complete tasks and responsibilities, identifies potential contributing factors, and describes strategies for ensuring timely task completion in the future"
            },
            {
              id: "1-2",
              text: "Responds promptly to requests or reminders to complete tasks and responsibilities"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.0,
              3.0
            ]
          }
        },
        {
          level: 2,
          bullets: [
            {
              id: "2-1",
              text: "Performs tasks and responsibilities in a timely manner with appropriate attention to detail in routine situations"
            },
            {
              id: "2-2",
              text: "Recognizes situations that may impact own ability to complete tasks and responsibilities in a timely manner"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.0,
              3.0
            ]
          }
        },
        {
          level: 3,
          bullets: [
            {
              id: "3-1",
              text: "Performs tasks and responsibilities in a timely manner with appropriate attention to detail in complex or stressful situations"
            },
            {
              id: "3-2",
              text: "Proactively implements strategies to ensure that the needs of patients, teams, and systems are met"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.0,
              3.0
            ]
          }
        },
        {
          level: 4,
          bullets: [
            {
              id: "4-1",
              text: "Recognizes and addresses situations that may impact others’ ability to complete tasks and responsibilities in a timely manner"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.0,
              3.0
            ]
          }
        },
        {
          level: 5,
          bullets: [
            {
              id: "5-1",
              text: "Takes ownership of system outcomes"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.0,
              3.0
            ]
          }
        }
      ]
    },
    {
      name: "Professionalism 3: Self-Awareness and Help-Seeking Behaviors",
      category: "Professionalism",
      levels: [
        {
          level: 1,
          bullets: [
            {
              id: "1-1",
              text: "Recognizes status of personal and professional well-being, with assistance"
            },
            {
              id: "1-2",
              text: "Recognizes limits in the knowledge/skills of self, with assistance"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.5,
              4.0
            ]
          }
        },
        {
          level: 2,
          bullets: [
            {
              id: "2-1",
              text: "Independently recognizes status of personal and professional well-being"
            },
            {
              id: "2-2",
              text: "Independently recognizes limits in the knowledge/skills of self and team and demonstrates appropriate help-seeking behaviors"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.5,
              4.0
            ]
          }
        },
        {
          level: 3,
          bullets: [
            {
              id: "3-1",
              text: "Proposes a plan to optimize personal and professional well-being, with guidance"
            },
            {
              id: "3-2",
              text: "Proposes a plan to remediate or improve limits in the knowledge/skills of self or team, with guidance"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.5,
              4.0
            ]
          },
          highlight: "pink",
          requirements: [
            "At least one ILP goal must be personal rather than professional"
          ]
        },
        {
          level: 4,
          bullets: [
            {
              id: "4-1",
              text: "Independently develops a plan to optimize personal and professional well-being"
            },
            {
              id: "4-2",
              text: "Independently develops a plan to remediate or improve limits in the knowledge/skills of self or team"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.5,
              4.0
            ]
          },
          highlight: "pink",
          requirements: [
            "At least one ILP goal must be personal rather than professional"
          ]
        },
        {
          level: 5,
          bullets: [
            {
              id: "5-1",
              text: "Addresses system barriers to maintain personal and professional well-being"
            },
            {
              id: "5-2",
              text: "Mentors others to enhance knowledge/skills of self or team"
            }
          ],
          defaults: {
            R1: [
              1.5,
              2.0
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.5,
              4.0
            ]
          }
        }
      ]
    },
    {
      name: "Interpersonal and Communication Skills 1: Patient- and Family-Centered Communication",
      category: "Interpersonal and Communication Skills",
      levels: [
        {
          level: 1,
          bullets: [
            {
              id: "1-1",
              text: "Uses language and nonverbal behavior to demonstrate respect, establish rapport while communicating one’s own role within the health care system"
            },
            {
              id: "1-2",
              text: "Recognizes easily identified barriers to effective communication (e.g., language, disability)"
            },
            {
              id: "1-3",
              text: "Identifies the need to individualize communication strategies"
            }
          ],
          defaults: {
            R1: [
              1.5,
              1.5
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.5,
              4.0
            ]
          }
        },
        {
          level: 2,
          bullets: [
            {
              id: "2-1",
              text: "Establishes a therapeutic relationship in straightforward encounters using active listening and clear language"
            },
            {
              id: "2-2",
              text: "Identifies complex barriers to effective communication (e.g., health literacy, cultural)"
            },
            {
              id: "2-3",
              text: "Organizes and initiates communication, sets the agenda, clarifies expectations, and verifies understanding"
            }
          ],
          defaults: {
            R1: [
              1.5,
              1.5
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.5,
              4.0
            ]
          }
        },
        {
          level: 3,
          bullets: [
            {
              id: "3-1",
              text: "Establishes a therapeutic relationship in challenging patient encounters"
            },
            {
              id: "3-2",
              text: "When prompted, reflects on personal biases while attempting to minimize communication barriers"
            },
            {
              id: "3-3",
              text: "Sensitively and compassionately delivers medical information, managing patient/family values, goals, preferences, uncertainty, and conflict"
            }
          ],
          defaults: {
            R1: [
              1.5,
              1.5
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.5,
              4.0
            ]
          }
        },
        {
          level: 4,
          bullets: [
            {
              id: "4-1",
              text: "Maintains therapeutic relationships, with attention to patient/family concerns and context, regardless of complexity"
            },
            {
              id: "4-2",
              text: "Independently recognizes personal biases while attempting to proactively minimize communication barriers"
            },
            {
              id: "4-3",
              text: "Independently uses shared decision making to align patient/family values, goals, and preferences with treatment options to make a personalized care plan"
            }
          ],
          defaults: {
            R1: [
              1.5,
              1.5
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.5,
              4.0
            ]
          }
        },
        {
          level: 5,
          bullets: [
            {
              id: "5-1",
              text: "Mentors others in situational awareness and critical self-reflection to consistently develop positive therapeutic relationships"
            },
            {
              id: "5-2",
              text: "Leads or develops initiatives to identify and address bias"
            },
            {
              id: "5-3",
              text: "Role models shared decision making in patient/family communication including those with a high degree of uncertainty/conflict"
            }
          ],
          defaults: {
            R1: [
              1.5,
              1.5
            ],
            R2: [
              2.5,
              3.0
            ],
            R3: [
              3.5,
              4.0
            ]
          }
        }
      ]
    },
    {
      name: "Interpersonal and Communication Skills 2: Interprofessional and Team Communication",
      category: "Interpersonal and Communication Skills",
      levels: [
        {
          level: 1,
          bullets: [
            {
              id: "1-1",
              text: "Respectfully requests/receives a consultation"
            },
            {
              id: "1-2",
              text: "Uses language that values all members of the health care team"
            }
          ],
          defaults: {
            R1: [
              1.0,
              1.5
            ],
            R2: [
              2.5,
              2.5
            ],
            R3: [
              3.0,
              4.0
            ]
          }
        },
        {
          level: 2,
          bullets: [
            {
              id: "2-1",
              text: "Clearly and concisely requests/responds to a consultation"
            },
            {
              id: "2-2",
              text: "Communicates information effectively with all health care team members"
            }
          ],
          defaults: {
            R1: [
              1.0,
              1.5
            ],
            R2: [
              2.5,
              2.5
            ],
            R3: [
              3.0,
              4.0
            ]
          }
        },
        {
          level: 3,
          bullets: [
            {
              id: "3-1",
              text: "Checks understanding of consult recommendations (received or provided)"
            },
            {
              id: "3-2",
              text: "Communicates concerns and provides feedback to peers and learners"
            }
          ],
          defaults: {
            R1: [
              1.0,
              1.5
            ],
            R2: [
              2.5,
              2.5
            ],
            R3: [
              3.0,
              4.0
            ]
          }
        },
        {
          level: 4,
          bullets: [
            {
              id: "4-1",
              text: "Coordinates recommendations from different members of the health care team to optimize patient care, resolving conflict when needed"
            },
            {
              id: "4-2",
              text: "Communicates feedback and constructive criticism to supervising individuals"
            }
          ],
          defaults: {
            R1: [
              1.0,
              1.5
            ],
            R2: [
              2.5,
              2.5
            ],
            R3: [
              3.0,
              4.0
            ]
          }
        },
        {
          level: 5,
          bullets: [
            {
              id: "5-1",
              text: "Role models flexible communication strategies that value input from all health care team members, resolving conflict when needed"
            },
            {
              id: "5-2",
              text: "Facilitates regular health care team-based feedback in complex situations"
            }
          ],
          defaults: {
            R1: [
              1.0,
              1.5
            ],
            R2: [
              2.5,
              2.5
            ],
            R3: [
              3.0,
              4.0
            ]
          }
        }
      ]
    },
    {
      name: "Interpersonal and Communication Skills 3: Communication within Health Care Systems",
      category: "Interpersonal and Communication Skills",
      levels: [
        {
          level: 1,
          bullets: [
            {
              id: "1-1",
              text: "Accurately and timely records information in the patient record"
            },
            {
              id: "1-2",
              text: "Learns institutional policy and safeguards patient personal health information"
            },
            {
              id: "1-3",
              text: "Communicates through appropriate channels as required by institutional policy (e.g., patient safety reports, cell phone/pager usage)"
            }
          ],
          defaults: {
            R1: [
              1.5,
              1.5
            ],
            R2: [
              2.5,
              2.5
            ],
            R3: [
              3.5,
              3.5
            ]
          }
        },
        {
          level: 2,
          bullets: [
            {
              id: "2-1",
              text: "Demonstrates organized diagnostic and therapeutic reasoning through notes in the patient record"
            },
            {
              id: "2-2",
              text: "Appropriately uses documentation shortcuts; records required data in formats and timeframes specified by institutional policy"
            },
            {
              id: "2-3",
              text: "Respectfully communicates concerns about the system"
            }
          ],
          defaults: {
            R1: [
              1.5,
              1.5
            ],
            R2: [
              2.5,
              2.5
            ],
            R3: [
              3.5,
              3.5
            ]
          }
        },
        {
          level: 3,
          bullets: [
            {
              id: "3-1",
              text: "Uses patient record to communicate updated and concise information in an organized format"
            },
            {
              id: "3-2",
              text: "Appropriately selects direct (e.g., telephone, inperson) and indirect (e.g., progress notes, text messages) forms of communication based on context and policy"
            },
            {
              id: "3-3",
              text: "Uses appropriate channels to offer clear and constructive suggestions for system improvement while acknowledging system limitations"
            }
          ],
          defaults: {
            R1: [
              1.5,
              1.5
            ],
            R2: [
              2.5,
              2.5
            ],
            R3: [
              3.5,
              3.5
            ]
          }
        },
        {
          level: 4,
          bullets: [
            {
              id: "4-1",
              text: "Demonstrates efficiency in documenting patient encounters and updating record"
            },
            {
              id: "4-2",
              text: "Manages the volume and extent of written and verbal communication that are required for practice"
            },
            {
              id: "4-3",
              text: "Initiates difficult conversations with appropriate stakeholders to improve the system"
            }
          ],
          defaults: {
            R1: [
              1.5,
              1.5
            ],
            R2: [
              2.5,
              2.5
            ],
            R3: [
              3.5,
              3.5
            ]
          }
        },
        {
          level: 5,
          bullets: [
            {
              id: "5-1",
              text: "Optimizes and improves functionality of the electronic medical record within their system"
            },
            {
              id: "5-2",
              text: "Guides departmental or institutional communication around policies and procedures"
            },
            {
              id: "5-3",
              text: "Facilitates dialogue regarding systems issues among larger community stakeholders (residency institution, health care system, field)"
            }
          ],
          defaults: {
            R1: [
              1.5,
              1.5
            ],
            R2: [
              2.5,
              2.5
            ],
            R3: [
              3.5,
              3.5
            ]
          }
        }
      ]
    }
  ];

  const fmtRange = (r: any) =>
    Array.isArray(r) && r.length >= 2 ? `${r[0]}-${r[1]}` : 'N/A';
  
  const getDefaultString = (defaults: any) =>
    `R1: ${fmtRange(defaults?.R1)}, R2: ${fmtRange(defaults?.R2)}, R3: ${fmtRange(defaults?.R3)}`;

  const isWithinDefault = (level: number, defaults: any) => {
  const range = defaults?.[residentYear];
  return Array.isArray(range) && range.length >= 2
    ? level >= range[0] && level <= range[1]
    : false;
  };
  const generateMilestonesText = () =>
    milestonesData
      .map(
        (m: any) =>
          `${m.name} (${m.category}): ${m.levels
            .map((l: any) => {
              const bulletText = l.bullets
                .map((b: any) => `${b.id} ${b.text}`)
                .join(' • ');
              const reqText = l.requirements ? ` [Req: ${l.requirements.join('; ')}]` : '';
              return `Level ${l.level}: ${bulletText}${reqText} [Defaults: ${getDefaultString(l.defaults)}]`;
            })
            .join(' | ')}`
      )
      .join('\n\n');

  React.useEffect(() => {
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setMicStatus('unsupported');
      setMicMessage('Voice input not supported. Use Chrome, Edge, or Safari.');
      return;
    }
    setMicStatus('ready');
    setMicMessage('Click microphone to start voice input');
  }, []);

  const startListening = async (forAmbient = false) => {
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setMicStatus('unsupported');
      return;
    }

    try {
      setMicStatus('requesting');
      setMicMessage('Requesting microphone access...');
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      await new Promise(resolve => setTimeout(resolve, 100));
      stream.getTracks().forEach(track => track.stop());
      
    } catch (err) {
  setMicStatus('denied');

  const e = err as { name?: string; message?: string };

  if (e.name === 'NotAllowedError') {
        setMicMessage('Microphone denied. Click lock icon in address bar → Site settings → Microphone → Allow, then reload.');
      } else if (e.name === 'NotFoundError') {
        setMicMessage('No microphone detected.');
      } else {
        setMicMessage(`Microphone error: ${e.message}`);
      }
      return;
    }

    try {
      const rec = new SpeechRecognitionAPI();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';
      
      rec.onstart = () => {
        setIsListening(true);
        if (forAmbient) setIsAmbientListening(true);
        setMicStatus('listening');
        setMicMessage('Listening... speak now');
      };
      
      rec.onresult = (e: any) => {
        let finalText = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) {
            finalText += e.results[i][0].transcript + ' ';
          }
        }
        if (finalText) {
          if (forAmbient || isAmbientListening) {
            setAmbientTranscript(prev => prev + finalText);
          } else {
            setQuery((prev: string) => prev + finalText);
          }
        }
      };
      
      rec.onerror = (e: any) => {
        setIsListening(false);
        setIsAmbientListening(false);
        if (e.error === 'not-allowed') {
          setMicStatus('denied');
          setMicMessage('Speech recognition denied. Check browser permissions.');
        } else if (e.error !== 'no-speech' && e.error !== 'aborted') {
          setMicStatus('error');
          setMicMessage(`Error: ${e.error}`);
        }
      };
      
      rec.onend = () => {
        setIsListening(false);
        if (!isAmbientListening) setMicStatus('ready');
      };
      
      setRecognition(rec);
      rec.start();
      
    } catch (err) {
      setMicStatus('error');
      const e = err as { message?: string };
      setMicMessage(`Failed: ${e.message ?? 'Unknown error'}`);
    }

  };

  const stopListening = () => {
    if (recognition) recognition.stop();
    setIsListening(false);
    setIsAmbientListening(false);
    setMicStatus('ready');
    setMicMessage('');
  };

  const analyzeWithAI = async (desc: string, isAmbient: boolean = false) => {
    setIsAnalyzing(true);
    setError(null);
    const contextNote = isAmbient ? "This is a transcript of a resident staffing a patient with an attending." : "This is a description of clinical activities.";
    const filterNote = includeDefaults ? `Include ALL matching milestones.` : `Only include milestones where level EXCEEDS ${residentYear} default upper bound.`;
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          messages: [{ role: 'user', content: `Analyze ${residentYear} FM resident activities against ACGME milestones. ${contextNote} ${filterNote}

ACTIVITIES: "${desc}"

MILESTONES: ${generateMilestonesText()}

Return JSON array: [{"milestone":"FULL NAME with number prefix e.g. 'Systems-Based Practice 2: System Navigation'","category":"","level":3,"explanation":"","requirements":[],"highlight":"pink/yellow/green/null","defaults":{"R1":[1.5,2.0],"R2":[2.5,3.0],"R3":[3.5,4.0]},"relevance":9,"advancementNote":"","isAdvancement":true}]

${includeDefaults ? '' : 'Return [] if no above-default matches.'} Max 8.` }]
        })
      });
      const data = await response.json();
      const match = data.content[0].text.match(/\[[\s\S]*\]/);
      if (match) {
        let parsed: any[] = JSON.parse(match[0]);
        if (!includeDefaults) {
          parsed = parsed.filter((r: any) => {
            const range = r?.defaults?.[residentYear];
            if (!Array.isArray(range) || range.length < 2) return true; // keep if no usable defaults
            return r.level > range[1];
          });
        }
        parsed.sort((a: any, b: any) => b.relevance - a.relevance);
        setResults(parsed);
      } else setResults([]);
    } catch (err) {
     const e = err as { message?: string };
     setError('Analysis failed: ' + (e.message ?? 'Unknown error'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const Badge = ({ type }: { type?: 'pink' | 'yellow' | 'green' }) => {
    const colors = { pink: 'bg-pink-100 text-pink-800', yellow: 'bg-yellow-100 text-yellow-800', green: 'bg-green-100 text-green-800' };
    const labels = { pink: 'Required', yellow: 'Advanced', green: 'Document' };
    return type ? <span className={`px-2 py-1 text-xs rounded font-medium ${colors[type]}`}>{labels[type]}</span> : null;
  };

  const categories = Array.from(
   new Set(milestonesData.map((m: any) => m.category))
  );

  const MicStatusBadge = () => {
    const statusConfig = {
      unknown: { color: 'bg-gray-500', text: 'Checking...' },
      unsupported: { color: 'bg-red-500', text: 'Not Supported' },
      ready: { color: 'bg-blue-500', text: 'Ready' },
      requesting: { color: 'bg-yellow-500', text: 'Requesting...' },
      denied: { color: 'bg-red-500', text: 'Denied' },
      listening: { color: 'bg-green-500 animate-pulse', text: 'Listening' },
      error: { color: 'bg-red-500', text: 'Error' }
    };
    const config = statusConfig[micStatus] || statusConfig.unknown;
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className={`w-2 h-2 rounded-full ${config.color}`}></span>
        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{config.text}</span>
      </div>
    );
  };

  const Browse = () => (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setSelectedCategory('all')} className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedCategory === 'all' ? 'bg-blue-600 text-white' : darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200'}`}>All ({milestonesData.length})</button>
        {categories.map(c => <button key={c} onClick={() => setSelectedCategory(c)} className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedCategory === c ? 'bg-blue-600 text-white' : darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200'}`}>{c} ({milestonesData.filter(m => m.category === c).length})</button>)}
      </div>
      <div className="space-y-3">
        {milestonesData.filter(m => selectedCategory === 'all' || m.category === selectedCategory).map(m => (
          <div key={m.name} className={`border rounded-lg shadow-sm overflow-hidden ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'}`}>
            <div className={`flex justify-between items-center p-4 cursor-pointer ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-50'}`} onClick={() => setExpandedMilestone(expandedMilestone === m.name ? null : m.name)}>
              <div className="flex-1"><h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{m.name}</h3><p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{m.category}</p></div>
              <div className="flex items-center gap-3">
                {m.levels.some(l => l.requirements) && <span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-orange-900/50 text-orange-300' : 'bg-orange-100 text-orange-700'}`}>Has Requirements</span>}
                {expandedMilestone === m.name ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
              </div>
            </div>
            {expandedMilestone === m.name && (
              <div className={`border-t p-4 space-y-4 ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-50'}`}>
                {m.levels.map(l => (
                  <div key={l.level} className={`border-l-4 pl-4 py-3 rounded-r-lg shadow-sm ${l.highlight === 'pink' ? 'border-pink-400' : l.highlight === 'yellow' ? 'border-yellow-400' : l.highlight === 'green' ? 'border-green-400' : 'border-blue-400'} ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="font-bold text-blue-500 text-lg">Level {l.level}</span>
                      {l.highlight && <Badge type={l.highlight as 'pink' | 'yellow' | 'green'} />}
                      {isWithinDefault(l.level, l.defaults) && <span className={`px-2 py-1 text-xs rounded font-medium ${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>{residentYear} Default</span>}
                    </div>
                    <ul className={`text-sm mb-2 list-disc pl-5 space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {l.bullets.map((b: any) => (
                        <li key={b.id}>
                          <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{b.id}</span>
                          {': '}{b.text}
                          {b.requirements && (
                            <div className={`mt-1 p-2 rounded border ${darkMode ? 'bg-orange-900/20 border-orange-800 text-orange-300' : 'bg-orange-50 border-orange-200 text-orange-800'}`}>
                              <p className="font-semibold text-xs mb-1">📋 Requirement(s) for {b.id}:</p>
                              <ul className="list-disc list-inside text-xs">
                                {b.requirements.map((req: string, j: number) => (
                                  <li key={j}>{req}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                    {l.requirements && <div className={`mt-2 p-3 rounded-lg border ${darkMode ? 'bg-orange-900/30 border-orange-800' : 'bg-orange-50 border-orange-200'}`}><p className={`font-semibold text-sm mb-1 ${darkMode ? 'text-orange-300' : 'text-orange-800'}`}>📋 Requirements:</p><ul className={`list-disc list-inside text-sm ${darkMode ? 'text-orange-400' : 'text-orange-700'}`}>{l.requirements.map((r, i) => <li key={i}>{r}</li>)}</ul></div>}
                    <p className={`text-xs mt-2 pt-2 border-t ${darkMode ? 'text-gray-500 border-gray-600' : 'text-gray-500 border-gray-100'}`}><strong>Defaults:</strong> {getDefaultString(l.defaults)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen p-4 md:p-6 transition-colors ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className="max-w-6xl mx-auto">
        <div className={`rounded-xl shadow-lg p-6 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className={`text-2xl md:text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>UACOMP FM CCC Milestones Analyzer</h1>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>AI-powered advancement analysis • {milestonesData.length} milestones</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{darkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
              <User size={20} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
              <select value={residentYear} onChange={(e) => setResidentYear(e.target.value as ResidentYear)} className={`px-4 py-2 border rounded-lg font-medium ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}>
                <option value="R1">R1 - PGY1</option>
                <option value="R2">R2 - PGY2</option>
                <option value="R3">R3 - PGY3</option>
              </select>
            </div>
          </div>
        </div>

        <div className={`rounded-xl shadow-lg p-6 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className={`flex gap-2 md:gap-4 mb-6 border-b overflow-x-auto pb-2 ${darkMode ? 'border-gray-700' : ''}`}>
            <button onClick={() => setActiveTab('search')} className={`pb-2 px-4 font-medium flex items-center gap-2 whitespace-nowrap ${activeTab === 'search' ? 'text-blue-500 border-b-2 border-blue-500' : darkMode ? 'text-gray-400' : 'text-gray-600'}`}><Search size={18} />Analyze</button>
            <button onClick={() => setActiveTab('ambient')} className={`pb-2 px-4 font-medium flex items-center gap-2 whitespace-nowrap ${activeTab === 'ambient' ? 'text-blue-500 border-b-2 border-blue-500' : darkMode ? 'text-gray-400' : 'text-gray-600'}`}><Radio size={18} />Ambient Staffing</button>
            <button onClick={() => setActiveTab('browse')} className={`pb-2 px-4 font-medium flex items-center gap-2 whitespace-nowrap ${activeTab === 'browse' ? 'text-blue-500 border-b-2 border-blue-500' : darkMode ? 'text-gray-400' : 'text-gray-600'}`}><BookOpen size={18} />Browse All</button>
          </div>

          {activeTab === 'search' && (
            <>
              <div className={`mb-4 p-3 rounded-lg border ${darkMode ? 'bg-blue-900/30 border-blue-800 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
                <p className="text-sm"><strong>📊 {includeDefaults ? 'All Matches' : 'Advancement'} Mode:</strong> {includeDefaults ? 'Showing all matches.' : `Only showing above-${residentYear}-default performance.`}</p>
              </div>
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Describe clinical activities for {residentYear}:</label>
                <div className="relative">
                  <textarea value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Type here or use voice input..." className={`w-full p-4 pr-14 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300'}`} rows={6} />
                  {micStatus !== 'unsupported' && (
                    <button onClick={() => isListening ? stopListening() : startListening(false)} className={`absolute right-3 top-3 p-2 rounded-lg ${isListening ? 'bg-red-500 text-white' : darkMode ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}>
                      {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                    </button>
                  )}
                </div>
                <div className="mt-2 flex items-center justify-between flex-wrap gap-2">
                  <MicStatusBadge />
                  {micMessage && <p className={`text-xs ${micStatus === 'denied' || micStatus === 'error' ? 'text-red-500' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{micMessage}</p>}
                </div>
                
                <div className="mt-4 flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={includeDefaults} onChange={(e) => setIncludeDefaults(e.target.checked)} className="sr-only peer" />
                    <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
                  </label>
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Include matches within {residentYear} default range</span>
                </div>
                
                <button onClick={() => analyzeWithAI(query, false)} disabled={isAnalyzing || !query.trim()} className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isAnalyzing ? <><Loader2 size={20} className="animate-spin" />Analyzing...</> : <><Search size={20} />{includeDefaults ? 'Find All Matches' : 'Find Advancement Opportunities'}</>}
                </button>
              </div>
              
              {error && <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-800'}`}>{error}</div>}
              
              {results !== null && (
                <div className="space-y-4">
                  {results.length === 0 ? (
                    <div className={`p-6 rounded-lg text-center ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
                      <p className="mb-2">No {includeDefaults ? 'matches' : 'advancement opportunities'} identified.</p>
                      <p className="text-sm opacity-75">{includeDefaults ? 'Try different activities.' : 'Activities appear within expected range. Try enabling "Include defaults" toggle.'}</p>
                    </div>
                  ) : (
                    <>
                      <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>🎯 {results.length} Match{results.length !== 1 ? 'es' : ''}</h2>
                      {results.map((r, i) => {
                        const isAbove = r.isAdvancement || (r.defaults?.[residentYear] && r.level > r.defaults[residentYear][1]);
                        return (
                          <div key={i} className={`border-2 rounded-lg p-5 ${isAbove ? (darkMode ? 'border-green-700 bg-green-900/20' : 'border-green-200 bg-green-50') : (darkMode ? 'border-blue-700 bg-blue-900/20' : 'border-blue-200 bg-blue-50')}`}>
                            <div className="flex flex-col md:flex-row md:justify-between gap-3 mb-3">
                              <div><h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>{r.milestone}</h3><p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{r.category}</p></div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={`px-3 py-1 text-white rounded-full font-bold text-sm ${isAbove ? 'bg-green-600' : 'bg-blue-600'}`}>Level {r.level}{isAbove ? ' ↑' : ''}</span>
                                {r.highlight && <Badge type={r.highlight} />}
                              </div>
                            </div>
                            <div className={`my-3 p-3 border-l-4 rounded-r ${darkMode ? 'bg-gray-700 border-gray-500' : 'bg-white border-gray-300'}`}><p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{r.explanation}</p></div>
                            {r.requirements?.length > 0 && <div className={`p-3 rounded-lg ${darkMode ? 'bg-orange-900/30' : 'bg-orange-50'}`}><p className={`font-semibold text-sm mb-1 ${darkMode ? 'text-orange-300' : 'text-orange-800'}`}>📋 Requirements:</p><ul className={`list-disc list-inside text-sm ${darkMode ? 'text-orange-400' : 'text-orange-700'}`}>{r.requirements.map((req: any, j: number) => <li key={j}>{req}</li>)}</ul></div>}
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              )}
            </>
          )}

          {activeTab === 'ambient' && (
            <>
              <div className={`mb-4 p-4 rounded-lg ${darkMode ? 'bg-purple-900/30 border border-purple-800' : 'bg-purple-50 border border-purple-200'}`}>
                <h3 className={`font-semibold mb-2 ${darkMode ? 'text-purple-300' : 'text-purple-800'}`}>🎙️ Ambient Staffing Listener</h3>
                <p className={`text-sm mb-2 ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>Record a patient staffing session. The AI will identify milestone opportunities from the conversation.</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap"><MicStatusBadge />{micMessage && <span className={`text-xs ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>{micMessage}</span>}</div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <button onClick={() => isAmbientListening ? stopListening() : startListening(true)} disabled={micStatus === 'unsupported'} className={`px-6 py-4 rounded-xl font-medium flex items-center gap-3 ${isAmbientListening ? 'bg-red-500 text-white animate-pulse' : 'bg-purple-600 text-white hover:bg-purple-700'} disabled:opacity-50`}>
                    {isAmbientListening ? <><Square size={24} />Stop Recording</> : <><Radio size={24} />Start Recording</>}
                  </button>
                </div>
                
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Transcript:</label>
                  <div className={`w-full p-4 border rounded-lg min-h-32 max-h-64 overflow-y-auto ${isAmbientListening ? (darkMode ? 'border-purple-600 bg-purple-900/20' : 'border-purple-300 bg-purple-50') : (darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50')}`}>
                    {ambientTranscript || <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>{isAmbientListening ? 'Listening...' : 'Transcript appears here...'}</span>}
                  </div>
                </div>
                
                {ambientTranscript && !isAmbientListening && (
                  <div className="flex gap-3">
                    <button onClick={() => analyzeWithAI(ambientTranscript, true)} disabled={isAnalyzing} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50">
                      {isAnalyzing ? <><Loader2 size={20} className="animate-spin" />Analyzing...</> : <><Search size={20} />Analyze</>}
                    </button>
                    <button onClick={() => setAmbientTranscript('')} className={`px-6 py-3 rounded-lg font-medium ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>Clear</button>
                  </div>
                )}
              </div>
              
              {error && <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-800'}`}>{error}</div>}
              
              {results !== null && activeTab === 'ambient' && results.length > 0 && (
                <div className="space-y-4">
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>🎯 {results.length} Match{results.length !== 1 ? 'es' : ''}</h2>
                  {results.map((r, i) => (
                    <div key={i} className={`border-2 rounded-lg p-5 ${darkMode ? 'border-green-700 bg-green-900/20' : 'border-green-200 bg-green-50'}`}>
                      <div className="flex flex-col md:flex-row md:justify-between gap-3 mb-3">
                        <div><h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>{r.milestone}</h3><p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{r.category}</p></div>
                        <span className="px-3 py-1 bg-green-600 text-white rounded-full font-bold text-sm self-start">Level {r.level}</span>
                      </div>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{r.explanation}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'browse' && <Browse />}
        </div>

        <div className={`rounded-xl shadow-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Legend:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-2"><Badge type="pink" /><span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Required activity</span></div>
            <div className="flex items-center gap-2"><Badge type="yellow" /><span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Advanced</span></div>
            <div className="flex items-center gap-2"><Badge type="green" /><span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Document examples</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilestonesApp;
