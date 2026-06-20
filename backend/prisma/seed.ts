import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding real-world Indian scholarship data...');

  // Clean old data first
  await prisma.scholarship.deleteMany();

  // 1. Central Sector Scheme of Scholarship (CSSS - NSP)
  const csss = await prisma.scholarship.create({
    data: {
      title: 'Central Sector Scheme of Scholarship for College and University Students',
      description: 'Provides financial assistance to meritorious students from low-income families to meet a part of their day-to-day expenses while pursuing higher studies in college or university.',
      provider: 'Department of Higher Education, Govt of India',
      amount: 12000,
      applicationUrl: 'https://scholarships.gov.in',
      deadline: new Date('2026-12-31'),
      status: 'ACTIVE',
    },
  });

  await prisma.eligibilityRule.create({
    data: {
      scholarshipId: csss.id,
      ruleJson: {
        educationLevel: ['Undergraduate', 'Engineering', 'Medicine', 'Science', 'Commerce', 'Arts'],
        income: { max: 450000 },
        category: ['General', 'OBC', 'SC', 'ST'],
      },
    },
  });

  await prisma.requiredDocument.createMany({
    data: [
      { scholarshipId: csss.id, documentName: 'Class 12 Marksheet', mandatory: true },
      { scholarshipId: csss.id, documentName: 'Income Certificate', mandatory: true },
      { scholarshipId: csss.id, documentName: 'Aadhaar Card', mandatory: true },
      { scholarshipId: csss.id, documentName: 'College Fee Receipt', mandatory: true },
      { scholarshipId: csss.id, documentName: 'Caste Certificate', mandatory: false },
    ],
  });

  // 2. AICTE Pragati Scholarship for Girl Students
  const pragati = await prisma.scholarship.create({
    data: {
      title: 'AICTE Pragati Scholarship Scheme for Girl Students (Technical Degree)',
      description: 'An initiative by the Central Government to facilitate advancement of girls pursuing technical education. Encourages young women to pursue engineering and technology careers by covering academic tuition fees.',
      provider: 'All India Council for Technical Education (AICTE)',
      amount: 50000,
      applicationUrl: 'https://scholarships.gov.in',
      deadline: new Date('2026-11-30'),
      status: 'ACTIVE',
    },
  });

  await prisma.eligibilityRule.create({
    data: {
      scholarshipId: pragati.id,
      ruleJson: {
        gender: ['Female'],
        educationLevel: ['Engineering', 'Technology', 'Diploma'],
        income: { max: 800000 },
      },
    },
  });

  await prisma.requiredDocument.createMany({
    data: [
      { scholarshipId: pragati.id, documentName: 'Class 10/12 Marksheet', mandatory: true },
      { scholarshipId: pragati.id, documentName: 'Income Certificate', mandatory: true },
      { scholarshipId: pragati.id, documentName: 'Aadhaar Card', mandatory: true },
      { scholarshipId: pragati.id, documentName: 'Admission Letter (CAP Round)', mandatory: true },
      { scholarshipId: pragati.id, documentName: 'Declaration of Girl Child Status', mandatory: true },
      { scholarshipId: pragati.id, documentName: 'Tuition Fee Receipt', mandatory: false },
    ],
  });

  // 3. MahaDBT Rajarshi Chhatrapati Shahu Maharaj Scholarship
  const mahadbt = await prisma.scholarship.create({
    data: {
      title: 'Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Scheme',
      description: 'Welfare scheme offering tuition and exam fee reimbursement to students belonging to economically backward classes residing in Maharashtra state who got admitted via CAP round.',
      provider: 'Directorate of Higher Education, Govt of Maharashtra',
      amount: 40000,
      applicationUrl: 'https://mahadbt.maharashtra.gov.in',
      deadline: new Date('2026-11-15'),
      status: 'ACTIVE',
    },
  });

  await prisma.eligibilityRule.create({
    data: {
      scholarshipId: mahadbt.id,
      ruleJson: {
        state: ['Maharashtra'],
        income: { max: 800000 },
        educationLevel: ['Undergraduate', 'Postgraduate', 'Engineering', 'Medicine', 'Agriculture'],
      },
    },
  });

  await prisma.requiredDocument.createMany({
    data: [
      { scholarshipId: mahadbt.id, documentName: 'Domicile Certificate of Maharashtra', mandatory: true },
      { scholarshipId: mahadbt.id, documentName: 'Family Income Certificate', mandatory: true },
      { scholarshipId: mahadbt.id, documentName: 'Class 12 Marksheet', mandatory: true },
      { scholarshipId: mahadbt.id, documentName: 'CAP Round Allocation Letter', mandatory: true },
      { scholarshipId: mahadbt.id, documentName: 'Aadhaar Linked Bank Passbook', mandatory: true },
    ],
  });

  // 4. Begum Hazrat Mahal National Scholarship
  const hazratMahal = await prisma.scholarship.create({
    data: {
      title: 'Begum Hazrat Mahal National Scholarship for Minority Girls',
      description: 'Provides financial aid to meritorious girl students belonging to national minority communities (Muslim, Christian, Sikh, Buddhist, Jain, Zoroastrian) to continue their education.',
      provider: 'Maulana Azad Education Foundation, Ministry of Minority Affairs',
      amount: 6000,
      applicationUrl: 'https://scholarships.gov.in',
      deadline: new Date('2026-10-31'),
      status: 'ACTIVE',
    },
  });

  await prisma.eligibilityRule.create({
    data: {
      scholarshipId: hazratMahal.id,
      ruleJson: {
        gender: ['Female'],
        category: ['Minority', 'OBC', 'SC', 'ST'],
        income: { max: 200000 },
        educationLevel: ['School', 'Undergraduate'],
      },
    },
  });

  await prisma.requiredDocument.createMany({
    data: [
      { scholarshipId: hazratMahal.id, documentName: 'Self-Declared Minority Community Certificate', mandatory: true },
      { scholarshipId: hazratMahal.id, documentName: 'Previous Class Marksheet (Min 50%)', mandatory: true },
      { scholarshipId: hazratMahal.id, documentName: 'Parents Income Certificate', mandatory: true },
      { scholarshipId: hazratMahal.id, documentName: 'Aadhaar Card', mandatory: true },
      { scholarshipId: hazratMahal.id, documentName: 'School Principal Verification Form', mandatory: true },
    ],
  });

  // 5. Post Matric Scholarship for Students with Disabilities
  const disabilityMatric = await prisma.scholarship.create({
    data: {
      title: 'Post Matric Scholarship Scheme for Students with Disabilities',
      description: 'Promotes higher education opportunities for persons with disabilities by helping them cover tuition fees, academic books, and disability maintenance allowances.',
      provider: 'Department of Empowerment of Persons with Disabilities, Govt of India',
      amount: 65000,
      applicationUrl: 'https://scholarships.gov.in',
      deadline: new Date('2026-10-15'),
      status: 'ACTIVE',
    },
  });

  await prisma.eligibilityRule.create({
    data: {
      scholarshipId: disabilityMatric.id,
      ruleJson: {
        disability: true,
        income: { max: 250000 },
        educationLevel: ['Undergraduate', 'Postgraduate', 'Engineering', 'Diploma', 'Arts', 'Science'],
      },
    },
  });

  await prisma.requiredDocument.createMany({
    data: [
      { scholarshipId: disabilityMatric.id, documentName: 'Disability Certificate (Min 40%)', mandatory: true },
      { scholarshipId: disabilityMatric.id, documentName: 'Class 12 Marksheet', mandatory: true },
      { scholarshipId: disabilityMatric.id, documentName: 'Parents Income Certificate', mandatory: true },
      { scholarshipId: disabilityMatric.id, documentName: 'Aadhaar Card', mandatory: true },
      { scholarshipId: disabilityMatric.id, documentName: 'College Admission Letter', mandatory: true },
    ],
  });

  // 6. MOMA Merit-cum-Means Scholarship
  const momaMcm = await prisma.scholarship.create({
    data: {
      title: 'Merit-cum-Means Scholarship for Professional and Technical Courses (CS) - MOMA',
      description: 'Provides financial assistance to poor and meritorious students belonging to minority communities to enable them to pursue professional and technical courses.',
      provider: 'Ministry of Minority Affairs, Govt of India',
      amount: 30000,
      applicationUrl: 'https://scholarships.gov.in',
      deadline: new Date('2026-10-31'),
      status: 'ACTIVE',
    },
  });

  await prisma.eligibilityRule.create({
    data: {
      scholarshipId: momaMcm.id,
      ruleJson: {
        category: ['Minority', 'OBC', 'SC', 'ST'],
        income: { max: 250000 },
        educationLevel: ['Undergraduate', 'Postgraduate', 'Engineering', 'Medicine', 'Management'],
      },
    },
  });

  await prisma.requiredDocument.createMany({
    data: [
      { scholarshipId: momaMcm.id, documentName: 'Previous Exam Marksheet (Min 50%)', mandatory: true },
      { scholarshipId: momaMcm.id, documentName: 'Community Certificate (Self-Certified)', mandatory: true },
      { scholarshipId: momaMcm.id, documentName: 'Family Income Certificate', mandatory: true },
      { scholarshipId: momaMcm.id, documentName: 'Aadhaar Card', mandatory: true },
      { scholarshipId: momaMcm.id, documentName: 'Bank Passbook Copy', mandatory: true },
    ],
  });

  // 7. National Fellowship for Scheduled Caste Students (NFSC)
  const nfsc = await prisma.scholarship.create({
    data: {
      title: 'National Fellowship for Scheduled Caste Students',
      description: 'Provides fellowships to Scheduled Caste (SC) students who are pursuing regular and full-time M.Phil. and Ph.D. degrees in Science, Humanities, and Social Sciences.',
      provider: 'Ministry of Social Justice and Empowerment, Govt of India',
      amount: 372000,
      applicationUrl: 'https://scholarships.gov.in',
      deadline: new Date('2026-11-15'),
      status: 'ACTIVE',
    },
  });

  await prisma.eligibilityRule.create({
    data: {
      scholarshipId: nfsc.id,
      ruleJson: {
        category: ['SC'],
        educationLevel: ['Postgraduate', 'M.Phil', 'Ph.D.'],
      },
    },
  });

  await prisma.requiredDocument.createMany({
    data: [
      { scholarshipId: nfsc.id, documentName: 'SC Caste Certificate', mandatory: true },
      { scholarshipId: nfsc.id, documentName: 'Post Graduate Marksheet', mandatory: true },
      { scholarshipId: nfsc.id, documentName: 'Admission Letter / Joining Report', mandatory: true },
      { scholarshipId: nfsc.id, documentName: 'Aadhaar Card', mandatory: true },
    ],
  });

  // 8. Prime Minister's Scholarship Scheme (PMSS)
  const pmss = await prisma.scholarship.create({
    data: {
      title: "Prime Minister's Scholarship Scheme for Central Armed Police Forces & Assam Rifles",
      description: 'Encourages technical and post-graduate professional education (like Engineering, Medicine, Dental, Veterinary, BBA, BCA, MBA, MCA) for the dependent wards and widows of ex-CAPFs and Assam Rifles personnel.',
      provider: 'Welfare and Rehabilitation Board, Ministry of Home Affairs, Govt of India',
      amount: 30000,
      applicationUrl: 'https://scholarships.gov.in',
      deadline: new Date('2026-11-30'),
      status: 'ACTIVE',
    },
  });

  await prisma.eligibilityRule.create({
    data: {
      scholarshipId: pmss.id,
      ruleJson: {
        educationLevel: ['Engineering', 'Medicine', 'Undergraduate', 'Postgraduate'],
      },
    },
  });

  await prisma.requiredDocument.createMany({
    data: [
      { scholarshipId: pmss.id, documentName: 'Service Certificate / Discharge Book', mandatory: true },
      { scholarshipId: pmss.id, documentName: 'Class 12 / Diploma Marksheet (Min 60%)', mandatory: true },
      { scholarshipId: pmss.id, documentName: 'Bonafide Certificate from College', mandatory: true },
      { scholarshipId: pmss.id, documentName: 'Aadhaar Card', mandatory: true },
      { scholarshipId: pmss.id, documentName: 'Bank Passbook Copy', mandatory: true },
    ],
  });

  // 9. National Means-cum-Merit Scholarship (NMMS)
  const nmms = await prisma.scholarship.create({
    data: {
      title: 'National Means-cum-Merit Scholarship Scheme',
      description: 'Aims to award scholarships to meritorious students of economically weaker sections to arrest their drop-out at class VIII and encourage them to continue their study at secondary stage.',
      provider: 'Department of School Education & Literacy, Ministry of Education, Govt of India',
      amount: 12000,
      applicationUrl: 'https://scholarships.gov.in',
      deadline: new Date('2026-12-15'),
      status: 'ACTIVE',
    },
  });

  await prisma.eligibilityRule.create({
    data: {
      scholarshipId: nmms.id,
      ruleJson: {
        educationLevel: ['School'],
        income: { max: 350000 },
      },
    },
  });

  await prisma.requiredDocument.createMany({
    data: [
      { scholarshipId: nmms.id, documentName: 'NMMS Exam Scorecard', mandatory: true },
      { scholarshipId: nmms.id, documentName: 'Class 7/8 Marksheet', mandatory: true },
      { scholarshipId: nmms.id, documentName: 'Parent Income Certificate', mandatory: true },
      { scholarshipId: nmms.id, documentName: 'Aadhaar Card', mandatory: true },
      { scholarshipId: nmms.id, documentName: 'Caste Certificate', mandatory: false },
    ],
  });

  // 10. AICTE SWANATH Scholarship Scheme
  const swanath = await prisma.scholarship.create({
    data: {
      title: 'AICTE SWANATH Scholarship Scheme',
      description: 'Provides financial support of Rs. 50,000 per annum to orphans, wards of parents deceased due to COVID-19, or wards of Armed Forces and Central Paramilitary Forces deceased in action, to pursue technical education.',
      provider: 'All India Council for Technical Education (AICTE)',
      amount: 50000,
      applicationUrl: 'https://scholarships.gov.in',
      deadline: new Date('2026-11-30'),
      status: 'ACTIVE',
    },
  });

  await prisma.eligibilityRule.create({
    data: {
      scholarshipId: swanath.id,
      ruleJson: {
        educationLevel: ['Engineering', 'Technology', 'Diploma'],
        income: { max: 800000 },
      },
    },
  });

  await prisma.requiredDocument.createMany({
    data: [
      { scholarshipId: swanath.id, documentName: 'Orphan Certificate / COVID-19 Death Certificate / Armed Forces Death in Action Certificate', mandatory: true },
      { scholarshipId: swanath.id, documentName: 'Class 10/12 Marksheet', mandatory: true },
      { scholarshipId: swanath.id, documentName: 'Family Income Certificate', mandatory: true },
      { scholarshipId: swanath.id, documentName: 'Bonafide Certificate from Institute', mandatory: true },
      { scholarshipId: swanath.id, documentName: 'Aadhaar Card', mandatory: true },
    ],
  });

  // Generate embeddings text for RAG queries
  const allScholarships = [
    csss, pragati, mahadbt, hazratMahal, disabilityMatric,
    momaMcm, nfsc, pmss, nmms, swanath
  ];
  for (const s of allScholarships) {
    const rules = await prisma.eligibilityRule.findFirst({ where: { scholarshipId: s.id } });
    const docs = await prisma.requiredDocument.findMany({ where: { scholarshipId: s.id } });
    const docsStr = docs.map(d => `- ${d.documentName} (${d.mandatory ? 'Mandatory' : 'Optional'})`).join('\n');
    
    const chunkText = `Scholarship Name: ${s.title}
Financial Benefit Amount: ₹${s.amount}
Provider: ${s.provider}
Website link: ${s.applicationUrl}
Application Deadline: ${s.deadline?.toLocaleDateString()}
Overview Description: ${s.description}
Eligibility Rules (JSON details): ${JSON.stringify(rules?.ruleJson || {})}
Required Documents Checklists:
${docsStr}`;

    await prisma.scholarshipEmbedding.create({
      data: {
        scholarshipId: s.id,
        chunkText,
        embeddingJson: JSON.stringify(Array(1536).fill(0)),
      },
    });
  }

  console.log('Seeding completed successfully! 10 real-world scholarships and matching rules created.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
