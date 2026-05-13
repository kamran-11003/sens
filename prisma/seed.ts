import { PrismaClient, Role } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const SEED_USERS = [
  { name: "Admin User", email: "admin@ric.edu.pk", password: "Admin@123", role: Role.ADMIN },
]

const PROGRAMS = [
  { title: "ADP English",              category: "adp-business",   shortDesc: "Master language and communication skills",      fullDesc: "Develop strong written and oral communication skills. Ideal for students seeking careers in education, media, and corporate communication.", duration: "2 Years", highlights: ["Linguistics","Creative Writing","Public Speaking","Literature"], iconName: "Briefcase", color: "#1E3A8A" },
  { title: "ADP Psychology",           category: "adp-business",   shortDesc: "Understand human behavior and the mind",         fullDesc: "Explore the science of the mind. Covers behavioral science, counseling basics, and social psychology.", duration: "2 Years", highlights: ["Behavioral Science","Counseling","Research Methods","Social Psychology"], iconName: "Briefcase", color: "#7C3AED" },
  { title: "ADP Accounting & Finance", category: "adp-business",   shortDesc: "Build a foundation in finance and accounting",   fullDesc: "Learn financial accounting, bookkeeping, and business finance principles to launch a career in banking or corporate accounting.", duration: "2 Years", highlights: ["Financial Accounting","Bookkeeping","Business Finance","Taxation Basics"], iconName: "Briefcase", color: "#F59E0B" },
  { title: "ADP Business Management",  category: "adp-business",   shortDesc: "Learn to manage teams and operations",           fullDesc: "Gain foundational skills in business operations, HR, and organizational management. Perfect for aspiring entrepreneurs and managers.", duration: "2 Years", highlights: ["Operations Management","HRM","Marketing Basics","Entrepreneurship"], iconName: "Briefcase", color: "#10B981" },
  { title: "ADP Commerce",             category: "adp-business",   shortDesc: "Explore trade and commercial principles",        fullDesc: "A comprehensive introduction to commerce, covering trade, business law, and economics.", duration: "2 Years", highlights: ["Business Law","Economics","Trade Principles","Banking"], iconName: "Briefcase", color: "#EF4444" },
  { title: "ADP Sales & Marketing",    category: "adp-business",   shortDesc: "Drive growth through sales and marketing",       fullDesc: "Develop practical skills in marketing strategy, sales techniques, and consumer behavior.", duration: "2 Years", highlights: ["Sales Strategy","Consumer Behavior","Digital Marketing Basics","Branding"], iconName: "Briefcase", color: "#06B6D4" },
  { title: "ADP IT Management",        category: "adp-business",   shortDesc: "Bridge business and technology",                 fullDesc: "Learn how to manage IT projects and align technology with business goals.", duration: "2 Years", highlights: ["IT Project Management","Digital Strategy","IT Governance","Systems Analysis"], iconName: "Briefcase", color: "#8B5CF6" },
  { title: "ADP Zoology & Botany",      category: "adp-science",   shortDesc: "Study life sciences from cells to ecosystems",   fullDesc: "Explore animal and plant biology. Ideal for students aiming for careers in biology, research, or healthcare.", duration: "2 Years", highlights: ["Cell Biology","Ecology","Plant Physiology","Animal Taxonomy"], iconName: "Microscope", color: "#10B981" },
  { title: "ADP Mathematics & Physics", category: "adp-science",   shortDesc: "Master numbers and the laws of nature",          fullDesc: "A rigorous program in pure and applied mathematics and physics.", duration: "2 Years", highlights: ["Calculus","Mechanics","Electromagnetism","Statistics"], iconName: "Microscope", color: "#1E3A8A" },
  { title: "ADP Zoology & Chemistry",   category: "adp-science",   shortDesc: "Explore biological and chemical sciences",       fullDesc: "Combines zoological sciences with chemistry, covering biochemistry and organic chemistry.", duration: "2 Years", highlights: ["Organic Chemistry","Biochemistry","Animal Biology","Lab Skills"], iconName: "Microscope", color: "#7C3AED" },
  { title: "ADP Computing",             category: "adp-computer",  shortDesc: "Core computing with specialized tracks",         fullDesc: "A versatile computing program with specializations in Computer Science, AI, and Data Science.", duration: "2 Years", highlights: ["Computer Science","Artificial Intelligence","Data Science","Programming"], iconName: "Code", color: "#1E3A8A" },
  { title: "ADP Computer Systems",      category: "adp-computer",  shortDesc: "Hardware, networking, and systems",              fullDesc: "Covers computer hardware, operating systems, and networking fundamentals.", duration: "2 Years", highlights: ["Networking","Operating Systems","Hardware","Cybersecurity Basics"], iconName: "Monitor", color: "#06B6D4" },
  { title: "ADP Computer Graphics",     category: "adp-computer",  shortDesc: "Where design meets technology",                  fullDesc: "Blend creative design with technical skills. Learn 2D/3D design and animation fundamentals.", duration: "2 Years", highlights: ["2D/3D Design","Animation","Graphic Software","Visual Communication"], iconName: "Code", color: "#EC4899" },
  { title: "ADP Medical Lab Technology",       category: "adp-health",  shortDesc: "Diagnostics at the heart of healthcare",  fullDesc: "Train to perform laboratory tests essential for patient diagnosis and treatment.", duration: "2 Years", highlights: ["Hematology","Microbiology","Clinical Chemistry","Lab Safety"], iconName: "Stethoscope", color: "#10B981" },
  { title: "ADP Medical Imaging Technology",   category: "adp-health",  shortDesc: "See inside the human body",               fullDesc: "Learn to operate medical imaging equipment including X-ray, ultrasound, and MRI.", duration: "2 Years", highlights: ["X-Ray Technology","Ultrasound","MRI Basics","Patient Care"], iconName: "Stethoscope", color: "#3B82F6" },
  { title: "ADP Operation Theater Technology", category: "adp-health",  shortDesc: "Support life-saving surgical teams",      fullDesc: "Prepare for a role in the surgical team as an OT technologist.", duration: "2 Years", highlights: ["Surgical Instruments","Sterilization","Anesthesia Support","Patient Safety"], iconName: "Stethoscope", color: "#EF4444" },
  { title: "Graphic Designing",                                category: "digital-skills", shortDesc: "Create compelling visual content",             fullDesc: "Learn professional graphic design using industry tools.", duration: "3-6 Months", highlights: ["Adobe Suite","Logo Design","Typography","Branding"], iconName: "Laptop", color: "#EC4899" },
  { title: "Video Editing",                                    category: "digital-skills", shortDesc: "Tell stories through video",                   fullDesc: "Master video production and editing workflows.", duration: "3-6 Months", highlights: ["Premiere Pro","Color Grading","Audio Mixing","YouTube/Reels"], iconName: "Laptop", color: "#F59E0B" },
  { title: "Digital Marketing",                                category: "digital-skills", shortDesc: "SEO, GEO, SEM & Growth Hacking",               fullDesc: "A practical course covering SEO, paid advertising, and growth hacking strategies.", duration: "3-6 Months", highlights: ["SEO","Google Ads","SEM","Growth Hacking"], iconName: "Zap", color: "#10B981" },
  { title: "AI Tools for Business & Productivity",             category: "digital-skills", shortDesc: "Boost productivity with AI",                   fullDesc: "Learn to use AI tools for automating tasks and improving business productivity.", duration: "1-3 Months", highlights: ["ChatGPT","Automation","AI Productivity","Prompt Engineering"], iconName: "Zap", color: "#7C3AED" },
  { title: "Content Creation & AI-Assisted Copywriting",      category: "digital-skills", shortDesc: "Create content that converts",                 fullDesc: "Develop skills in content strategy, copywriting, and AI-assisted writing.", duration: "1-3 Months", highlights: ["Copywriting","AI Writing Tools","Social Media Content","Content Strategy"], iconName: "Laptop", color: "#1E3A8A" },
  { title: "Basic IT / MS Office",                             category: "digital-skills", shortDesc: "Essential computer skills for everyone",       fullDesc: "Build foundational IT skills including MS Office and internet use.", duration: "1-3 Months", highlights: ["MS Word","MS Excel","MS PowerPoint","Internet Skills"], iconName: "Monitor", color: "#64748B" },
  { title: "No-Code / Low-Code Web Development",               category: "digital-skills", shortDesc: "Build websites without coding",                fullDesc: "Create functional websites using no-code platforms like Webflow and WordPress.", duration: "1-3 Months", highlights: ["Webflow","WordPress","Site Templates","Basic HTML"], iconName: "Code", color: "#06B6D4" },
  { title: "E-Commerce & Marketplace Management",              category: "digital-skills", shortDesc: "Sell on Amazon, Daraz & Shopify",              fullDesc: "Set up and manage online stores on major platforms.", duration: "1-3 Months", highlights: ["Amazon FBA","Daraz","Shopify","Inventory Management"], iconName: "Briefcase", color: "#F59E0B" },
  { title: "Data Analytics for Business",                      category: "digital-skills", shortDesc: "Turn data into decisions",                     fullDesc: "Learn to analyze business data using Excel, Power BI, and Google Analytics.", duration: "1-3 Months", highlights: ["Excel Advanced","Power BI","Google Analytics","Data Visualization"], iconName: "Zap", color: "#10B981" },
  { title: "Mobile App Development",                           category: "digital-skills", shortDesc: "Build apps for iOS and Android",               fullDesc: "Intro to mobile app development using modern frameworks.", duration: "3-6 Months", highlights: ["Flutter Basics","UI/UX for Mobile","App Store","Publishing"], iconName: "Code", color: "#8B5CF6" },
  { title: "Cybersecurity Fundamentals & Digital Safety",      category: "digital-skills", shortDesc: "Stay safe in the digital world",               fullDesc: "Learn essential cybersecurity concepts including network security and phishing prevention.", duration: "1-3 Months", highlights: ["Network Security","Password Safety","Phishing Prevention","Digital Hygiene"], iconName: "Monitor", color: "#EF4444" },
  { title: "Business Management",                              category: "digital-skills", shortDesc: "Run and grow a business effectively",          fullDesc: "Practical business management skills covering planning, operations, and team leadership.", duration: "1-3 Months", highlights: ["Business Planning","Operations","Team Leadership","Finance Basics"], iconName: "Briefcase", color: "#1E3A8A" },
  { title: "Event Management",                                 category: "digital-skills", shortDesc: "Plan and execute memorable events",            fullDesc: "Learn the complete process of event planning from concept to execution.", duration: "1-3 Months", highlights: ["Event Planning","Logistics","Vendor Management","Promotion"], iconName: "Briefcase", color: "#EC4899" },
  { title: "Travel & Tourism",                                 category: "digital-skills", shortDesc: "Explore careers in the travel industry",       fullDesc: "A practical course covering travel operations and tourism management.", duration: "1-3 Months", highlights: ["Tourism Management","Travel Operations","Customer Service","Global Destinations"], iconName: "Briefcase", color: "#06B6D4" },
  { title: "Modern Teaching Pro Skills",                       category: "digital-skills", shortDesc: "Teach effectively in the modern era",          fullDesc: "Equip educators with modern teaching methodologies and digital tools.", duration: "1-3 Months", highlights: ["Teaching Methods","Classroom Management","EdTech Tools","Assessment"], iconName: "GraduationCap", color: "#F59E0B" },
  { title: "Professional Communication & Leadership Skills",   category: "digital-skills", shortDesc: "Lead with confidence and clarity",             fullDesc: "Build professional communication, presentation, and leadership skills.", duration: "1-3 Months", highlights: ["Public Speaking","Leadership","Presentations","Team Communication"], iconName: "Briefcase", color: "#7C3AED" },
  { title: "F.Sc Pre-Medical",       category: "intermediate", shortDesc: "Gateway to medical and health sciences",    fullDesc: "Prepares students for MDCAT and entry into medical, dental, and allied health sciences.", duration: "2 Years", highlights: ["Biology","Chemistry","Physics","MDCAT Preparation"], iconName: "BookOpen", color: "#10B981" },
  { title: "F.Sc Pre-Engineering",   category: "intermediate", shortDesc: "Foundation for engineering and technology", fullDesc: "Provides the mathematics and physics foundation needed for engineering programs.", duration: "2 Years", highlights: ["Mathematics","Physics","Chemistry","ECAT Preparation"], iconName: "BookOpen", color: "#1E3A8A" },
  { title: "ICS Economics",          category: "intermediate", shortDesc: "Math, computer science and economics",      fullDesc: "ICS with Economics combines computer skills with economic theory.", duration: "2 Years", highlights: ["Computer Science","Economics","Statistics","Mathematics"], iconName: "BookOpen", color: "#F59E0B" },
  { title: "ICS Statistics, Physics",category: "intermediate", shortDesc: "Data, physics and computing combined",     fullDesc: "ICS with Statistics and Physics — ideal for data science and computing programs.", duration: "2 Years", highlights: ["Statistics","Physics","Computer Science","Mathematics"], iconName: "BookOpen", color: "#7C3AED" },
  { title: "I.Com Commerce",         category: "intermediate", shortDesc: "Commerce and business fundamentals",        fullDesc: "I.Com Commerce introduces students to business, accounting, and economics fundamentals.", duration: "2 Years", highlights: ["Accounting","Economics","Business Math","Commerce Law"], iconName: "BookOpen", color: "#EF4444" },
]

