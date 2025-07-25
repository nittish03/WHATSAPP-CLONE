const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('🌱 Starting comprehensive database seeding for SkillPortal...')

    // Clear existing data first
    console.log('🧹 Clearing existing data...')
    await prisma.discussionReply.deleteMany()
    await prisma.discussionThread.deleteMany()
    await prisma.certificate.deleteMany()    
    await prisma.grade.deleteMany()
    await prisma.submission.deleteMany()
    await prisma.assignment.deleteMany()
    await prisma.enrollment.deleteMany()
    await prisma.course.deleteMany()
    await prisma.userSkill.deleteMany()
    await prisma.skill.deleteMany()
    await prisma.session.deleteMany()
    await prisma.account.deleteMany()
    await prisma.user.deleteMany()

    console.log('✅ Database cleared')

    // Create admin user
    console.log('👤 Creating admin user...')
    const adminPassword = await bcrypt.hash('admin123', 10)
    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@skillportal.com',
        hashedPassword: adminPassword,
        role: 'admin',
        university: 'SkillPortal University',
        degree: 'Master of Computer Science',
        branch: 'System Administration',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      }
    })

    // Create instructor users
    console.log('👩‍🏫 Creating instructors...')
    const instructorPassword = await bcrypt.hash('instructor123', 10)
    const instructors = []
    
    const instructorData = [
      { 
        name: 'Dr. Sarah Johnson', 
        email: 'sarah@skillportal.com', 
        university: 'MIT', 
        degree: 'Ph.D. Computer Science', 
        branch: 'Artificial Intelligence',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b36cdbeb?w=150&h=150&fit=crop&crop=face'
      },
      { 
        name: 'Prof. Michael Chen', 
        email: 'michael@skillportal.com', 
        university: 'Stanford University', 
        degree: 'Ph.D. Data Science', 
        branch: 'Machine Learning',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      { 
        name: 'Dr. Emily Rodriguez', 
        email: 'emily@skillportal.com', 
        university: 'Harvard University', 
        degree: 'Ph.D. Software Engineering', 
        branch: 'Web Development',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      },
      { 
        name: 'Prof. David Kim', 
        email: 'david@skillportal.com', 
        university: 'Carnegie Mellon', 
        degree: 'Ph.D. Cybersecurity', 
        branch: 'Information Security',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
      },
      { 
        name: 'Dr. Lisa Wang', 
        email: 'lisa@skillportal.com', 
        university: 'Berkeley', 
        degree: 'Ph.D. Human-Computer Interaction', 
        branch: 'UI/UX Design',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face'
      }
    ]

    for (const instrData of instructorData) {
      const instructor = await prisma.user.create({
        data: {
          ...instrData,
          hashedPassword: instructorPassword,
          role: 'instructor'
        }
      })
      instructors.push(instructor)
    }

    console.log(`✅ Created ${instructors.length} instructors`)

    // Create student users
    console.log('👨‍🎓 Creating students...')
    const studentPassword = await bcrypt.hash('student123', 10)
    const students = []
    
    const studentData = [
      { name: 'Alice Johnson', email: 'student1@example.com', university: 'MIT', degree: 'B.Tech', branch: 'Computer Science', image: 'https://images.unsplash.com/photo-1494790108755-2616b36cdbeb?w=150&h=150&fit=crop&crop=face' },
      { name: 'Bob Smith', email: 'student2@example.com', university: 'Stanford', degree: 'B.S.', branch: 'Information Technology', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
      { name: 'Carol Williams', email: 'student3@example.com', university: 'Harvard', degree: 'B.E.', branch: 'Software Engineering', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face' },
      { name: 'David Brown', email: 'student4@example.com', university: 'Berkeley', degree: 'B.Tech', branch: 'Data Science', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' },
      { name: 'Eva Davis', email: 'student5@example.com', university: 'CMU', degree: 'B.S.', branch: 'Computer Science', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face' },
      { name: 'Frank Miller', email: 'student6@example.com', university: 'MIT', degree: 'B.Tech', branch: 'Cybersecurity', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face' },
      { name: 'Grace Lee', email: 'student7@example.com', university: 'Stanford', degree: 'B.E.', branch: 'AI/ML', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face' },
      { name: 'Henry Taylor', email: 'student8@example.com', university: 'Harvard', degree: 'B.S.', branch: 'Web Development', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face' },
      { name: 'Ivy Chen', email: 'student9@example.com', university: 'Berkeley', degree: 'B.Tech', branch: 'Mobile Development', image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&h=150&fit=crop&crop=face' },
      { name: 'Jack Wilson', email: 'student10@example.com', university: 'CMU', degree: 'B.E.', branch: 'DevOps', image: 'https://images.unsplash.com/photo-1558203728-00f45181dd84?w=150&h=150&fit=crop&crop=face' }
    ]

    for (const studentInfo of studentData) {
      const student = await prisma.user.create({
        data: {
          ...studentInfo,
          hashedPassword: studentPassword,
          role: 'student'
        }
      })
      students.push(student)
    }

    console.log(`✅ Created ${students.length} students`)

    // Create comprehensive skills
    console.log('🛠️ Creating skills...')
    const skillsData = [
      // Programming Languages
      { name: 'JavaScript', description: 'Modern JavaScript programming and ES6+ features for web development', category: 'Programming' },
      { name: 'Python', description: 'Versatile programming language for web development, data science, and AI', category: 'Programming' },
      { name: 'Java', description: 'Object-oriented programming language for enterprise applications', category: 'Programming' },
      { name: 'C++', description: 'High-performance system programming language', category: 'Programming' },
      { name: 'TypeScript', description: 'Typed superset of JavaScript for large-scale applications', category: 'Programming' },
      { name: 'Go', description: 'Fast and efficient programming language by Google', category: 'Programming' },
      { name: 'Rust', description: 'Systems programming language focused on safety and performance', category: 'Programming' },
      { name: 'Swift', description: 'Programming language for iOS and macOS development', category: 'Programming' },

      // Frontend Development
      { name: 'React', description: 'Popular JavaScript library for building user interfaces', category: 'Frontend' },
      { name: 'Vue.js', description: 'Progressive JavaScript framework for building UIs', category: 'Frontend' },
      { name: 'Angular', description: 'TypeScript-based web application framework by Google', category: 'Frontend' },
      { name: 'HTML5', description: 'Modern markup language for structuring web content', category: 'Frontend' },
      { name: 'CSS3', description: 'Styling language for designing beautiful web pages', category: 'Frontend' },
      { name: 'Sass/SCSS', description: 'Advanced CSS preprocessor with variables and mixins', category: 'Frontend' },
      { name: 'Tailwind CSS', description: 'Utility-first CSS framework for rapid UI development', category: 'Frontend' },

      // Backend Development
      { name: 'Node.js', description: 'JavaScript runtime for server-side development', category: 'Backend' },
      { name: 'Express.js', description: 'Fast and minimalist web framework for Node.js', category: 'Backend' },
      { name: 'Django', description: 'High-level Python web framework for rapid development', category: 'Backend' },
      { name: 'Flask', description: 'Lightweight and flexible Python web framework', category: 'Backend' },
      { name: 'Spring Boot', description: 'Java framework for enterprise-level applications', category: 'Backend' },
      { name: 'Laravel', description: 'Elegant PHP web application framework', category: 'Backend' },

      // Database Technologies
      { name: 'MySQL', description: 'Popular relational database management system', category: 'Database' },
      { name: 'PostgreSQL', description: 'Advanced open-source relational database', category: 'Database' },
      { name: 'MongoDB', description: 'NoSQL document-oriented database', category: 'Database' },
      { name: 'Redis', description: 'In-memory data structure store and cache', category: 'Database' },
      { name: 'SQLite', description: 'Lightweight embedded SQL database', category: 'Database' },

      // Data Science & AI
      { name: 'Machine Learning', description: 'Algorithms and models that learn from data', category: 'Data Science' },
      { name: 'Deep Learning', description: 'Neural networks with multiple layers for complex tasks', category: 'Data Science' },
      { name: 'Data Analysis', description: 'Extracting insights and patterns from data', category: 'Data Science' },
      { name: 'TensorFlow', description: 'Open-source machine learning framework by Google', category: 'Data Science' },
      { name: 'PyTorch', description: 'Deep learning framework preferred by researchers', category: 'Data Science' },
      { name: 'Pandas', description: 'Data manipulation and analysis library for Python', category: 'Data Science' },
      { name: 'NumPy', description: 'Numerical computing library for Python', category: 'Data Science' },

      // Cloud & DevOps
      { name: 'AWS', description: 'Amazon Web Services cloud computing platform', category: 'Cloud' },
      { name: 'Google Cloud', description: 'Google Cloud Platform services and infrastructure', category: 'Cloud' },
      { name: 'Microsoft Azure', description: 'Microsoft cloud computing platform', category: 'Cloud' },
      { name: 'Docker', description: 'Containerization platform for application deployment', category: 'DevOps' },
      { name: 'Kubernetes', description: 'Container orchestration system for scalable deployments', category: 'DevOps' },
      { name: 'Jenkins', description: 'Continuous integration and deployment automation', category: 'DevOps' },
      { name: 'Git', description: 'Distributed version control system', category: 'DevOps' },

      // Mobile Development
      { name: 'React Native', description: 'Cross-platform mobile app development with React', category: 'Mobile' },
      { name: 'Flutter', description: 'Google UI toolkit for beautiful mobile apps', category: 'Mobile' },
      { name: 'iOS Development', description: 'Native iOS app development with Swift/Objective-C', category: 'Mobile' },
      { name: 'Android Development', description: 'Native Android app development with Java/Kotlin', category: 'Mobile' },

      // Design & UX
      { name: 'UI/UX Design', description: 'User interface and experience design principles', category: 'Design' },
      { name: 'Figma', description: 'Collaborative design tool for UI/UX designers', category: 'Design' },
      { name: 'Adobe Creative Suite', description: 'Professional design software suite', category: 'Design' },
      { name: 'Sketch', description: 'Digital design toolkit for Mac', category: 'Design' },

      // Security
      { name: 'Cybersecurity', description: 'Information security and threat protection strategies', category: 'Security' },
      { name: 'Ethical Hacking', description: 'Authorized penetration testing and vulnerability assessment', category: 'Security' },
      { name: 'Network Security', description: 'Securing computer networks and communications', category: 'Security' },

      // Management & Soft Skills
      { name: 'Project Management', description: 'Planning and executing projects effectively using proven methodologies', category: 'Management' },
      { name: 'Agile/Scrum', description: 'Agile project management and development methodologies', category: 'Management' },
      { name: 'Leadership', description: 'Leading teams and driving organizational success', category: 'Management' },

      // Other Technologies
      { name: 'API Development', description: 'Building and designing RESTful and GraphQL APIs', category: 'Backend' },
      { name: 'GraphQL', description: 'Query language and runtime for APIs', category: 'Backend' },
      { name: 'Blockchain', description: 'Distributed ledger technology and smart contracts', category: 'Emerging Tech' }
    ]

    const skills = []
    for (const skillData of skillsData) {
      const skill = await prisma.skill.create({
        data: skillData
      })
      skills.push(skill)
    }

    console.log(`✅ Created ${skills.length} skills`)

    // Create comprehensive courses
    console.log('📚 Creating courses...')
    const coursesData = [
      // Programming Courses
      { title: 'JavaScript Fundamentals', description: 'Master JavaScript from basics to advanced concepts including ES6+, async programming, DOM manipulation, and modern development practices. Perfect for beginners starting their web development journey.', skillName: 'JavaScript', instructorIndex: 2 },
      { title: 'Python for Everyone', description: 'Comprehensive Python course covering syntax, data structures, OOP, file handling, and practical applications. Build real projects while learning one of the most popular programming languages.', skillName: 'Python', instructorIndex: 1 },
      { title: 'Java Programming Mastery', description: 'Complete Java development course from basics to enterprise applications. Learn OOP principles, data structures, algorithms, and build scalable applications.', skillName: 'Java', instructorIndex: 0 },
      { title: 'Modern TypeScript Development', description: 'Learn TypeScript for scalable and maintainable JavaScript applications. Covers types, interfaces, generics, and advanced patterns for large-scale development.', skillName: 'TypeScript', instructorIndex: 2 },
      { title: 'C++ Systems Programming', description: 'Master C++ for high-performance applications. Learn memory management, STL, multithreading, and system-level programming concepts.', skillName: 'C++', instructorIndex: 0 },

      // Frontend Courses
      { title: 'React.js Complete Guide', description: 'Build modern web applications with React. Covers hooks, context, state management, routing, testing, and deployment. Includes hands-on projects and best practices.', skillName: 'React', instructorIndex: 2 },
      { title: 'Vue.js from Scratch', description: 'Progressive JavaScript framework for building interactive web interfaces. Learn components, directives, Vuex, and Vue Router through practical projects.', skillName: 'Vue.js', instructorIndex: 2 },
      { title: 'Advanced CSS & Responsive Design', description: 'Master CSS3, Flexbox, Grid, animations, and responsive design principles. Create beautiful, mobile-first websites that work on all devices.', skillName: 'CSS3', instructorIndex: 4 },
      { title: 'Angular Enterprise Development', description: 'Build scalable enterprise applications with Angular. Learn components, services, routing, forms, HTTP client, and testing strategies.', skillName: 'Angular', instructorIndex: 0 },

      // Backend Courses
      { title: 'Node.js Backend Development', description: 'Build scalable server-side applications with Node.js and Express. Learn REST APIs, database integration, authentication, and deployment.', skillName: 'Node.js', instructorIndex: 0 },
      { title: 'Django Web Framework', description: 'Full-stack web development with Python Django framework. Build secure, scalable web applications with user authentication and database integration.', skillName: 'Django', instructorIndex: 1 },
      { title: 'Spring Boot Microservices', description: 'Enterprise Java development with Spring Boot. Learn to build microservices, implement security, and deploy scalable applications.', skillName: 'Spring Boot', instructorIndex: 0 },
      { title: 'API Design & Development', description: 'Design and build robust RESTful APIs and GraphQL services. Learn API security, documentation, versioning, and best practices.', skillName: 'API Development', instructorIndex: 0 },

      // Data Science Courses
      { title: 'Machine Learning Fundamentals', description: 'Introduction to ML algorithms, supervised and unsupervised learning, model evaluation, and practical implementation using Python and scikit-learn.', skillName: 'Machine Learning', instructorIndex: 1 },
      { title: 'Deep Learning with TensorFlow', description: 'Neural networks and deep learning using TensorFlow framework. Build and train models for image recognition, NLP, and time series analysis.', skillName: 'TensorFlow', instructorIndex: 1 },
      { title: 'Data Analysis with Python', description: 'Data manipulation, visualization, and analysis using Pandas, NumPy, and Matplotlib. Learn to extract insights from real-world datasets.', skillName: 'Data Analysis', instructorIndex: 1 },

      // Cloud & DevOps Courses
      { title: 'AWS Cloud Solutions Architect', description: 'Master Amazon Web Services for scalable cloud solutions. Learn EC2, S3, RDS, Lambda, and architectural best practices.', skillName: 'AWS', instructorIndex: 3 },
      { title: 'Docker & Containerization', description: 'Learn containerization with Docker and container orchestration with Kubernetes. Deploy scalable applications in the cloud.', skillName: 'Docker', instructorIndex: 3 },
      { title: 'DevOps Engineering Pipeline', description: 'CI/CD pipelines, automation, infrastructure as code, and monitoring. Learn Git, Jenkins, Terraform, and deployment strategies.', skillName: 'Jenkins', instructorIndex: 3 },

      // Mobile Courses
      { title: 'React Native Mobile Apps', description: 'Cross-platform mobile app development with React Native. Build iOS and Android apps with native performance and user experience.', skillName: 'React Native', instructorIndex: 2 },
      { title: 'Flutter Development Masterclass', description: 'Build beautiful mobile apps for iOS and Android with Flutter. Learn Dart, widgets, state management, and app deployment.', skillName: 'Flutter', instructorIndex: 0 },

      // Design Courses
      { title: 'UI/UX Design Principles', description: 'User-centered design, wireframing, prototyping, design systems, and usability testing. Create intuitive and beautiful user experiences.', skillName: 'UI/UX Design', instructorIndex: 4 },
      { title: 'Figma Design Mastery', description: 'Professional design workflows and collaboration with Figma. Learn prototyping, design systems, and team collaboration features.', skillName: 'Figma', instructorIndex: 4 },

      // Security Courses
      { title: 'Cybersecurity Fundamentals', description: 'Information security principles, threat analysis, risk assessment, and protection strategies for modern digital environments.', skillName: 'Cybersecurity', instructorIndex: 3 },
      { title: 'Ethical Hacking & Penetration Testing', description: 'Learn authorized penetration testing, vulnerability assessment, and security auditing techniques to protect systems.', skillName: 'Ethical Hacking', instructorIndex: 3 },

      // Management Courses
      { title: 'Agile Project Management', description: 'Scrum, Kanban, and agile methodologies for successful project delivery. Learn sprint planning, retrospectives, and team collaboration.', skillName: 'Agile/Scrum', instructorIndex: 4 },
      { title: 'Technical Leadership', description: 'Leading technical teams, making architectural decisions, mentoring developers, and driving technical excellence in organizations.', skillName: 'Leadership', instructorIndex: 4 }
    ]

    const courses = []
    for (const courseData of coursesData) {
      const skill = skills.find(s => s.name === courseData.skillName)
      const instructor = instructors[courseData.instructorIndex]
      if (skill && instructor) {
        const course = await prisma.course.create({
          data: {
            title: courseData.title,
            description: courseData.description,
            skillId: skill.id,
            createdById: instructor.id,
            publishedAt: new Date()
          }
        })
        courses.push(course)
      }
    }

    console.log(`✅ Created ${courses.length} courses`)

    // Create enrollments with varied progress
    console.log('🎓 Creating enrollments...')
    let totalEnrollments = 0
    for (const student of students) {
      const numCourses = Math.floor(Math.random() * 5) + 3 // 3-7 courses per student
      const selectedCourses = courses.sort(() => 0.5 - Math.random()).slice(0, numCourses)
      
      for (const course of selectedCourses) {
        const enrollmentDate = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
        const statusRand = Math.random()
        const status = statusRand > 0.7 ? 'completed' : statusRand > 0.05 ? 'enrolled' : 'dropped'
        const progress = status === 'completed' ? 100 : 
                        status === 'dropped' ? Math.floor(Math.random() * 40) :
                        Math.floor(Math.random() * 80) + 10
        
        await prisma.enrollment.create({
          data: {
            userId: student.id,
            courseId: course.id,
            status: status,
            progress: progress,
            completedAt: status === 'completed' ? new Date(enrollmentDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000) : null,
            enrolledAt: enrollmentDate
          }
        })
        totalEnrollments++
      }
    }

    console.log(`✅ Created ${totalEnrollments} enrollments`)

    // Create user skills
    console.log('🎯 Creating user skills...')
    let totalUserSkills = 0
    for (const student of students) {
      const numSkills = Math.floor(Math.random() * 8) + 5 // 5-12 skills per student
      const selectedSkills = skills.sort(() => 0.5 - Math.random()).slice(0, numSkills)
      
      for (const skill of selectedSkills) {
        try {
          const levelRand = Math.random()
          const level = levelRand > 0.9 ? Math.floor(Math.random() * 2) + 9 : // 10% expert (9-10)
                       levelRand > 0.6 ? Math.floor(Math.random() * 3) + 6 : // 30% advanced (6-8)
                       levelRand > 0.2 ? Math.floor(Math.random() * 3) + 3 : // 40% intermediate (3-5)
                       Math.floor(Math.random() * 2) + 1 // 20% beginner (1-2)

          await prisma.userSkill.create({
            data: {
              userId: student.id,
              skillId: skill.id,
              level: level,
              addedAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000)
            }
          })
          totalUserSkills++
        } catch (error) {
          // Skip duplicates
          continue
        }
      }
    }

    console.log(`✅ Created ${totalUserSkills} user skills`)

    // Create assignments
    console.log('📝 Creating assignments...')
    const assignments = []
    for (const course of courses) {
      const numAssignments = Math.floor(Math.random() * 4) + 2 // 2-5 assignments per course
      
      for (let i = 0; i < numAssignments; i++) {
        const daysFromNow = Math.floor(Math.random() * 60) - 30 // -30 to +30 days
        const dueDate = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000)
        
        const assignmentTitles = [
          'Fundamentals Quiz',
          'Practical Implementation Project', 
          'Advanced Concepts Assignment',
          'Real-World Case Study',
          'Final Project Presentation'
        ]
        
        const assignmentDescriptions = [
          'Complete this comprehensive assessment covering the fundamental concepts we\'ve learned so far.',
          'Implement a real-world project using the technologies and concepts covered in class.',
          'Explore advanced topics and provide detailed analysis with code examples.',
          'Analyze a real-world case study and propose solutions using the methodologies learned.',
          'Create and present a comprehensive final project showcasing all skills acquired.'
        ]
        
        const maxPoints = [50, 100, 75, 150, 200][i % 5]
        
        const assignment = await prisma.assignment.create({
          data: {
            title: `${course.title} - ${assignmentTitles[i % assignmentTitles.length]}`,
            description: assignmentDescriptions[i % assignmentDescriptions.length],
            dueDate: dueDate,
            maxPoints: maxPoints,
            courseId: course.id,
            createdById: course.createdById
          }
        })
        assignments.push(assignment)
      }
    }

    console.log(`✅ Created ${assignments.length} assignments`)

    // Create submissions and grades
    console.log('✉️ Creating submissions and grades...')
    let totalSubmissions = 0
    let totalGrades = 0
    
    for (const assignment of assignments) {
      const enrollments = await prisma.enrollment.findMany({
        where: { courseId: assignment.courseId },
        include: { user: true }
      })
      
      for (const enrollment of enrollments) {
        // 75% chance student submits assignment
        if (Math.random() > 0.25) {
          const submissionDate = new Date(assignment.dueDate.getTime() - Math.random() * 5 * 24 * 60 * 60 * 1000)
          
          const submissionContents = [
            `Comprehensive solution by ${enrollment.user.name}. This assignment addresses all requirements with detailed explanations and implementation.`,
            `My approach focuses on scalability and maintainability. I've researched additional resources beyond the course materials.`,
            `After thorough analysis, I've developed a solution that meets all criteria and incorporates modern development patterns.`,
            `This submission demonstrates understanding of core concepts with practical examples and real-world applications.`
          ]
          
          const submission = await prisma.submission.create({
            data: {
              assignmentId: assignment.id,
              userId: enrollment.userId,
              submittedAt: submissionDate,
              content: submissionContents[Math.floor(Math.random() * submissionContents.length)],
              fileUrl: Math.random() > 0.5 ? `https://files.skillportal.com/${enrollment.userId}/${assignment.id}.pdf` : null
            }
          })
          totalSubmissions++

          // 85% chance submission gets graded
          if (Math.random() > 0.15) {
            const gradeRand = Math.random()
            const baseScore = gradeRand > 0.8 ? Math.floor(Math.random() * 15) + 85 : // 20% excellent (85-100)
                             gradeRand > 0.5 ? Math.floor(Math.random() * 15) + 70 : // 30% good (70-84)
                             gradeRand > 0.2 ? Math.floor(Math.random() * 15) + 60 : // 30% satisfactory (60-74)
                             Math.floor(Math.random() * 20) + 40 // 20% needs improvement (40-59)
            
            const points = Math.min(baseScore, assignment.maxPoints)
            
            const feedbacks = [
              'Excellent work! Shows deep understanding and creative solutions.',
              'Very good submission. Well structured with clear explanations.',
              'Good effort! Solid grasp of fundamentals with room for improvement.',
              'Satisfactory work. Meets requirements but could benefit from more detail.',
              'Outstanding submission! Goes above and beyond expectations.',
              'Well done! Shows good problem-solving skills and attention to detail.'
            ]
            
            await prisma.grade.create({
              data: {
                assignmentId: assignment.id,
                userId: enrollment.userId,
                gradedById: assignment.createdById,
                points: points,
                feedback: feedbacks[Math.floor(Math.random() * feedbacks.length)]
              }
            })
            totalGrades++
          }
        }
      }
    }

    console.log(`✅ Created ${totalSubmissions} submissions and ${totalGrades} grades`)

    // Create certificates for completed enrollments
    console.log('🏅 Creating certificates...')
    const completedEnrollments = await prisma.enrollment.findMany({
      where: { status: 'completed' },
      include: { course: true }
    })

    for (const enrollment of completedEnrollments) {
      await prisma.certificate.create({
        data: {
          userId: enrollment.userId,
          courseId: enrollment.courseId,
          title: `Certificate of Completion - ${enrollment.course.title}`,
          url: `https://certificates.skillportal.com/${enrollment.userId}/${enrollment.courseId}`
        }
      })
    }

    console.log(`✅ Created ${completedEnrollments.length} certificates`)

    // Create discussion threads and replies
    console.log('💬 Creating discussions...')
    let totalThreads = 0
    let totalReplies = 0
    
    const discussionTopics = [
      'Welcome & Course Introduction',
      'Assignment Questions & Help',
      'Best Practices & Tips',
      'Troubleshooting Common Issues',
      'Project Showcase',
      'Additional Resources'
    ]

    for (const course of courses.slice(0, 15)) { // Create discussions for first 15 courses
      const numThreads = Math.floor(Math.random() * 3) + 2 // 2-4 threads per course
      
      for (let i = 0; i < numThreads; i++) {
        const topic = discussionTopics[Math.floor(Math.random() * discussionTopics.length)]
        
        const thread = await prisma.discussionThread.create({
          data: {
            title: `${topic} - ${course.title}`,
            content: `This discussion thread is for ${topic.toLowerCase()} related to ${course.title}. Feel free to ask questions and share insights!`,
            courseId: course.id,
            authorId: course.createdById
          }
        })
        totalThreads++

        // Create replies (3-8 per thread)
        const numReplies = Math.floor(Math.random() * 6) + 3
        for (let j = 0; j < numReplies; j++) {
          const isStudentReply = Math.random() > 0.2
          const author = isStudentReply 
            ? students[Math.floor(Math.random() * students.length)]
            : (Math.random() > 0.7 ? admin : instructors[Math.floor(Math.random() * instructors.length)])
          
          const replyContents = [
            'Great question! I had similar doubts when I started.',
            'Thanks for sharing this resource, very helpful!',
            'I found a different approach that works well too.',
            'Can someone help me understand this concept better?',
            'Here\'s a useful tip that helped me with this topic.',
            'This explanation really clarified things for me.',
            'Has anyone tried implementing this in a real project?'
          ]
          
          await prisma.discussionReply.create({
            data: {
              threadId: thread.id,
              authorId: author.id,
              content: replyContents[Math.floor(Math.random() * replyContents.length)],
              createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
            }
          })
          totalReplies++
        }
      }
    }

    console.log(`✅ Created ${totalThreads} discussion threads with ${totalReplies} replies`)

    console.log('\n🎉 Database seeding completed successfully!')
    console.log('\n📊 FINAL DATA SUMMARY:')
    console.log('═══════════════════════════════════════')
    console.log(`👥 Users: ${1 + instructors.length + students.length} total`)
    console.log(`   └── 1 Admin, ${instructors.length} Instructors, ${students.length} Students`)
    console.log(`🛠️  Skills: ${skills.length} across ${new Set(skills.map(s => s.category)).size} categories`)
    console.log(`📚 Courses: ${courses.length} published courses`)
    console.log(`🎓 Enrollments: ${totalEnrollments} total enrollments`)
    console.log(`🎯 User Skills: ${totalUserSkills} personal skill entries`)
    console.log(`📝 Assignments: ${assignments.length} assignments`)
    console.log(`✉️  Submissions: ${totalSubmissions} student submissions`)
    console.log(`⭐ Grades: ${totalGrades} graded assignments`)
    console.log(`🏆 Certificates: ${completedEnrollments.length} certificates issued`)
    console.log(`💬 Discussions: ${totalThreads} threads with ${totalReplies} replies`)
    console.log('═══════════════════════════════════════')
    
    console.log('\n🔑 LOGIN CREDENTIALS:')
    console.log('────────────────────────────────────')
    console.log('👤 Admin: admin@skillportal.com / admin123')
    console.log('👩‍🏫 Instructors:')
    instructors.forEach(instructor => {
      console.log(`   └── ${instructor.email} / instructor123`)
    })
    console.log('👨‍🎓 Students: student1@example.com to student10@example.com / student123')
    
    console.log('\n🚀 Your SkillPortal is ready with comprehensive demo data!')
    console.log('   All features are now populated and ready for testing.')

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    console.log('\n👋 Disconnected from database')
  })
