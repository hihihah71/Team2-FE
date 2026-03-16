export type TagCategory = {
  key: string
  label: string
  labelVi: string
  tags: string[]
}

export const JOB_TAG_CATEGORIES: TagCategory[] = [
  {
    key: 'job_type',
    label: 'Job Type',
    labelVi: 'Loại công việc',
    tags: [
      'Full-time', 'Part-time', 'Internship', 'Fresher', 'Entry-level',
      'Junior', 'Mid-level', 'Senior', 'Lead', 'Manager', 'Director',
      'Executive', 'Temporary', 'Contract', 'Freelance', 'Seasonal',
      'Volunteer', 'Apprenticeship', 'Graduate program', 'Trainee',
    ],
  },
  {
    key: 'work_arrangement',
    label: 'Work Arrangement',
    labelVi: 'Hình thức làm việc',
    tags: [
      'Remote', 'Hybrid', 'On-site', 'Work from home', 'Flexible hours',
      'Shift work', 'Night shift', 'Weekend shift', 'Rotational shift',
    ],
  },
  {
    key: 'industry',
    label: 'Industry',
    labelVi: 'Ngành nghề',
    tags: [
      'Information Technology', 'Software Development', 'Artificial Intelligence',
      'Machine Learning', 'Data Science', 'Cybersecurity', 'Fintech', 'Blockchain',
      'Cloud Computing', 'Game Development', 'EdTech', 'HealthTech', 'E-commerce',
      'Telecommunications', 'Finance', 'Banking', 'Insurance', 'Accounting',
      'Education', 'Healthcare', 'Pharmaceuticals', 'Manufacturing', 'Logistics',
      'Transportation', 'Retail', 'Hospitality', 'Tourism', 'Real Estate',
      'Construction', 'Marketing', 'Advertising', 'Media', 'Entertainment',
      'Energy', 'Agriculture', 'Automotive',
    ],
  },
  {
    key: 'tech_roles',
    label: 'Tech Roles',
    labelVi: 'Lĩnh vực IT',
    tags: [
      'Backend Developer', 'Frontend Developer', 'Fullstack Developer',
      'Mobile Developer', 'Android Developer', 'iOS Developer', 'Game Developer',
      'AI Engineer', 'ML Engineer', 'Data Engineer', 'Data Scientist',
      'Data Analyst', 'DevOps Engineer', 'Site Reliability Engineer',
      'Cloud Engineer', 'Platform Engineer', 'Embedded Engineer',
      'Security Engineer', 'QA Engineer', 'Test Engineer',
      'Automation Engineer', 'Systems Engineer', 'Software Architect',
      'Solutions Architect',
    ],
  },
  {
    key: 'programming_languages',
    label: 'Programming Languages',
    labelVi: 'Ngôn ngữ lập trình',
    tags: [
      'Python', 'Java', 'C', 'C++', 'C#', 'Go', 'Rust', 'Kotlin', 'Swift',
      'JavaScript', 'TypeScript', 'PHP', 'Ruby', 'Dart', 'MATLAB', 'R', 'Julia',
    ],
  },
  {
    key: 'frameworks',
    label: 'Frameworks / Tech Stack',
    labelVi: 'Framework / Tech Stack',
    tags: [
      'React', 'Vue', 'Angular', 'Next.js', 'Nuxt.js', 'Node.js', 'Express',
      'Django', 'Flask', 'FastAPI', 'Spring Boot', 'Laravel', '.NET', 'ASP.NET',
      'TensorFlow', 'PyTorch', 'Scikit-learn',
    ],
  },
  {
    key: 'databases',
    label: 'Databases',
    labelVi: 'Cơ sở dữ liệu',
    tags: [
      'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Cassandra', 'SQLite',
      'MariaDB', 'Oracle Database', 'SQL Server', 'DynamoDB', 'Neo4j',
      'ChromaDB', 'ElasticSearch',
    ],
  },
  {
    key: 'cloud_devops',
    label: 'Cloud / DevOps',
    labelVi: 'Cloud / DevOps',
    tags: [
      'AWS', 'Google Cloud', 'Azure', 'Docker', 'Kubernetes', 'CI/CD', 'Git',
      'GitHub', 'GitLab', 'Terraform', 'Ansible', 'Jenkins', 'Prometheus', 'Grafana',
    ],
  },
  {
    key: 'soft_skills',
    label: 'Soft Skills',
    labelVi: 'Kỹ năng mềm',
    tags: [
      'Communication', 'Leadership', 'Problem Solving', 'Critical Thinking',
      'Teamwork', 'Time Management', 'Adaptability', 'Creativity',
      'Negotiation', 'Conflict Resolution', 'Decision Making',
    ],
  },
  {
    key: 'benefits',
    label: 'Benefits',
    labelVi: 'Phúc lợi',
    tags: [
      'Competitive salary', 'Bonus', 'Stock options', 'Equity', 'Health insurance',
      'Dental insurance', 'Paid time off', 'Annual leave', 'Sick leave',
      'Maternity leave', 'Paternity leave', 'Flexible working hours',
      'Work from home allowance', 'Learning budget', 'Training programs',
      'Career development', 'Free lunch', 'Gym membership', 'Company trips',
      'Laptop provided',
    ],
  },
  {
    key: 'experience',
    label: 'Experience Required',
    labelVi: 'Yêu cầu kinh nghiệm',
    tags: [
      'No experience required', '0-1 years experience', '1-3 years experience',
      '3-5 years experience', '5+ years experience', '10+ years experience',
    ],
  },
  {
    key: 'location',
    label: 'Location',
    labelVi: 'Địa điểm',
    tags: [
      'Singapore', 'Vietnam', 'Thailand', 'Indonesia', 'Malaysia', 'Philippines',
      'Japan', 'Korea', 'United States', 'Europe', 'Remote Worldwide', 'APAC',
    ],
  },
  {
    key: 'technical_skills',
    label: 'Technical Skills',
    labelVi: 'Kỹ năng chuyên môn',
    tags: [
      'Algorithms', 'Data Structures', 'System Design', 'Distributed Systems',
      'Microservices', 'REST API', 'GraphQL', 'Web Development',
      'Mobile Development', 'UI/UX Design', 'Machine Learning',
      'Natural Language Processing', 'Computer Vision', 'Big Data',
      'Data Mining', 'ETL', 'Data Visualization',
    ],
  },
  {
    key: 'tools',
    label: 'Tools',
    labelVi: 'Công cụ làm việc',
    tags: [
      'Jira', 'Confluence', 'Slack', 'Notion', 'Figma', 'Adobe XD',
      'Trello', 'Asana',
    ],
  },
]

export const ALL_TAGS: string[] = JOB_TAG_CATEGORIES.flatMap((c) => c.tags)