const FACULTY = [
  { name: "Dr. Rooh ul Husnain Khizar", title: "Project Director",              department: "Administration",      bio: "Dr. Rooh ul Husnain Khizar serves as Project Director of Riphah International College, providing strategic vision and leadership to drive institutional excellence and academic growth.",                           specializations: ["Institutional Leadership","Strategic Planning","Academic Development"], publications: 0, awards: 0, students: 0, image: "/uploads/faculty/Dr Rooh ul husnain khizar.jpeg", isDirector: true,  displayOrder: 1 },
  { name: "Muhammad Shahbaz",           title: "Chairperson",                   department: "Administration",      bio: "Muhammad Shahbaz is the Chairperson of Riphah International College, overseeing governance, institutional policy, and the overall direction of the college's academic and operational affairs.",                 specializations: ["Governance","Institutional Policy","Administration"],                   publications: 0, awards: 0, students: 0, image: "/uploads/faculty/Muhammad Ayaz Shahbaz.jpeg", isDirector: true,  displayOrder: 2 },
  { name: "Dr. Arslan Iqbal",           title: "Director of Accounts & Finance", department: "Finance",            bio: "Dr. Arslan Iqbal heads the Accounts and Finance department, bringing deep expertise in financial management, institutional budgeting, and fiscal planning to ensure the college's financial health.",               specializations: ["Financial Management","Budgeting","Accounting","Fiscal Planning"],       publications: 0, awards: 0, students: 0, image: "/uploads/faculty/Dr Arslan Iqbal .jpeg", isDirector: true,  displayOrder: 3 },
  { name: "Abdul Haq",                  title: "HOD — English",                 department: "English",             bio: "Abdul Haq is the Head of Department for English with an M.Phil in English Literature and 10 years of teaching experience. He is dedicated to nurturing strong communication and literary skills in students.",  specializations: ["English Literature","Linguistics","Communication Skills","Research"],    publications: 0, awards: 0, students: 0, image: "/uploads/faculty/abdul haq.jpeg", isDirector: false, displayOrder: 4 },
  { name: "Muhammad Saeed",             title: "Lecturer — Physics",             department: "Natural Sciences",   bio: "Muhammad Saeed is an experienced Physics lecturer with 10 years of teaching experience. He brings complex physical concepts to life through engaging, practical demonstrations and clear instruction.",             specializations: ["Physics","Mechanics","Electromagnetism","Lab Practice"],                  publications: 0, awards: 0, students: 0, image: "/uploads/faculty/saeed.jpeg", isDirector: false, displayOrder: 5 },
  { name: "M. Faizan",                  title: "Lecturer — Islamiat",            department: "Islamic Studies",    bio: "M. Faizan holds an MA in Islamiat and brings 6 years of dedicated teaching experience. He is committed to providing students with a deep, contextual understanding of Islamic principles and values.",             specializations: ["Islamiat","Islamic History","Islamic Ethics","Quran Studies"],            publications: 0, awards: 0, students: 0, image: "/uploads/faculty/faizan.jpeg", isDirector: false, displayOrder: 6 },
  { name: "Qasim Lodhi",                title: "Lecturer — Mathematics",         department: "Mathematics",        bio: "Qasim Lodhi holds an M.Phil in Mathematics and has 5 years of teaching experience. He specializes in making abstract mathematical concepts approachable and building strong analytical skills in students.",     specializations: ["Pure Mathematics","Calculus","Statistics","Linear Algebra"],              publications: 0, awards: 0, students: 0, image: "/uploads/faculty/qasim.jpeg", isDirector: false, displayOrder: 7 },
  { name: "M. Usman",                   title: "Lecturer — Commerce",            department: "Commerce",           bio: "M. Usman is a Commerce lecturer with an M.Com degree and 12 years of teaching experience. His extensive knowledge of commerce, accounting, and business principles makes him a highly valued member of faculty.", specializations: ["Commerce","Accounting","Business Studies","Economics"],                    publications: 0, awards: 0, students: 0, image: "/uploads/faculty/usman.jpeg", isDirector: false, displayOrder: 8 },
  { name: "Sajid Hameed",               title: "Lecturer — Computer Science",    department: "Computer Sciences",  bio: "Sajid Hameed holds an MSc in IT and has 10 years of teaching experience in Computer Science. He covers a wide range of computing topics including programming, networks, and modern software development.",      specializations: ["Computer Science","Programming","Networking","Software Development"],    publications: 0, awards: 0, students: 0, image: "/uploads/faculty/sajid.jpeg", isDirector: false, displayOrder: 9 },
]

