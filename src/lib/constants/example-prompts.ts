interface ExamplePrompt {
  type: "form" | "content";
  action: "Create" | "Design" | "Generate";
  pages: number;
  title: string;
  description: string;
  prompt: string;
}

export const examplePrompts: {
  forms: ExamplePrompt[];
  content: ExamplePrompt[];
} = {
  forms: [
    {
      type: "form",
      action: "Create",
      pages: 3,
      title: "Customer Feedback Form",
      description: "A comprehensive feedback form for restaurant customers",
      prompt:
        "Create a 3-page customer feedback form for a restaurant. Page 1: Basic info with 2-3 quick questions about visit date and party size. Page 2: Detailed feedback with 5-7 rating questions about service quality, food taste, ambiance, and cleanliness. Page 3: Open-ended suggestions and loyalty program opt-in",
    },
    {
      type: "form",
      action: "Design",
      pages: 4,
      title: "Employee Onboarding Form",
      description:
        "Complete employee onboarding process with all necessary documentation",
      prompt:
        "Design a 4-page employee onboarding form. Page 1: Personal details. Page 2: Emergency contacts and medical info. Page 3: Tax and banking details with W-4 form fields. Page 4: Company policy acknowledgments with checkboxes for each policy",
    },
    {
      type: "form",
      action: "Generate",
      pages: 5,
      title: "Patient Intake Form",
      description: "Comprehensive form for dental clinic patients",
      prompt:
        "Generate a 5-page patient intake form for a dental clinic. Page 1: Patient demographics (8-10 fields). Page 2: Medical history checklist. Page 3: Current medications and allergies. Page 4: Dental history with multiple-choice questions. Page 5: Insurance and consent forms with signature field",
    },
    {
      type: "form",
      action: "Create",
      pages: 3,
      title: "Student Registration Form",
      description: "Registration form with conditional logic for students",
      prompt:
        "Create a 3-page student registration form with conditional logic. Page 1: Personal and academic details. Page 2: Course selection (allow multiple selections from courses). Page 3: Housing preferences (only show if 'on-campus housing' is selected) and meal plan options",
    },
    {
      type: "form",
      action: "Design",
      pages: 4,
      title: "Rental Application",
      description: "Application for rental property with validation",
      prompt:
        "Design a 4-page rental application with validation. Page 1: Applicant info with income verification. Page 2: Rental history (last 3 properties). Page 3: Employment history with reference contacts. Page 4: Background check authorization and lease terms acceptance",
    },
    {
      type: "form",
      action: "Generate",
      pages: 3,
      title: "Conference Registration",
      description: "Registration form for conference with dynamic pricing",
      prompt:
        "Generate a 3-page conference registration with dynamic pricing. Page 1: Attendee details and ticket type selection. Page 2: Workshop preferences (limit 3 selections) and dietary requirements. Page 3: Payment details and terms acceptance",
    },
    {
      type: "form",
      action: "Create",
      pages: 5,
      title: "Job Application Form",
      description: "Comprehensive job application form with file uploads",
      prompt:
        "Create a 5-page job application form with file uploads. Page 1: Personal info and position details. Page 2: Education history (multiple entries). Page 3: Work experience (multiple entries). Page 4: Skills assessment and portfolio upload. Page 5: References and availability",
    },
    {
      type: "form",
      action: "Design",
      pages: 2,
      title: "Volunteer Registration Form",
      description: "Registration form for volunteers with scheduling",
      prompt:
        "Design a 2-page volunteer registration form with scheduling. Page 1: Personal info and skills inventory. Page 2: Availability calendar and background check consent",
    },
    {
      type: "form",
      action: "Create",
      pages: 5,
      title: "Passport Application Form",
      description: "Application form for obtaining a passport",
      prompt:
        "Create a 5-page passport application form. Page 1: Personal information. Page 2: Address history (current + previous 2 years) and contact details. Page 3: Travel information (intended dates, countries) and emergency contacts. Page 4: Document upload (photo requirements, previous passport, citizenship proof). Page 5: Declaration and payment details with digital signature",
    },
    {
      type: "form",
      action: "Design",
      pages: 4,
      title: "Business License Application",
      description: "Application form for obtaining a business license",
      prompt:
        "Design a 4-page business license application form. Page 1: Business details (name, type, address, etc). Page 2: Owner information (multiple owners supported) with background check consent. Page 3: Business activity (industry codes, detailed operations description, zoning compliance). Page 4: Insurance information and regulatory compliance checklist",
    },
    {
      type: "form",
      action: "Generate",
      pages: 6,
      title: "Building Permit Application",
      description: "Application for obtaining a building permit",
      prompt:
        "Generate a 6-page building permit application. Page 1: Property information (address, zoning, ownership, etc). Page 2: Project details (type, scope, value, contractor info). Page 3: Site plan upload with dimension requirements. Page 4: Construction drawings and specifications. Page 5: Environmental impact assessment. Page 6: Owner and contractor declarations with multiple signatures",
    },
    {
      type: "form",
      action: "Create",
      pages: 3,
      title: "Vehicle Registration Form",
      description: "Form for registering a vehicle",
      prompt:
        "Create a 3-page vehicle registration form. Page 1: Vehicle information (make, model, VIN, etc) with validation. Page 2: Owner details and insurance information (policy number, coverage dates). Page 3: Payment calculator (fees based on vehicle type/age) and payment processing",
    },
    {
      type: "form",
      action: "Design",
      pages: 4,
      title: "Social Services Application",
      description: "Application for social services",
      prompt:
        "Design a 4-page social services application. Page 1: Applicant demographics (personal info, household size, income). Page 2: Income verification (employment, benefits, assets, with file uploads). Page 3: Needs assessment (program selection, eligibility criteria). Page 4: Supporting documentation checklist and declaration",
    },
    {
      type: "form",
      action: "Generate",
      pages: 5,
      title: "Small Business Grant Application",
      description: "Application for obtaining a small business grant",
      prompt:
        "Generate a 5-page small business grant application. Page 1: Business profile (operations, employees, revenue). Page 2: Financial impact statement (losses, current needs). Page 3: Fund usage plan with budget breakdown. Page 4: Supporting document uploads (tax returns, bank statements). Page 5: Compliance certification and terms acceptance",
    },
    {
      type: "form",
      action: "Create",
      pages: 4,
      title: "Municipal Tax Assessment Appeal",
      description: "Form for appealing a municipal tax assessment",
      prompt:
        "Create a 4-page municipal tax assessment appeal form. Page 1: Property details (address, tax ID, current assessment). Page 2: Grounds for appeal (market analysis, comparable properties). Page 3: Supporting evidence upload (appraisals, photos). Page 4: Hearing preference and contact information",
    },
    {
      type: "form",
      action: "Design",
      pages: 3,
      title: "Government Contractor Registration",
      description: "Form for registering as a government contractor",
      prompt:
        "Design a 3-page government contractor registration form. Page 1: Company information (legal structure, certifications). Page 2: Past performance (previous contracts, references). Page 3: Capability statement and NAICS code selection (multiple selections)",
    },
    {
      type: "form",
      action: "Create",
      pages: 4,
      title: "Technical Certification Exam",
      description: "Exam for obtaining a technical certification",
      prompt:
        "Create a 4-page technical certification exam. Page 1: Candidate information and exam rules. Page 2: Multiple choice questions (30 questions, 4 options each, 2 points per question). Page 3: Practical coding problems (5 questions, code editor integration). Page 4: System design case study (1 question, file upload for diagrams). Include timer, question navigation, and auto-save",
    },
    {
      type: "form",
      action: "Design",
      pages: 3,
      title: "Language Proficiency Assessment",
      description: "Assessment for language proficiency",
      prompt:
        "Design a 3-page language proficiency assessment. Page 1: Personal details and test preferences (8 fields). Page 2: Reading comprehension (20 questions, 3 passages). Page 3: Writing assessment (2 prompts, file upload for essays). Include word count tracker and time remaining display",
    },
    {
      type: "form",
      action: "Generate",
      pages: 5,
      title: "Medical Board Exam Simulation",
      description: "Simulation for a medical board exam",
      prompt:
        "Generate a 5-page medical board exam simulation. Page 1: Candidate verification and exam instructions. Page 2: Clinical case studies. Page 3: Multiple choice questions. Page 4: Image-based questions. Page 5: Emergency scenario responses. Include progress tracking and section timers",
    },
    {
      type: "form",
      action: "Create",
      pages: 4,
      title: "Driving Theory Test",
      description: "Test for obtaining a driver's license",
      prompt:
        "Create a 4-page driving theory test. Page 1: Learner information and test center details. Page 2: Road signs and regulations. Page 3: Traffic rules and safety. Page 4: Vehicle maintenance and emergency procedures. Include instant feedback and score calculation",
    },
    {
      type: "form",
      action: "Design",
      pages: 3,
      title: "Professional Ethics Assessment",
      description: "Assessment for professional ethics",
      prompt:
        "Design a 3-page professional ethics assessment. Page 1: Participant information and consent. Page 2: Scenario-based questions. Page 3: Case study analysis (3 detailed cases). Include reasoning text fields and scoring rubric",
    },
    {
      type: "form",
      action: "Generate",
      pages: 4,
      title: "Mathematics Placement Test",
      description: "Test for determining mathematics placement",
      prompt:
        "Generate a 4-page mathematics placement test. Page 1: Student information and academic history. Page 2: Algebra and functions (5 questions). Page 3: Calculus and trigonometry (5 questions). Page 4: Statistics and probability (5 questions). Include formula sheet and calculator integration",
    },
    {
      type: "form",
      action: "Create",
      pages: 5,
      title: "Project Management Certification Exam",
      description: "Exam for obtaining a project management certification",
      prompt:
        "Create a 5-page project management certification exam. Page 1: Candidate details and exam guidelines. Page 2: PMBOK knowledge areas (5 questions). Page 3: Risk management scenarios (5 case studies). Page 4: Schedule and cost calculations (5 problems). Page 5: Stakeholder management (10 scenarios). Include progress bar and section navigation",
    },
    {
      type: "form",
      action: "Design",
      pages: 3,
      title: "Cybersecurity Assessment",
      description: "Assessment for cybersecurity knowledge",
      prompt:
        "Design a 3-page cybersecurity assessment. Page 1: Participant information and security clearance. Page 2: Technical knowledge (5 multiple choice). Page 3: Incident response simulation (5 scenarios). Include real-time threat detection and response tracking",
    },
    {
      type: "form",
      action: "Generate",
      pages: 4,
      title: "Legal Bar Exam Practice Test",
      description: "Practice test for a legal bar exam",
      prompt:
        "Generate a 4-page legal bar exam practice test. Page 1: Candidate verification and exam rules. Page 2: Constitutional law (5 questions). Page 3: Criminal and civil procedure (5 questions). Page 4: Case analysis and writing (3 essay prompts). Include citation guidelines and time management tools",
    },
    {
      type: "form",
      action: "Create",
      pages: 3,
      title: "Sales Skills Assessment",
      description: "Assessment for sales skills",
      prompt:
        "Create a 3-page sales skills assessment. Page 1: Salesperson information and experience level. Page 2: Product knowledge quiz (5 questions). Page 3: Sales scenario responses (5 role-play situations). Include performance metrics and improvement suggestions",
    },
  ],
  content: [
    {
      type: "content",
      action: "Create",
      pages: 6,
      title: "Product Documentation",
      description:
        "Comprehensive product documentation with installation and troubleshooting",
      prompt:
        "Create a 6-page product documentation with no input fields. Page 1: Overview and quick start (2-3 paragraphs, bullet points). Pages 2-3: Step-by-step installation guide with code snippets (steps, bash commands, config examples). Page 4: Configuration options with tables (settings, default values, descriptions). Pages 5-6: Troubleshooting guide with common issues and solutions (scenarios, error messages, resolution steps). Include images for each major step. (No Questions)",
    },
    {
      type: "content",
      action: "Generate",
      pages: 5,
      title: "Training Guide",
      description:
        "Company training guide with knowledge checks and procedures",
      prompt:
        "Generate a 5-module training guide with knowledge checks. Module 1: Company overview (mission, values, history, 2-3 pages). Module 2: Department procedures (SOPs, workflow diagrams). Module 3: Safety protocols (emergency procedures, hazard identification). Module 4: Systems training (login guides, feature tutorials). Module 5: Best practices (tips, examples, case studies). Each module should have 2-3 pages with images and optional video placeholders. (No Questions except knowledge checks)",
    },
    {
      type: "content",
      action: "Design",
      pages: 4,
      title: "Course Syllabus Template",
      description: "Template for a course syllabus",
      prompt:
        "Design a 4-section course syllabus template. Section 1: Course objectives and learning outcomes (5-7 measurable goals). Section 2: Weekly schedule in table format (15-week semester, 3-4 activities per week). Section 3: Assignment details with grading rubrics (assignments, point breakdowns). Section 4: Course policies and resources (attendance, late work, academic integrity). Include markdown formatting for better readability. (No Questions)",
    },
    {
      type: "content",
      action: "Create",
      pages: 5,
      title: "Project Proposal Template",
      description: "Template for a project proposal",
      prompt:
        "Create a 5-part project proposal template. Part 1: Executive summary (1 page, problem statement, solution overview). Part 2: Project scope and objectives (2 pages, SMART goals, deliverables). Part 3: Timeline with milestones (1 page, Gantt chart, key dates). Part 4: Resource allocation (1 page, team roles, budget breakdown). Part 5: Budget breakdown in table format (1 page, line items, cost estimates). Include placeholders for charts and diagrams. (No Questions)",
    },
    {
      type: "content",
      action: "Generate",
      pages: 7,
      title: "Company Handbook",
      description: "Comprehensive handbook for company employees",
      prompt:
        "Generate a 7-chapter company handbook. Chapter 1: Mission and values (vision statement, core values, 2-3 pages). Chapter 2: Employment policies (hiring, termination, benefits, 5+ policies). Chapter 3: Benefits guide (healthcare, PTO, retirement, benefits). Chapter 4: Workplace guidelines (dress code, conduct, 3-4 pages). Chapter 5: IT policies (security, equipment, 4-5 policies). Chapter 6: Safety procedures (emergency protocols, 6-8 procedures). Chapter 7: Employee acknowledgment (forms, signatures). Each chapter should be 2-3 pages with clear headings. (No Questions)",
    },
    {
      type: "content",
      action: "Design",
      pages: 4,
      title: "Technical Spec Document",
      description: "Document for technical specifications",
      prompt:
        "Design a 4-section technical spec document. Section 1: Requirements and user stories (requirements, acceptance criteria). Section 2: Architecture diagrams and system design (component diagram, data flow, 3-4 diagrams). Section 3: Implementation details with code examples (API endpoints, database schema, examples). Section 4: Testing criteria and deployment checklist (test cases, deployment steps). Include placeholders for UML diagrams. (No Questions)",
    },
    {
      type: "content",
      action: "Create",
      pages: 5,
      title: "Marketing Campaign Playbook",
      description: "Guide for creating a marketing campaign",
      prompt:
        "Create a 5-page marketing campaign playbook. Page 1: Campaign overview and goals (SMART objectives, target metrics). Page 2: Target audience personas with demographics (3-4 detailed personas). Page 3: Channel strategy with budget allocation table (channels, spend breakdown). Page 4: Content calendar template (3-month view, 2-3 posts per week). Page 5: KPIs and reporting dashboard layout (metrics, visualization types). Include image placeholders for mockups. (No Questions)",
    },
    {
      type: "content",
      action: "Generate",
      pages: 6,
      title: "Research Report Template",
      description: "Template for a research report",
      prompt:
        "Generate a 6-part research report template. Part 1: Abstract and objectives (250 words, 3-4 research questions). Part 2: Methodology with diagrams (research design, data collection, 2-3 diagrams). Part 3: Data collection procedures (sampling, instruments, 5-6 procedures). Part 4: Analysis framework (statistical methods, coding scheme). Part 5: Findings presentation with chart placeholders (data points, 4-5 visualizations). Part 6: Recommendations and next steps (5-7 actionable items). Include citation formatting. (No Questions)",
    },
    {
      type: "content",
      action: "Create",
      pages: 12,
      title: "Programming Course Curriculum",
      description: "Curriculum for a programming course",
      prompt:
        "Create a 12-week programming course curriculum. Week 1-2: Introduction to Programming (basic concepts, syntax, 4-5 lessons). Week 3-4: Data Structures (arrays, objects, 6-7 lessons). Week 5-6: Algorithms and Problem Solving (sorting, searching, 5-6 lessons). Week 7-8: Web Development Basics (HTML, CSS, 4-5 lessons). Week 9-10: Backend Development (APIs, databases, 5-6 lessons). Week 11-12: Project Work (real-world applications, 3-4 projects). Include code examples and exercises. (No Questions)",
    },
    {
      type: "content",
      action: "Design",
      pages: 8,
      title: "Data Science Course Outline",
      description: "Outline for a data science course",
      prompt:
        "Design a 8-week data science course outline. Week 1: Python Fundamentals (libraries, data types, 3-4 lessons). Week 2: Data Analysis Basics (pandas, numpy, 4-5 lessons). Week 3: Data Visualization (matplotlib, seaborn, 3-4 lessons). Week 4: Statistical Analysis (hypothesis testing, 4-5 lessons). Week 5: Machine Learning Introduction (scikit-learn, 5-6 lessons). Week 6: Deep Learning Basics (neural networks, 4-5 lessons). Week 7: Big Data Tools (Spark, Hadoop, 3-4 lessons). Week 8: Capstone Project (real dataset analysis). Include Jupyter notebooks. (No Questions)",
    },
    {
      type: "content",
      action: "Generate",
      pages: 10,
      title: "UX/UI Design Course Structure",
      description: "Structure for a UX/UI design course",
      prompt:
        "Generate a 10-week UX/UI design course structure. Week 1: Design Fundamentals (principles, tools, 3-4 lessons). Week 2: User Research Methods (interviews, surveys, 4-5 lessons). Week 3: Information Architecture (sitemaps, wireframes, 3-4 lessons). Week 4: Visual Design Basics (typography, color, 4-5 lessons). Week 5: Interaction Design (patterns, prototypes, 5-6 lessons). Week 6: Usability Testing (methods, analysis, 3-4 lessons). Week 7: Mobile Design (responsive, native, 4-5 lessons). Week 8: Accessibility (WCAG guidelines, 3-4 lessons). Week 9: Design Systems (components, documentation, 4-5 lessons). Week 10: Portfolio Development (case studies, 3-4 projects). Include design examples. (No Questions)",
    },
    {
      type: "content",
      action: "Create",
      pages: 6,
      title: "Digital Marketing Course Content",
      description: "Content for a digital marketing course",
      prompt:
        "Create a 6-week digital marketing course content. Week 1: Marketing Fundamentals (strategy, channels, 4-5 lessons). Week 2: Content Marketing (blogging, social media, 5-6 lessons). Week 3: SEO and Analytics (keywords, tracking, 4-5 lessons). Week 4: Paid Advertising (PPC, display ads, 4-5 lessons). Week 5: Email Marketing (campaigns, automation, 3-4 lessons). Week 6: Marketing Analytics (reporting, optimization, 4-5 lessons). Include real campaign examples. (No Questions)",
    },
    {
      type: "content",
      action: "Create",
      pages: 1,
      title: "JavaScript Fundamentals Course Content",
      description: "Content for a JavaScript fundamentals course",
      prompt:
        "Create a JavaScript Fundamentals course content. Module 1: Variables and Data Types (primitive types, objects, type conversion, examples). Module 2: Control Flow (if/else, loops, switch, practice problems). Module 3: Functions (declarations, expressions, arrow functions, exercises). Module 4: Arrays and Objects (methods, manipulation, hands-on tasks). Module 5: DOM Manipulation (selectors, events, mini-projects). Include code snippets, exercises, and solutions. (No Questions)",
    },
    {
      type: "content",
      action: "Design",
      pages: 1,
      title: "React.js Course Material",
      description: "Material for a React.js course",
      prompt:
        "Design a React.js course material. Chapter 1: Components (class vs functional, props, state, component examples). Chapter 2: Hooks (useState, useEffect, custom hooks, practical uses). Chapter 3: State Management (Context, Redux, state scenarios). Chapter 4: Routing and Navigation (React Router, nested routes, 4+ routing patterns). Chapter 5: Performance (optimization, memo, callbacks, 6+ performance tips). Include working code examples and debugging guides. (No Questions)",
    },
    {
      type: "content",
      action: "Generate",
      pages: 1,
      title: "Python Data Analysis Curriculum Content",
      description: "Content for a Python data analysis curriculum",
      prompt:
        "Generate a Python Data Analysis curriculum content. Part 1: Pandas Basics (DataFrame operations, filtering, grouping, data manipulations). Part 2: Data Cleaning (missing values, duplicates, outliers, cleaning techniques). Part 3: Data Visualization (matplotlib, seaborn, 12+ chart types). Part 4: Statistical Analysis (descriptive stats, hypothesis testing, 8+ statistical methods). Part 5: Real-world Projects (3 complete analysis projects). Include sample datasets and solution notebooks. (No Questions)",
    },
    {
      type: "content",
      action: "Create",
      pages: 1,
      title: "Mobile App Development Course Material",
      description: "Material for a mobile app development course",
      prompt:
        "Create a Mobile App Development course material. Section 1: UI Components (layouts, widgets, styling, component examples). Section 2: State Management (local/global state, state patterns). Section 3: API Integration (REST, GraphQL, API implementations). Section 4: Storage and Authentication (local storage, JWT, OAuth, 5+ auth flows). Section 5: Deployment (app stores, CI/CD, 3+ deployment guides). Include source code and testing strategies. (No Questions)",
    },
    {
      type: "content",
      action: "Design",
      pages: 1,
      title: "Cloud Architecture Course Content",
      description: "Content for a cloud architecture course",
      prompt:
        "Design a Cloud Architecture course content. Unit 1: Infrastructure as Code (Terraform, CloudFormation, infrastructure templates). Unit 2: Containerization (Docker, Kubernetes, container examples). Unit 3: Serverless Computing (Lambda, Azure Functions, serverless patterns). Unit 4: Microservices (API Gateway, Service Mesh, architecture patterns). Unit 5: Security (IAM, encryption, security best practices). Include architecture diagrams and deployment guides. (No Questions)",
    },
    {
      type: "content",
      action: "Generate",
      pages: 1,
      title: "Machine Learning Course Material",
      description: "Material for a machine learning course",
      prompt:
        "Generate a Machine Learning course material. Topic 1: Supervised Learning (regression, classification, algorithms explained). Topic 2: Unsupervised Learning (clustering, dimensionality reduction, techniques). Topic 3: Model Evaluation (metrics, cross-validation, evaluation methods). Topic 4: Deep Learning (neural networks, CNN, RNN, architectures). Topic 5: MLOps (deployment, monitoring, production scenarios). Include Python implementations and case studies. (No Questions)",
    },
    {
      type: "content",
      action: "Create",
      pages: 1,
      title: "Web Security Course Content",
      description: "Content for a web security course",
      prompt:
        "Create a Web Security course content. Module 1: Authentication (password hashing, JWT, OAuth, auth implementations). Module 2: Common Vulnerabilities (XSS, CSRF, SQL injection, vulnerability examples). Module 3: Security Headers (CORS, CSP, header configurations). Module 4: Encryption (symmetric, asymmetric, encryption scenarios). Module 5: Security Testing (penetration testing, security tests). Include code examples and security checklists. (No Questions)",
    },
    {
      type: "content",
      action: "Design",
      pages: 1,
      title: "Database Design Course Material",
      description: "Material for a database design course",
      prompt:
        "Design a Database Design course material. Part 1: Data Modeling (ERD, normalization, database schemas). Part 2: SQL (queries, joins, stored procedures, SQL examples). Part 3: NoSQL (document, key-value, graph databases, NoSQL patterns). Part 4: Performance (indexing, optimization, performance tips). Part 5: Data Warehousing (ETL, OLAP, warehouse architectures). Include real-world scenarios and optimization techniques. (No Questions)",
    },
  ],
} as const;
