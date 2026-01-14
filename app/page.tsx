"use client";

import React from 'react';
import { Search, Loader2, Mic, MicOff, BookOpen, ChevronDown, ChevronUp, Radio, Square, User, Moon, Sun } from 'lucide-react';

type ResidentYear = "R1" | "R2" | "R3";

type DefaultRange = [number, number];

type DefaultsByYear = Record<ResidentYear, DefaultRange>;

const MilestonesApp = () => {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [isListening, setIsListening] = React.useState(false);
  const [isAmbientListening, setIsAmbientListening] = React.useState(false);
  const [recognition, setRecognition] = React.useState(null);
  const [activeTab, setActiveTab] = React.useState('search');
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [expandedMilestone, setExpandedMilestone] = React.useState(null);
  const [residentYear, setResidentYear] = React.useState<ResidentYear>('R1');
  const [ambientTranscript, setAmbientTranscript] = React.useState('');
  const [includeDefaults, setIncludeDefaults] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(false);
  const [micStatus, setMicStatus] = React.useState('unknown');
  const [micMessage, setMicMessage] = React.useState('');

  const milestonesData = [
    {
      name: "Patient Care 1: Care of the Acutely Ill Patient",
      category: "Patient Care",
      levels: [
        { level: 1, text: "Generates differential diagnosis for acute presentations. Recognizes role of clinical protocols and guidelines in acute situations.", defaults: { R1: [1.5, 2.0], R2: [2.5, 3.0], R3: [3.5, 4.0] } },
        { level: 2, text: "Prioritizes the differential diagnosis for acute presentations. Develops management plans for patients with common acute conditions.", defaults: { R1: [1.5, 2.0], R2: [2.5, 3.0], R3: [3.5, 4.0] } },
        { level: 3, text: "Promptly recognizes urgent and emergent situations and coordinates appropriate diagnostic strategies. Implements management plans for patients with complex acute conditions, including stabilizing acutely ill patients.", requirements: ["ICU and ED rotations required", "2nd year FMC Inpatient Wards rotation often required"], highlight: "pink", defaults: { R1: [1.5, 2.0], R2: [2.5, 3.0], R3: [3.5, 4.0] } },
        { level: 4, text: "Mobilizes the multidisciplinary team to manage care for simultaneous patient visits. Independently coordinates care for acutely ill patients with complex comorbidities.", requirements: ["FMC Inpatient Wards rotation as senior required"], highlight: "pink", defaults: { R1: [1.5, 2.0], R2: [2.5, 3.0], R3: [3.5, 4.0] } },
        { level: 5, text: "Efficiently manages and coordinates the care of multiple patients with a range of severity, including life-threatening conditions.", requirements: ["Above and beyond examples required"], highlight: "yellow", defaults: { R1: [1.5, 2.0], R2: [2.5, 3.0], R3: [3.5, 4.0] } }
      ]
    },
    {
      name: "Patient Care 2: Care of Patients with Chronic Illness",
      category: "Patient Care",
      levels: [
        { level: 1, text: "Recognizes that common conditions may be chronic. Formulates a basic management plan that addresses a chronic illness.", defaults: { R1: [1.5, 2.5], R2: [2.5, 3.5], R3: [3.5, 4.0] } },
        { level: 2, text: "Identifies variability in presentation and progression of chronic conditions. Accesses appropriate clinical guidelines.", defaults: { R1: [1.5, 2.5], R2: [2.5, 3.5], R3: [3.5, 4.0] } },
        { level: 3, text: "Synthesizes a patient centered management plan. Engages the patient in self-management of chronic conditions.", requirements: ["Specific examples of patient self-management required (e.g.: asthma action plan, self-titrating insulin)"], highlight: "pink", defaults: { R1: [1.5, 2.5], R2: [2.5, 3.5], R3: [3.5, 4.0] } },
        { level: 4, text: "Balances the competing needs of patients' comorbidities. Facilitates efforts at self-management including engagement of family and community resources.", requirements: ["Specific examples of patient self-management required"], highlight: "pink", defaults: { R1: [1.5, 2.5], R2: [2.5, 3.5], R3: [3.5, 4.0] } },
        { level: 5, text: "Leads multidisciplinary initiatives to manage patient populations with chronic conditions and comorbidities.", defaults: { R1: [1.5, 2.5], R2: [2.5, 3.5], R3: [3.5, 4.0] } }
      ]
    },
    {
      name: "Patient Care 3: Health Promotion and Wellness",
      category: "Patient Care",
      levels: [
        { level: 1, text: "Identifies screening and prevention guidelines. Identifies opportunities to maintain and promote wellness.", defaults: { R1: [1.5, 2.0], R2: [2.5, 3.5], R3: [3.5, 3.5] } },
        { level: 2, text: "Reconciles competing prevention guidelines to develop a plan for an individual patient.", defaults: { R1: [1.5, 2.0], R2: [2.5, 3.5], R3: [3.5, 3.5] } },
        { level: 3, text: "Identifies barriers and alternatives to preventive health tests, with the goal of shared decision making.", defaults: { R1: [1.5, 2.0], R2: [2.5, 3.5], R3: [3.5, 3.5] } },
        { level: 4, text: "Incorporates screening and prevention guidelines in patient care outside of designated wellness visits.", requirements: ["Regular meetings with Population Health AND improved screening rates", "Evidence of collaboration with Behavioral Health, Social Work"], highlight: "pink", defaults: { R1: [1.5, 2.0], R2: [2.5, 3.5], R3: [3.5, 3.5] } },
        { level: 5, text: "Participates in guideline development or implementation across a system of care or community.", defaults: { R1: [1.5, 2.0], R2: [2.5, 3.5], R3: [3.5, 3.5] } }
      ]
    },
    {
      name: "Patient Care 4: Ongoing Care of Patients with Undifferentiated Signs/Symptoms",
      category: "Patient Care",
      levels: [
        { level: 1, text: "Acknowledges the value of continuity in caring for patients with undifferentiated illness.", defaults: { R1: [1.5, 2.0], R2: [2.5, 3.0], R3: [3.0, 3.0] } },
        { level: 2, text: "Accepts uncertainty and maintains continuity while managing patients with undifferentiated illness.", defaults: { R1: [1.5, 2.0], R2: [2.5, 3.0], R3: [3.0, 3.0] } },
        { level: 3, text: "Facilitates patients' understanding of their expected course. Prioritizes cost-effective diagnostic testing.", requirements: ["Documentation of specific patient examples with longitudinal relationships required"], highlight: "green", defaults: { R1: [1.5, 2.0], R2: [2.5, 3.0], R3: [3.0, 3.0] } },
        { level: 4, text: "Coordinates collaborative treatment plans for patients with undifferentiated illness.", requirements: ["Documentation of specific patient examples with longitudinal relationships required"], highlight: "green", defaults: { R1: [1.5, 2.0], R2: [2.5, 3.0], R3: [3.0, 3.0] } },
        { level: 5, text: "Coordinates expanded initiatives to facilitate care of patients with undifferentiated illness.", defaults: { R1: [1.5, 2.0], R2: [2.5, 3.0], R3: [3.0, 3.0] } }
      ]
    },
    {
      name: "Patient Care 5: Management of Procedural Care",
      category: "Patient Care",
      levels: [
        { level: 1, text: "Identifies the breadth of procedures that family physicians perform.", defaults: { R1: [1.5, 2.0], R2: [2.5, 2.5], R3: [3.0, 4.0] } },
        { level: 2, text: "Identifies patients for whom a procedure is indicated. Counsels patients about expectations for common procedures.", defaults: { R1: [1.5, 2.0], R2: [2.5, 2.5], R3: [3.0, 4.0] } },
        { level: 3, text: "Demonstrates confidence and motor skills while performing procedures, including addressing complications.", defaults: { R1: [1.5, 2.0], R2: [2.5, 2.5], R3: [3.0, 4.0] } },
        { level: 4, text: "Independently performs procedures in the current practice environment.", requirements: ["Independent on majority of FMC Core Procedures"], highlight: "pink", defaults: { R1: [1.5, 2.0], R2: [2.5, 2.5], R3: [3.0, 4.0] } },
        { level: 5, text: "Identifies procedures needed in future practice and pursues supplemental training.", defaults: { R1: [1.5, 2.0], R2: [2.5, 2.5], R3: [3.0, 4.0] } }
      ]
    },
    {
      name: "Medical Knowledge 1: Medical Knowledge Breadth and Depth",
      category: "Medical Knowledge",
      levels: [
        { level: 1, text: "Describes the pathophysiology and treatments of patients with common conditions.", defaults: { R1: [1.5, 2.0], R2: [2.5, 3.0], R3: [3.5, 3.5] } },
        { level: 2, text: "Applies knowledge of pathophysiology with intellectual curiosity for treatment of patients.", defaults: { R1: [1.5, 2.0], R2: [2.5, 3.0], R3: [3.5, 3.5] } },
        { level: 3, text: "Demonstrates knowledge of complex pathophysiology and comprehensive management across the lifespan.", requirements: ["In-Training Exam score predictive of passing boards"], highlight: "pink", defaults: { R1: [1.5, 2.0], R2: [2.5, 3.0], R3: [3.5, 3.5] } },
        { level: 4, text: "Integrates clinical experience and comprehensive knowledge in the management of patients.", defaults: { R1: [1.5, 2.0], R2: [2.5, 3.0], R3: [3.5, 3.5] } },
        { level: 5, text: "Expands the knowledge base of family medicine through dissemination of original research.", defaults: { R1: [1.5, 2.0], R2: [2.5, 3.0], R3: [3.5, 3.5] } }
      ]
    },
    {
      name: "Medical Knowledge 2: Critical Thinking and Decision Making",
      category: "Medical Knowledge",
      levels: [
        { level: 1, text: "Incorporates key elements of a patient story into an accurate depiction. Describes common causes of clinical reasoning error.", defaults: { R1: [1.0, 1.5], R2: [2.0, 2.5], R3: [3.0, 3.5] } },
        { level: 2, text: "Develops an analytic, prioritized differential diagnosis for common presentations.", defaults: { R1: [1.0, 1.5], R2: [2.0, 2.5], R3: [3.0, 3.5] } },
        { level: 3, text: "Develops a prioritized differential diagnosis for complex presentations. Demonstrates structured approach to identify clinical reasoning errors.", requirements: ["Patient Safety Conference required"], highlight: "pink", defaults: { R1: [1.0, 1.5], R2: [2.0, 2.5], R3: [3.0, 3.5] } },
        { level: 4, text: "Synthesizes information to reach high probability diagnoses with continuous re-appraisal.", defaults: { R1: [1.0, 1.5], R2: [2.0, 2.5], R3: [3.0, 3.5] } },
        { level: 5, text: "Engages in deliberate practice and coaches others to minimize clinical reasoning errors.", defaults: { R1: [1.0, 1.5], R2: [2.0, 2.5], R3: [3.0, 3.5] } }
      ]
    },
    {
      name: "Systems-Based Practice 1: Patient Safety and Quality Improvement",
      category: "Systems-Based Practice",
      levels: [
        { level: 1, text: "Demonstrates knowledge of common patient safety events and how to report them.", defaults: { R1: [1.5, 2.0], R2: [2.5, 3.0], R3: [3.5, 3.5] } },
        { level: 2, text: "Identifies system factors that lead to patient safety events. Reports patient safety events.", requirements: ["Incident Report AND logging in New Innovations"], highlight: "pink", defaults: { R1: [1.5, 2.0], R2: [2.5, 3.0], R3: [3.5, 3.5] } },
        { level: 3, text: "Participates in analysis of patient safety events. Participates in local quality improvement initiatives.", requirements: ["Attendance at multiple Patient Safety Conferences"], highlight: "pink", defaults: { R1: [1.5, 2.0], R2: [2.5, 3.0], R3: [3.5, 3.5] } },
        { level: 4, text: "Conducts analysis of patient safety events and offers error prevention strategies.", requirements: ["Give Patient Safety Conference (logged in New Innovations)", "Completion of ABFM QI project"], highlight: "pink", defaults: { R1: [1.5, 2.0], R2: [2.5, 3.0], R3: [3.5, 3.5] } },
        { level: 5, text: "Actively engages teams to modify systems to prevent patient safety events.", defaults: { R1: [1.5, 2.0], R2: [2.5, 3.0], R3: [3.5, 3.5] } }
      ]
    },
    {
      name: "Systems-Based Practice 2: System Navigation for Patient-Centered Care",
      category: "Systems-Based Practice",
      levels: [
        { level: 1, text: "Demonstrates knowledge of care coordination and transitions of care.", defaults: { R1: [1.5, 1.5], R2: [2.5, 3.0], R3: [3.5, 3.5] } },
        { level: 2, text: "Coordinates care of patients in routine clinical situations using interprofessional team.", requirements: ["Community Medicine rotation and community needs assessment"], highlight: "pink", defaults: { R1: [1.5, 1.5], R2: [2.5, 3.0], R3: [3.5, 3.5] } },
        { level: 3, text: "Coordinates care of patients in complex clinical situations effectively.", requirements: ["Evidence of consultations with Behavioral Health and Social Work", "Community Medicine rotation and community needs assessment"], highlight: "pink", defaults: { R1: [1.5, 1.5], R2: [2.5, 3.0], R3: [3.5, 3.5] } },
        { level: 4, text: "Role models effective coordination of patient centered care among different disciplines.", defaults: { R1: [1.5, 1.5], R2: [2.5, 3.0], R3: [3.5, 3.5] } },
        { level: 5, text: "Analyses the process of care coordination and leads in design and implementation of improvements.", defaults: { R1: [1.5, 1.5], R2: [2.5, 3.0], R3: [3.5, 3.5] } }
      ]
    },
    {
      name: "Systems-Based Practice 3: Physician Role in Health Care Systems",
      category: "Systems-Based Practice",
      levels: [
        { level: 1, text: "Identifies key components of the complex health care system. Describes basic health payment systems.", defaults: { R1: [1.5, 1.5], R2: [2.5, 2.5], R3: [3.0, 4.0] } },
        { level: 2, text: "Describes how components of a complex health care system are interrelated.", defaults: { R1: [1.5, 1.5], R2: [2.5, 2.5], R3: [3.0, 4.0] } },
        { level: 3, text: "Discusses how individual practice affects the broader system. Engages in shared decision making.", defaults: { R1: [1.5, 1.5], R2: [2.5, 2.5], R3: [3.0, 4.0] } },
        { level: 4, text: "Manages various components of the complex health care system. Advocates for patient care needs.", defaults: { R1: [1.5, 1.5], R2: [2.5, 2.5], R3: [3.0, 4.0] } },
        { level: 5, text: "Advocates for or leads systems change that enhances high-value, efficient patient care.", defaults: { R1: [1.5, 1.5], R2: [2.5, 2.5], R3: [3.0, 4.0] } }
      ]
    },
    {
      name: "Systems-Based Practice 4: Advocacy",
      category: "Systems-Based Practice",
      levels: [
        { level: 1, text: "Identifies that advocating for patient populations is a professional responsibility.", defaults: { R1: [2.0, 2.0], R2: [2.5, 3.0], R3: [3.0, 3.0] } },
        { level: 2, text: "Identifies that advocating for family medicine is a professional responsibility.", defaults: { R1: [2.0, 2.0], R2: [2.5, 3.0], R3: [3.0, 3.0] } },
        { level: 3, text: "Describes how stakeholders influence and are affected by health policy.", defaults: { R1: [2.0, 2.0], R2: [2.5, 3.0], R3: [3.0, 3.0] } },
        { level: 4, text: "Accesses advocacy tools and resources needed to achieve policy change.", defaults: { R1: [2.0, 2.0], R2: [2.5, 3.0], R3: [3.0, 3.0] } },
        { level: 5, text: "Develops relationships with stakeholders that advances policy change.", defaults: { R1: [2.0, 2.0], R2: [2.5, 3.0], R3: [3.0, 3.0] } }
      ]
    },
    {
      name: "Practice-Based Learning 1: Evidence-Based and Informed Practice",
      category: "Practice-Based Learning",
      levels: [
        { level: 1, text: "Demonstrates how to access, categorize, and analyze clinical evidence.", defaults: { R1: [1.5, 2.0], R2: [2.5, 3.0], R3: [3.5, 4.0] } },
        { level: 2, text: "Articulates clinical questions and elicits patient preferences to guide evidence-based care.", requirements: ["2 PICO presentations (logged in New Innovations)"], highlight: "pink", defaults: { R1: [1.5, 2.0], R2: [2.5, 3.0], R3: [3.5, 4.0] } },
        { level: 3, text: "Locates and applies the best available evidence to the care of complex patients.", requirements: ["Journal Club presentation (logged in New Innovations)"], highlight: "pink", defaults: { R1: [1.5, 2.0], R2: [2.5, 3.0], R3: [3.5, 4.0] } },
        { level: 4, text: "Critically appraises and applies evidence even in the face of uncertainty.", requirements: ["Both EBM presentations (logged in New Innovations)"], highlight: "pink", defaults: { R1: [1.5, 2.0], R2: [2.5, 3.0], R3: [3.5, 4.0] } },
        { level: 5, text: "Coaches others to critically appraise and apply evidence for complex patients.", defaults: { R1: [1.5, 2.0], R2: [2.5, 3.0], R3: [3.5, 4.0] } }
      ]
    },
    {
      name: "Practice-Based Learning 2: Reflective Practice and Personal Growth",
      category: "Practice-Based Learning",
      levels: [
        { level: 1, text: "Accepts responsibility for personal and professional development by establishing goals.", defaults: { R1: [1.5, 2.0], R2: [2.5, 3.0], R3: [3.5, 3.5] } },
        { level: 2, text: "Demonstrates openness to performance data to inform goals. Designs and implements a learning plan.", requirements: ["Individualized Learning Plan in New Innovations every 6 months"], highlight: "pink", defaults: { R1: [1.5, 2.0], R2: [2.5, 3.0], R3: [3.5, 3.5] } },
        { level: 3, text: "Intermittently seeks additional performance data. Independently creates and implements a learning plan.", requirements: ["Individualized Learning Plan in New Innovations every 6 months"], highlight: "pink", defaults: { R1: [1.5, 2.0], R2: [2.5, 3.0], R3: [3.5, 3.5] } },
        { level: 4, text: "Consistently seeks performance data with adaptability and humility.", defaults: { R1: [1.5, 2.0], R2: [2.5, 3.0], R3: [3.5, 3.5] } },
        { level: 5, text: "Leads performance review processes. Coaches others on reflective practice.", defaults: { R1: [1.5, 2.0], R2: [2.5, 3.0], R3: [3.5, 3.5] } }
      ]
    },
    {
      name: "Professionalism 1: Professional Behavior and Ethical Principles",
      category: "Professionalism",
      levels: [
        { level: 1, text: "Describes professional behavior and potential triggers for personal lapses.", defaults: { R1: [1.0, 1.5], R2: [2.0, 2.5], R3: [2.5, 3.5] } },
        { level: 2, text: "Demonstrates professional behavior in routine situations.", defaults: { R1: [1.0, 1.5], R2: [2.0, 2.5], R3: [2.5, 3.5] } },
        { level: 3, text: "Demonstrates professional behavior in complex or stressful situations.", defaults: { R1: [1.0, 1.5], R2: [2.0, 2.5], R3: [2.5, 3.5] } },
        { level: 4, text: "Recognizes situations that may trigger professionalism lapses and intervenes to prevent them.", defaults: { R1: [1.0, 1.5], R2: [2.0, 2.5], R3: [2.5, 3.5] } },
        { level: 5, text: "Mentors others in professional behavior. Addresses system-level factors.", defaults: { R1: [1.0, 1.5], R2: [2.0, 2.5], R3: [2.5, 3.5] } }
      ]
    },
    {
      name: "Professionalism 2: Accountability/Conscientiousness",
      category: "Professionalism",
      levels: [
        { level: 1, text: "Takes responsibility for failure to complete tasks. Responds promptly to requests.", defaults: { R1: [1.5, 2.0], R2: [2.5, 3.0], R3: [3.0, 3.0] } },
        { level: 2, text: "Performs tasks in a timely manner with appropriate attention to detail in routine situations.", defaults: { R1: [1.5, 2.0], R2: [2.5, 3.0], R3: [3.0, 3.0] } },
        { level: 3, text: "Performs tasks in a timely manner in complex or stressful situations.", defaults: { R1: [1.5, 2.0], R2: [2.5, 3.0], R3: [3.0, 3.0] } },
        { level: 4, text: "Recognizes and addresses situations that may impact others' ability to complete tasks.", defaults: { R1: [1.5, 2.0], R2: [2.5, 3.0], R3: [3.0, 3.0] } },
        { level: 5, text: "Takes ownership of system outcomes.", defaults: { R1: [1.5, 2.0], R2: [2.5, 3.0], R3: [3.0, 3.0] } }
      ]
    },
    {
      name: "Professionalism 3: Self-Awareness and Help-Seeking Behaviors",
      category: "Professionalism",
      levels: [
        { level: 1, text: "Recognizes status of personal and professional well-being, with assistance.", defaults: { R1: [1.5, 2.0], R2: [2.5, 3.0], R3: [3.5, 4.0] } },
        { level: 2, text: "Independently recognizes status of personal and professional well-being.", defaults: { R1: [1.5, 2.0], R2: [2.5, 3.0], R3: [3.5, 4.0] } },
        { level: 3, text: "Proposes a plan to optimize personal and professional well-being, with guidance.", requirements: ["At least one ILP goal must be personal rather than professional"], highlight: "pink", defaults: { R1: [1.5, 2.0], R2: [2.5, 3.0], R3: [3.5, 4.0] } },
        { level: 4, text: "Independently develops a plan to optimize personal and professional well-being.", requirements: ["At least one ILP goal must be personal rather than professional"], highlight: "pink", defaults: { R1: [1.5, 2.0], R2: [2.5, 3.0], R3: [3.5, 4.0] } },
        { level: 5, text: "Addresses system barriers to maintain personal and professional well-being.", defaults: { R1: [1.5, 2.0], R2: [2.5, 3.0], R3: [3.5, 4.0] } }
      ]
    },
    {
      name: "Interpersonal Skills 1: Patient- and Family-Centered Communication",
      category: "Interpersonal and Communication Skills",
      levels: [
        { level: 1, text: "Uses language and nonverbal behavior to demonstrate respect. Recognizes barriers to communication.", defaults: { R1: [1.5, 1.5], R2: [2.5, 3.0], R3: [3.5, 4.0] } },
        { level: 2, text: "Establishes a therapeutic relationship in straightforward encounters using active listening.", defaults: { R1: [1.5, 1.5], R2: [2.5, 3.0], R3: [3.5, 4.0] } },
        { level: 3, text: "Establishes a therapeutic relationship in challenging patient encounters.", defaults: { R1: [1.5, 1.5], R2: [2.5, 3.0], R3: [3.5, 4.0] } },
        { level: 4, text: "Maintains therapeutic relationships regardless of complexity. Uses shared decision making.", defaults: { R1: [1.5, 1.5], R2: [2.5, 3.0], R3: [3.5, 4.0] } },
        { level: 5, text: "Mentors others in situational awareness. Role models shared decision making.", defaults: { R1: [1.5, 1.5], R2: [2.5, 3.0], R3: [3.5, 4.0] } }
      ]
    },
    {
      name: "Interpersonal Skills 2: Interprofessional and Team Communication",
      category: "Interpersonal and Communication Skills",
      levels: [
        { level: 1, text: "Respectfully requests/receives a consultation. Uses language that values all team members.", defaults: { R1: [1.0, 1.5], R2: [2.5, 2.5], R3: [3.0, 4.0] } },
        { level: 2, text: "Clearly and concisely requests/responds to a consultation.", defaults: { R1: [1.0, 1.5], R2: [2.5, 2.5], R3: [3.0, 4.0] } },
        { level: 3, text: "Checks understanding of consult recommendations. Provides feedback to peers and learners.", defaults: { R1: [1.0, 1.5], R2: [2.5, 2.5], R3: [3.0, 4.0] } },
        { level: 4, text: "Coordinates recommendations from different team members, resolving conflict when needed.", defaults: { R1: [1.0, 1.5], R2: [2.5, 2.5], R3: [3.0, 4.0] } },
        { level: 5, text: "Role models flexible communication strategies that value input from all team members.", defaults: { R1: [1.0, 1.5], R2: [2.5, 2.5], R3: [3.0, 4.0] } }
      ]
    },
    {
      name: "Interpersonal Skills 3: Communication within Health Care Systems",
      category: "Interpersonal and Communication Skills",
      levels: [
        { level: 1, text: "Accurately and timely records information in the patient record.", defaults: { R1: [1.5, 1.5], R2: [2.5, 2.5], R3: [3.5, 3.5] } },
        { level: 2, text: "Demonstrates organized diagnostic and therapeutic reasoning through notes.", defaults: { R1: [1.5, 1.5], R2: [2.5, 2.5], R3: [3.5, 3.5] } },
        { level: 3, text: "Uses patient record to communicate updated and concise information.", defaults: { R1: [1.5, 1.5], R2: [2.5, 2.5], R3: [3.5, 3.5] } },
        { level: 4, text: "Demonstrates efficiency in documenting patient encounters.", defaults: { R1: [1.5, 1.5], R2: [2.5, 2.5], R3: [3.5, 3.5] } },
        { level: 5, text: "Optimizes and improves functionality of the electronic medical record.", defaults: { R1: [1.5, 1.5], R2: [2.5, 2.5], R3: [3.5, 3.5] } }
      ]
    }
  ];

  const getDefaultString = (defaults: DefaultsByYear) =>
    `R1: ${defaults.R1[0]}-${defaults.R1[1]}, R2: ${defaults.R2[0]}-${defaults.R2[1]}, R3: ${defaults.R3[0]}-${defaults.R3[1]}`;
  const isWithinDefault = (
  level: number,
  defaults: DefaultsByYear
) =>
  level >= defaults[residentYear][0] &&
  level <= defaults[residentYear][1];
  const generateMilestonesText = () => milestonesData.map(m => `${m.name} (${m.category}): ${m.levels.map(l => `Level ${l.level}: ${l.text}${l.requirements ? ` [Req: ${l.requirements.join('; ')}]` : ''} [Defaults: R1:${l.defaults.R1[0]}-${l.defaults.R1[1]}, R2:${l.defaults.R2[0]}-${l.defaults.R2[1]}, R3:${l.defaults.R3[0]}-${l.defaults.R3[1]}]`).join(' | ')}`).join('\n\n');

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
      
      rec.onresult = (e: SpeechRecognitionEvent) => {
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
            setQuery(prev => prev + finalText);
          }
        }
      };
      
      rec.onerror = (e) => {
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
      setMicMessage(`Failed: ${e.message}`);
    }
  };

  const stopListening = () => {
    if (recognition) recognition.stop();
    setIsListening(false);
    setIsAmbientListening(false);
    setMicStatus('ready');
    setMicMessage('');
  };

  const analyzeWithAI = async (desc, isAmbient = false) => {
    setIsAnalyzing(true);
    setError(null);
    const contextNote = isAmbient ? "This is a transcript of a resident staffing a patient with an attending." : "This is a description of clinical activities.";
    const filterNote = includeDefaults ? `Include ALL matching milestones.` : `Only include milestones where level EXCEEDS ${residentYear} default upper bound.`;
    
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
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
        let parsed = JSON.parse(match[0]);
        if (!includeDefaults) {
          parsed = parsed.filter(r => !r.defaults || !r.defaults[residentYear] || r.level > r.defaults[residentYear][1]);
        }
        parsed.sort((a, b) => b.relevance - a.relevance);
        setResults(parsed);
      } else setResults([]);
    } catch (err) {
      setError('Analysis failed: ' + e.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const Badge = ({ type }) => {
    const colors = { pink: 'bg-pink-100 text-pink-800', yellow: 'bg-yellow-100 text-yellow-800', green: 'bg-green-100 text-green-800' };
    const labels = { pink: 'Required', yellow: 'Advanced', green: 'Document' };
    return type ? <span className={`px-2 py-1 text-xs rounded font-medium ${colors[type]}`}>{labels[type]}</span> : null;
  };

  const categories = [...new Set(milestonesData.map(m => m.category))];

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
                      {l.highlight && <Badge type={l.highlight} />}
                      {isWithinDefault(l.level, l.defaults) && <span className={`px-2 py-1 text-xs rounded font-medium ${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>{residentYear} Default</span>}
                    </div>
                    <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{l.text}</p>
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
              <select value={residentYear} onChange={(e) => setResidentYear(e.target.value)} className={`px-4 py-2 border rounded-lg font-medium ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}>
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
                  <textarea value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Type here or use voice input..." className={`w-full p-4 pr-14 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300'}`} rows="6" />
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
                            {r.requirements?.length > 0 && <div className={`p-3 rounded-lg ${darkMode ? 'bg-orange-900/30' : 'bg-orange-50'}`}><p className={`font-semibold text-sm mb-1 ${darkMode ? 'text-orange-300' : 'text-orange-800'}`}>📋 Requirements:</p><ul className={`list-disc list-inside text-sm ${darkMode ? 'text-orange-400' : 'text-orange-700'}`}>{r.requirements.map((req, j) => <li key={j}>{req}</li>)}</ul></div>}
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