const EVENTS = [
  { title: "Open Day 2026",           type: "academic",  date: "June 15, 2026",     time: "9:00 AM – 4:00 PM",  location: "Main Campus, Lahore",          description: "Experience campus life firsthand! Tour facilities, meet faculty, attend demo lectures, and learn about admission requirements.", attendees: "500+",  image: "", active: true },
  { title: "Tech Innovation Summit",  type: "academic",  date: "July 8, 2026",      time: "10:00 AM – 6:00 PM", location: "CS Auditorium",                description: "A premier technology conference featuring student projects, industry speakers, AI demonstrations, and networking opportunities.", attendees: "300+",  image: "", active: true },
  { title: "Annual Cultural Festival",type: "cultural",  date: "August 20, 2026",   time: "2:00 PM – 10:00 PM", location: "Main Campus Grounds",           description: "Celebrate cultural diversity with performances, food stalls, exhibitions, and competitions.", attendees: "1000+", image: "", active: true },
  { title: "Inter-College Sports Meet",type: "sports",   date: "September 5, 2026", time: "8:00 AM – 5:00 PM",  location: "Sports Complex",               description: "Annual sports competition featuring cricket, football, basketball, tennis, and athletics.", attendees: "800+",  image: "", active: true },
  { title: "Career & Industry Fair",  type: "career",    date: "October 12, 2026",  time: "10:00 AM – 4:00 PM", location: "Business School Hall",          description: "Connect with top employers, explore internship opportunities, and get your CV reviewed by HR professionals. 50+ companies.", attendees: "600+",  image: "", active: true },
  { title: "Graduation Ceremony 2026",type: "academic",  date: "November 30, 2026", time: "11:00 AM – 3:00 PM", location: "Main Auditorium",               description: "Celebrate the achievements of our graduating class — a momentous occasion for students, faculty, and families.", attendees: "2000+", image: "", active: true },
]

async function main() {
  console.log("Seeding database...")

  for (const u of SEED_USERS) {
    const hashed = await bcrypt.hash(u.password, 12)
    await prisma.user.upsert({
      where: { email: u.email },
      update: { role: u.role, password: hashed },
      create: { name: u.name, email: u.email, password: hashed, role: u.role },
    })
    console.log(`  User: ${u.email}`)
  }

  await prisma.programApplication.deleteMany()
  await prisma.program.deleteMany()
  for (const p of PROGRAMS) {
    await prisma.program.create({ data: { ...p, active: true } })
  }
  console.log(`  Programs: ${PROGRAMS.length} seeded`)

  await prisma.facultyMember.deleteMany()
  for (const f of FACULTY) {
    await prisma.facultyMember.create({ data: f })
  }
  console.log(`  Faculty: ${FACULTY.length} seeded`)

  await prisma.event.deleteMany()
  for (const e of EVENTS) {
    await prisma.event.create({ data: e })
  }
  console.log(`  Events: ${EVENTS.length} seeded`)

  // Bot Rules
  await prisma.botRule.deleteMany()
  const BOT_RULES = [
    { title: "Identity", rule: "You are RIC Assistant, the official chatbot for Riphah International College (RIC). Always refer to the college as 'Riphah International College' or 'RIC'.", priority: 10, active: true },
    { title: "Tone", rule: "Always be helpful, polite, and professional. Use a friendly yet respectful tone. Start with 'Asalam-o-Alaikum' for greetings.", priority: 9, active: true },
    { title: "Admissions", rule: "For admissions questions, direct users to the /admissions page where they can apply online.", priority: 8, active: true },
    { title: "Fee Structure", rule: "For fee and cost questions, direct users to the /fee-structure page for full details.", priority: 8, active: true },
    { title: "Programs", rule: "For program and course questions, direct users to the /programs page to browse all offerings.", priority: 8, active: true },
    { title: "Default", rule: "If you cannot find a specific answer in the knowledge base, apologize briefly and suggest the user contact the admissions office or visit the Contact page at /contact.", priority: 0, active: true },
  ]
  for (const r of BOT_RULES) {
    await prisma.botRule.create({ data: r })
  }
  console.log(`  Bot Rules: ${BOT_RULES.length} seeded`)

  // Bot Documents
  await prisma.botDocument.deleteMany()
  const BOT_DOCUMENTS = [
    {
      title: "Programs Overview",
      category: "programs",
      fileName: "programs.txt",
      active: true,
      content: `Riphah International College (RIC) offers the following programs:

ADP Programs (2-Year Associate Degree):
- Business Management: Covers marketing, finance, HR, and entrepreneurship
- English: Literature, linguistics, communication, and creative writing
- Psychology: Behavioral sciences, counseling, and mental health
- Accounting & Finance: Bookkeeping, taxation, financial analysis
- Commerce: Business law, economics, trade practices
- Sales & Marketing: Digital marketing, consumer behavior, sales strategies
- IT Management: Information systems, project management, tech business

Science Programs (2-Year):
- Zoology & Botany: Life sciences, ecology, laboratory work
- Mathematics & Physics: Applied math, mechanics, optics
- Zoology & Chemistry: Biochemistry, microbiology, lab techniques

Computer Programs (2-Year):
- Computing with specializations in CS, AI, and Data Science
- Computer Systems: Hardware, networking, system administration
- Computer Graphics: Design, animation, visual media

Allied Health Sciences (2-Year):
- Medical Lab Technology: Clinical diagnostics, pathology
- Medical Imaging Technology: Radiology, ultrasound, MRI
- Operation Theater Technology: Surgical assistance, anesthesia support

Intermediate Programs (2-Year):
- F.Sc Pre-Medical: Biology, Chemistry, Physics for medical aspirants
- F.Sc Pre-Engineering: Mathematics, Physics, Chemistry for engineering
- ICS Economics: Computer Science with Economics
- ICS Statistics Physics: Computer Science with Statistics and Physics
- I.Com Commerce: Intermediate Commerce

Digital Skills Programs (3–6 months short courses):
Graphic Designing, Video Editing, Digital Marketing, AI Tools, Content Creation, Basic IT, No-Code Web Development, E-Commerce, Data Analytics, Mobile App Development, Cybersecurity Basics`,
    },
    {
      title: "Admissions Information",
      category: "admissions",
      fileName: "admissions.txt",
      active: true,
      content: `Riphah International College Admissions Guide:

How to Apply:
1. Visit the Admissions page on the website
2. Fill out the online application form
3. Submit required documents
4. Pay the application fee
5. Await confirmation from the admissions office

Required Documents:
- Original CNIC / B-Form (for students under 18)
- Last educational certificate (Matric/O-Level or equivalent)
- 4 passport-size photographs
- Character certificate from last institution
- Migration certificate (if transferring from another board)

Eligibility:
- For Intermediate programs: Matric or O-Levels with at least 45% marks
- For ADP programs: Intermediate (FA/F.Sc/ICS/I.Com) or equivalent
- For Digital Skills courses: No strict requirement; basic literacy required

Admission Dates:
Admissions open twice a year — Spring (February) and Fall (August/September). Check the website for current dates.

Scholarships:
- Merit scholarships available for top-performing students
- Need-based financial assistance available
- Contact admissions office for details

Contact Admissions:
Visit the college, call the admissions helpline, or use the online contact form at /contact`,
    },
    {
      title: "Fee Structure",
      category: "fees",
      fileName: "fee-structure.txt",
      active: true,
      content: `Riphah International College Fee Structure:

ADP Programs (per semester):
- Tuition Fee: PKR 18,000 – 25,000 depending on program
- Admission Fee (one-time): PKR 5,000
- Registration Fee: PKR 2,000
- Library & Lab Fee: PKR 1,500

Intermediate Programs (per year):
- Tuition Fee: PKR 20,000 – 28,000 depending on subjects
- Admission Fee (one-time): PKR 4,000

Digital Skills Courses (one-time):
- 3-month courses: PKR 8,000 – 12,000
- 6-month courses: PKR 14,000 – 20,000

Payment Options:
- Full semester payment
- Installment plan available (2 installments per semester)
- Bank transfer, online payment, or cash at campus

Scholarships & Discounts:
- 10–25% merit scholarship for students with 80%+ in previous exam
- Sibling discount: 10% if sibling is already enrolled
- Financial aid available; apply through admissions office

Note: Fee structure may change each academic year. Visit the Fee Structure page on the website for the latest information.`,
    },
    {
      title: "Contact & Location",
      category: "contact",
      fileName: "contact.txt",
      active: true,
      content: `Riphah International College Contact Information:

Address: Riphah International College, Lahore, Pakistan

How to Reach Us:
- Online: Use the Contact form at /contact on this website
- Email: Contact through the online form and we'll reply via email
- Walk-in: Visit us at the campus during office hours (Mon–Sat, 8 AM – 5 PM)

Admissions Office:
Open Monday to Saturday, 8:00 AM to 4:00 PM

For specific inquiries:
- Admissions: Visit /admissions or fill out the contact form
- Fee queries: Visit /fee-structure or contact the accounts department
- Faculty information: See the Faculty section on the main page
- Events: Check the Events page for upcoming activities`,
    },
    {
      title: "Campus & Facilities",
      category: "general",
      fileName: "campus.txt",
      active: true,
      content: `Riphah International College Campus & Facilities:

The RIC campus provides a modern, safe, and inspiring learning environment.

Academic Facilities:
- Fully equipped computer labs with latest software
- Science and medical labs for practical training
- Well-stocked library with physical and digital resources
- Dedicated lecture halls and seminar rooms
- Smart classrooms with projectors and interactive boards

Student Amenities:
- Cafeteria serving fresh meals and snacks
- Sports grounds and indoor recreation areas
- Prayer facilities (separate for male and female)
- Secure campus with CCTV surveillance

Support Services:
- Student counseling and guidance office
- Career counseling and job placement assistance
- Transport facilities available for certain routes
- Separate entrances and areas for male and female students

Co-curricular Activities:
- Student societies and clubs
- Annual sports events and competitions
- Cultural programs and events
- National Day celebrations
- Guest lectures and industry visits`,
    },
  ]
  for (const d of BOT_DOCUMENTS) {
    await prisma.botDocument.create({ data: d })
  }
  console.log(`  Bot Documents: ${BOT_DOCUMENTS.length} seeded`)

  // Program Categories
  await prisma.programCategory.deleteMany()
  const CATEGORIES = [
    { slug: "adp-business",   label: "ADP — Business & Social Sciences" },
    { slug: "adp-science",    label: "ADP — Natural Sciences" },
    { slug: "adp-computer",   label: "ADP — Computer Sciences" },
    { slug: "adp-health",     label: "ADP — Allied Health Sciences" },
    { slug: "digital-skills", label: "Digital Skills (Short Courses)" },
    { slug: "intermediate",   label: "Intermediate (F.Sc / ICS / I.Com)" },
  ]
  for (const c of CATEGORIES) {
    await prisma.programCategory.create({ data: { ...c, active: true } })
  }
  console.log(`  Categories: ${CATEGORIES.length} seeded`)

  console.log("\nDone! Credentials:")
  console.log("  admin@ric.edu.pk / Admin@123")
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
