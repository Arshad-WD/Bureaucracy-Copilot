import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding additional real-world Indian scholarship data...');

  // ─────────────────────────────────────────────────────────────
  // 11. Dr. Ambedkar Post Matric Scholarship for EBC Students
  // ─────────────────────────────────────────────────────────────
  const ambedkarEBC = await prisma.scholarship.create({
    data: {
      title: 'Dr. Ambedkar Post Matric Scholarship for Economically Backward Classes',
      description:
        'Provides financial assistance to students belonging to Economically Backward Classes (EBC) who have annual family income of less than Rs. 1 lakh to pursue post-matriculation education including engineering, medicine, and other professional courses.',
      provider: 'Ministry of Social Justice and Empowerment, Govt of India',
      amount: 15000,
      applicationUrl: 'https://scholarships.gov.in',
      deadline: new Date('2026-10-31'),
      status: 'ACTIVE',
    },
  });
  await prisma.eligibilityRule.create({
    data: {
      scholarshipId: ambedkarEBC.id,
      ruleJson: {
        income: { max: 100000 },
        category: ['EBC', 'General'],
        educationLevel: ['Undergraduate', 'Postgraduate', 'Engineering', 'Diploma', 'Medicine'],
      },
    },
  });
  await prisma.requiredDocument.createMany({
    data: [
      { scholarshipId: ambedkarEBC.id, documentName: 'EBC / Income Certificate (below ₹1 lakh)', mandatory: true },
      { scholarshipId: ambedkarEBC.id, documentName: 'Previous Year Marksheet', mandatory: true },
      { scholarshipId: ambedkarEBC.id, documentName: 'Aadhaar Card', mandatory: true },
      { scholarshipId: ambedkarEBC.id, documentName: 'Bonafide Certificate from Institution', mandatory: true },
      { scholarshipId: ambedkarEBC.id, documentName: 'Bank Passbook (linked with Aadhaar)', mandatory: true },
    ],
  });

  // ─────────────────────────────────────────────────────────────
  // 12. Ishan Uday — NE Region Scholarship
  // ─────────────────────────────────────────────────────────────
  const ishanUday = await prisma.scholarship.create({
    data: {
      title: 'Ishan Uday Special Scholarship Scheme for North Eastern Region',
      description:
        'Special scholarship for students domiciled in the North Eastern Region of India who have secured admission in colleges and universities outside the North-East to encourage higher education.',
      provider: 'University Grants Commission (UGC), Ministry of Education',
      amount: 54000,
      applicationUrl: 'https://scholarships.gov.in',
      deadline: new Date('2026-12-31'),
      status: 'ACTIVE',
    },
  });
  await prisma.eligibilityRule.create({
    data: {
      scholarshipId: ishanUday.id,
      ruleJson: {
        state: ['Arunachal Pradesh', 'Assam', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Sikkim', 'Tripura'],
        income: { max: 450000 },
        educationLevel: ['Undergraduate', 'Engineering', 'Medicine', 'Science', 'Commerce', 'Arts'],
      },
    },
  });
  await prisma.requiredDocument.createMany({
    data: [
      { scholarshipId: ishanUday.id, documentName: 'Domicile Certificate of NE State', mandatory: true },
      { scholarshipId: ishanUday.id, documentName: 'Class 12 Marksheet (Min 60%)', mandatory: true },
      { scholarshipId: ishanUday.id, documentName: 'Income Certificate', mandatory: true },
      { scholarshipId: ishanUday.id, documentName: 'Admission Letter from College', mandatory: true },
      { scholarshipId: ishanUday.id, documentName: 'Aadhaar Card', mandatory: true },
    ],
  });

  // ─────────────────────────────────────────────────────────────
  // 13. Post Matric Scholarship for SC Students (PMS-SC)
  // ─────────────────────────────────────────────────────────────
  const pmsSC = await prisma.scholarship.create({
    data: {
      title: 'Post Matric Scholarship for Scheduled Caste Students (PMS-SC)',
      description:
        'Aims to provide financial assistance to Scheduled Caste students studying at post matriculation or post-secondary stage to enable them to complete their education. All tuition fees, hostel fees, study tour charges are covered.',
      provider: 'Ministry of Social Justice and Empowerment, Govt of India',
      amount: 75000,
      applicationUrl: 'https://scholarships.gov.in',
      deadline: new Date('2026-10-31'),
      status: 'ACTIVE',
    },
  });
  await prisma.eligibilityRule.create({
    data: {
      scholarshipId: pmsSC.id,
      ruleJson: {
        category: ['SC'],
        income: { max: 250000 },
        educationLevel: ['School', 'Undergraduate', 'Postgraduate', 'Engineering', 'Medicine', 'Diploma'],
      },
    },
  });
  await prisma.requiredDocument.createMany({
    data: [
      { scholarshipId: pmsSC.id, documentName: 'SC Caste Certificate', mandatory: true },
      { scholarshipId: pmsSC.id, documentName: 'Income Certificate (below ₹2.5 lakh)', mandatory: true },
      { scholarshipId: pmsSC.id, documentName: 'Previous Year Marksheet', mandatory: true },
      { scholarshipId: pmsSC.id, documentName: 'Aadhaar Card', mandatory: true },
      { scholarshipId: pmsSC.id, documentName: 'Bonafide Certificate', mandatory: true },
      { scholarshipId: pmsSC.id, documentName: 'Bank Account Passbook', mandatory: true },
    ],
  });

  // ─────────────────────────────────────────────────────────────
  // 14. Post Matric Scholarship for ST Students
  // ─────────────────────────────────────────────────────────────
  const pmsST = await prisma.scholarship.create({
    data: {
      title: 'Post Matric Scholarship for Scheduled Tribe Students',
      description:
        'Provides financial assistance to Scheduled Tribe students for post-matriculation courses including engineering, medical, law, and other professional programs at recognized institutions in India.',
      provider: 'Ministry of Tribal Affairs, Govt of India',
      amount: 60000,
      applicationUrl: 'https://scholarships.gov.in',
      deadline: new Date('2026-10-31'),
      status: 'ACTIVE',
    },
  });
  await prisma.eligibilityRule.create({
    data: {
      scholarshipId: pmsST.id,
      ruleJson: {
        category: ['ST'],
        income: { max: 250000 },
        educationLevel: ['School', 'Undergraduate', 'Postgraduate', 'Engineering', 'Medicine', 'Law'],
      },
    },
  });
  await prisma.requiredDocument.createMany({
    data: [
      { scholarshipId: pmsST.id, documentName: 'ST Tribe Certificate', mandatory: true },
      { scholarshipId: pmsST.id, documentName: 'Income Certificate (below ₹2.5 lakh)', mandatory: true },
      { scholarshipId: pmsST.id, documentName: 'Previous Year Marksheet', mandatory: true },
      { scholarshipId: pmsST.id, documentName: 'Aadhaar Card', mandatory: true },
      { scholarshipId: pmsST.id, documentName: 'Admission Letter', mandatory: true },
    ],
  });

  // ─────────────────────────────────────────────────────────────
  // 15. Pre-Matric Scholarship for OBC Students
  // ─────────────────────────────────────────────────────────────
  const preMatricOBC = await prisma.scholarship.create({
    data: {
      title: 'Pre Matric Scholarship for OBC Students (Class IX and X)',
      description:
        'Financial assistance for students of Other Backward Classes (OBC) studying in Classes IX and X to prevent drop-out and encourage continuation of education at the secondary school level.',
      provider: 'Ministry of Social Justice and Empowerment, Govt of India',
      amount: 5000,
      applicationUrl: 'https://scholarships.gov.in',
      deadline: new Date('2026-11-30'),
      status: 'ACTIVE',
    },
  });
  await prisma.eligibilityRule.create({
    data: {
      scholarshipId: preMatricOBC.id,
      ruleJson: {
        category: ['OBC'],
        income: { max: 100000 },
        educationLevel: ['School'],
      },
    },
  });
  await prisma.requiredDocument.createMany({
    data: [
      { scholarshipId: preMatricOBC.id, documentName: 'OBC Non-Creamy Layer Certificate', mandatory: true },
      { scholarshipId: preMatricOBC.id, documentName: 'Income Certificate', mandatory: true },
      { scholarshipId: preMatricOBC.id, documentName: 'Previous Class Marksheet', mandatory: true },
      { scholarshipId: preMatricOBC.id, documentName: 'Aadhaar Card', mandatory: true },
      { scholarshipId: preMatricOBC.id, documentName: 'School Bonafide Certificate', mandatory: true },
    ],
  });

  // ─────────────────────────────────────────────────────────────
  // 16. Maulana Azad National Fellowship (MANF)
  // ─────────────────────────────────────────────────────────────
  const manf = await prisma.scholarship.create({
    data: {
      title: 'Maulana Azad National Fellowship for Minority Students',
      description:
        'Provides fellowships for minority students (Muslim, Christian, Sikh, Buddhist, Jain, Zoroastrian) to pursue M.Phil and Ph.D. degrees from recognized universities and institutions.',
      provider: 'Ministry of Minority Affairs, Govt of India',
      amount: 372000,
      applicationUrl: 'https://scholarships.gov.in',
      deadline: new Date('2026-11-30'),
      status: 'ACTIVE',
    },
  });
  await prisma.eligibilityRule.create({
    data: {
      scholarshipId: manf.id,
      ruleJson: {
        category: ['Minority'],
        educationLevel: ['M.Phil', 'Ph.D.', 'Postgraduate'],
        income: { max: 600000 },
      },
    },
  });
  await prisma.requiredDocument.createMany({
    data: [
      { scholarshipId: manf.id, documentName: 'Minority Community Certificate', mandatory: true },
      { scholarshipId: manf.id, documentName: 'Postgraduate Degree Certificate', mandatory: true },
      { scholarshipId: manf.id, documentName: 'UGC-NET / CSIR-NET / JRF Scorecard (if applicable)', mandatory: false },
      { scholarshipId: manf.id, documentName: 'Income Certificate', mandatory: true },
      { scholarshipId: manf.id, documentName: 'Aadhaar Card', mandatory: true },
    ],
  });

  // ─────────────────────────────────────────────────────────────
  // 17. KVPY — Kishore Vaigyanik Protsahan Yojana
  // ─────────────────────────────────────────────────────────────
  const kvpy = await prisma.scholarship.create({
    data: {
      title: 'Kishore Vaigyanik Protsahan Yojana (KVPY) Fellowship',
      description:
        'A national fellowship and scholarship program in basic sciences to attract exceptionally motivated students to pursue research careers in Science. Fellows receive monthly stipends during B.Sc./B.S./B.Stat./B.Math./Int. M.Sc./M.S. and contingency grants.',
      provider: 'Department of Science and Technology, Govt of India (Administered by IISc Bangalore)',
      amount: 96000,
      applicationUrl: 'http://www.kvpy.iisc.ernet.in',
      deadline: new Date('2026-09-30'),
      status: 'ACTIVE',
    },
  });
  await prisma.eligibilityRule.create({
    data: {
      scholarshipId: kvpy.id,
      ruleJson: {
        educationLevel: ['School', 'Undergraduate', 'Science'],
        minimumMarks: 75,
      },
    },
  });
  await prisma.requiredDocument.createMany({
    data: [
      { scholarshipId: kvpy.id, documentName: 'KVPY Aptitude Test Scorecard', mandatory: true },
      { scholarshipId: kvpy.id, documentName: 'Class 10 / 12 Marksheet', mandatory: true },
      { scholarshipId: kvpy.id, documentName: 'Aadhaar Card', mandatory: true },
      { scholarshipId: kvpy.id, documentName: 'Science Enrollment Certificate', mandatory: true },
    ],
  });

  // ─────────────────────────────────────────────────────────────
  // 18. Inspire Scholarship for Higher Education (SHE)
  // ─────────────────────────────────────────────────────────────
  const inspire = await prisma.scholarship.create({
    data: {
      title: 'INSPIRE Scholarship for Higher Education (SHE) — DST',
      description:
        'Attracts talent for study of Natural and Basic Sciences at the undergraduate and post-graduate level. Scholarship is given to top 1% of Class 12 board exam in each stream pursuing BSc, BS, Int. MSc or Int. MS in Natural/Basic Sciences.',
      provider: 'Department of Science and Technology (DST), Govt of India',
      amount: 80000,
      applicationUrl: 'http://www.online-inspire.gov.in',
      deadline: new Date('2026-10-31'),
      status: 'ACTIVE',
    },
  });
  await prisma.eligibilityRule.create({
    data: {
      scholarshipId: inspire.id,
      ruleJson: {
        educationLevel: ['Undergraduate', 'Science', 'Postgraduate'],
        minimumMarks: 75,
        subject: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Statistics'],
      },
    },
  });
  await prisma.requiredDocument.createMany({
    data: [
      { scholarshipId: inspire.id, documentName: 'Class 12 Marksheet (Top 1% rank proof)', mandatory: true },
      { scholarshipId: inspire.id, documentName: 'Admission Letter (BSc/BS/Int. MSc in Science)', mandatory: true },
      { scholarshipId: inspire.id, documentName: 'Aadhaar Card', mandatory: true },
      { scholarshipId: inspire.id, documentName: 'Bank Account Passbook', mandatory: true },
    ],
  });

  // ─────────────────────────────────────────────────────────────
  // 19. Rajasthan Anuprati Coaching Scheme
  // ─────────────────────────────────────────────────────────────
  const anuprati = await prisma.scholarship.create({
    data: {
      title: 'Rajasthan Mukhyamantri Anuprati Coaching Yojana',
      description:
        'Provides free coaching to SC, ST, OBC, MBC and EWS students of Rajasthan for competitive exams like IIT-JEE, NEET, CLAT, UPSC, RPSC and other state-level examinations. Accommodation and food allowance also provided.',
      provider: 'Social Justice and Empowerment Department, Govt of Rajasthan',
      amount: 40000,
      applicationUrl: 'https://sso.rajasthan.gov.in',
      deadline: new Date('2026-08-31'),
      status: 'ACTIVE',
    },
  });
  await prisma.eligibilityRule.create({
    data: {
      scholarshipId: anuprati.id,
      ruleJson: {
        state: ['Rajasthan'],
        category: ['SC', 'ST', 'OBC', 'MBC', 'EWS'],
        income: { max: 800000 },
        educationLevel: ['School', 'Undergraduate'],
      },
    },
  });
  await prisma.requiredDocument.createMany({
    data: [
      { scholarshipId: anuprati.id, documentName: 'Rajasthan Domicile Certificate', mandatory: true },
      { scholarshipId: anuprati.id, documentName: 'Caste Certificate (SC/ST/OBC/MBC/EWS)', mandatory: true },
      { scholarshipId: anuprati.id, documentName: 'Income Certificate', mandatory: true },
      { scholarshipId: anuprati.id, documentName: 'Class 10/12 Marksheet', mandatory: true },
      { scholarshipId: anuprati.id, documentName: 'Aadhaar Card', mandatory: true },
    ],
  });

  // ─────────────────────────────────────────────────────────────
  // 20. Karnataka Rajyotsava Scholarship
  // ─────────────────────────────────────────────────────────────
  const karnataka = await prisma.scholarship.create({
    data: {
      title: 'Karnataka Rajyotsava Merit Scholarship',
      description:
        'Meritorious scholarship by the Govt of Karnataka for students who top their board exams (Class 10 and 12). Encourages academic excellence among students studying in recognized schools in Karnataka.',
      provider: 'Department of Primary and Secondary Education, Govt of Karnataka',
      amount: 10000,
      applicationUrl: 'https://ssp.karnataka.gov.in',
      deadline: new Date('2026-09-30'),
      status: 'ACTIVE',
    },
  });
  await prisma.eligibilityRule.create({
    data: {
      scholarshipId: karnataka.id,
      ruleJson: {
        state: ['Karnataka'],
        educationLevel: ['School'],
        minimumMarks: 85,
      },
    },
  });
  await prisma.requiredDocument.createMany({
    data: [
      { scholarshipId: karnataka.id, documentName: 'Karnataka Domicile Certificate', mandatory: true },
      { scholarshipId: karnataka.id, documentName: 'Class 10 / 12 Marksheet (Min 85%)', mandatory: true },
      { scholarshipId: karnataka.id, documentName: 'Aadhaar Card', mandatory: true },
      { scholarshipId: karnataka.id, documentName: 'Bank Passbook Copy', mandatory: true },
    ],
  });

  // ─────────────────────────────────────────────────────────────
  // 21. UP Scholarship for SC/ST/General/OBC
  // ─────────────────────────────────────────────────────────────
  const upScholarship = await prisma.scholarship.create({
    data: {
      title: 'Uttar Pradesh Pre & Post Matric Scholarship (SC/ST/General/OBC)',
      description:
        'One of the largest scholarship programs in India by student coverage. Provides financial assistance to students of all categories (SC, ST, OBC, General/EWS) studying in Class 9 onwards at recognized UP schools, colleges and universities.',
      provider: 'Social Welfare Department, Govt of Uttar Pradesh',
      amount: 25000,
      applicationUrl: 'https://scholarship.up.gov.in',
      deadline: new Date('2026-11-30'),
      status: 'ACTIVE',
    },
  });
  await prisma.eligibilityRule.create({
    data: {
      scholarshipId: upScholarship.id,
      ruleJson: {
        state: ['Uttar Pradesh'],
        category: ['SC', 'ST', 'OBC', 'General', 'EWS'],
        income: { max: 200000 },
        educationLevel: ['School', 'Undergraduate', 'Postgraduate'],
      },
    },
  });
  await prisma.requiredDocument.createMany({
    data: [
      { scholarshipId: upScholarship.id, documentName: 'UP Domicile / Residence Certificate', mandatory: true },
      { scholarshipId: upScholarship.id, documentName: 'Caste Certificate', mandatory: true },
      { scholarshipId: upScholarship.id, documentName: 'Income Certificate', mandatory: true },
      { scholarshipId: upScholarship.id, documentName: 'Previous Year Marksheet', mandatory: true },
      { scholarshipId: upScholarship.id, documentName: 'Aadhaar Card', mandatory: true },
      { scholarshipId: upScholarship.id, documentName: 'Bank Passbook (Aadhaar Linked)', mandatory: true },
    ],
  });

  // ─────────────────────────────────────────────────────────────
  // 22. West Bengal Aikyashree Scholarship
  // ─────────────────────────────────────────────────────────────
  const aikyashree = await prisma.scholarship.create({
    data: {
      title: 'West Bengal Aikyashree Scholarship Scheme for Minority Students',
      description:
        'Provides scholarships to minority students (Muslim, Christian, Sikh, Buddhist, Jain, Parsi/Zoroastrian) in West Bengal from pre-matric to post-doctoral levels to promote educational development.',
      provider: 'Paschim Banga Minorities Development & Finance Corporation, Govt of West Bengal',
      amount: 18000,
      applicationUrl: 'https://wbmdfcscholarship.in',
      deadline: new Date('2026-12-15'),
      status: 'ACTIVE',
    },
  });
  await prisma.eligibilityRule.create({
    data: {
      scholarshipId: aikyashree.id,
      ruleJson: {
        state: ['West Bengal'],
        category: ['Minority'],
        income: { max: 200000 },
        educationLevel: ['School', 'Undergraduate', 'Postgraduate'],
      },
    },
  });
  await prisma.requiredDocument.createMany({
    data: [
      { scholarshipId: aikyashree.id, documentName: 'WB Domicile Certificate', mandatory: true },
      { scholarshipId: aikyashree.id, documentName: 'Minority Community Certificate', mandatory: true },
      { scholarshipId: aikyashree.id, documentName: 'Income Certificate', mandatory: true },
      { scholarshipId: aikyashree.id, documentName: 'Previous Year Marksheet', mandatory: true },
      { scholarshipId: aikyashree.id, documentName: 'Aadhaar Card', mandatory: true },
    ],
  });

  // ─────────────────────────────────────────────────────────────
  // 23. Tamil Nadu CM Scholarship
  // ─────────────────────────────────────────────────────────────
  const tamilnaduCM = await prisma.scholarship.create({
    data: {
      title: "Tamil Nadu Chief Minister's Scholarship for First Generation College Students",
      description:
        'Provides financial assistance specifically for first generation college graduates — students whose parents have never attended college — to reduce dropout rate and encourage higher education pursuit in Tamil Nadu.',
      provider: 'Adi Dravidar and Tribal Welfare Department, Govt of Tamil Nadu',
      amount: 15000,
      applicationUrl: 'https://tnscholarships.tn.gov.in',
      deadline: new Date('2026-10-15'),
      status: 'ACTIVE',
    },
  });
  await prisma.eligibilityRule.create({
    data: {
      scholarshipId: tamilnaduCM.id,
      ruleJson: {
        state: ['Tamil Nadu'],
        income: { max: 200000 },
        educationLevel: ['Undergraduate'],
        firstGenerationGraduate: true,
      },
    },
  });
  await prisma.requiredDocument.createMany({
    data: [
      { scholarshipId: tamilnaduCM.id, documentName: 'TN Domicile Certificate', mandatory: true },
      { scholarshipId: tamilnaduCM.id, documentName: 'Income Certificate', mandatory: true },
      { scholarshipId: tamilnaduCM.id, documentName: 'Parent Education Proof (proving first-generation status)', mandatory: true },
      { scholarshipId: tamilnaduCM.id, documentName: 'Class 12 Marksheet', mandatory: true },
      { scholarshipId: tamilnaduCM.id, documentName: 'Aadhaar Card', mandatory: true },
    ],
  });

  // ─────────────────────────────────────────────────────────────
  // 24. Punjab Dr. Ambedkar Scholarship
  // ─────────────────────────────────────────────────────────────
  const punjabAmbedkar = await prisma.scholarship.create({
    data: {
      title: 'Punjab Dr. Ambedkar Scholarship for SC Students (Post Matric)',
      description:
        'Financial assistance to SC students domiciled in Punjab for pursuing post-matric education. Covers tuition fees, maintenance allowance, and other academic expenses for courses at Class 11 level and above.',
      provider: 'Department of Welfare of Scheduled Castes and Backward Classes, Govt of Punjab',
      amount: 20000,
      applicationUrl: 'https://scholarships.punjab.gov.in',
      deadline: new Date('2026-11-30'),
      status: 'ACTIVE',
    },
  });
  await prisma.eligibilityRule.create({
    data: {
      scholarshipId: punjabAmbedkar.id,
      ruleJson: {
        state: ['Punjab'],
        category: ['SC'],
        income: { max: 250000 },
        educationLevel: ['School', 'Undergraduate', 'Postgraduate', 'Engineering', 'Medicine'],
      },
    },
  });
  await prisma.requiredDocument.createMany({
    data: [
      { scholarshipId: punjabAmbedkar.id, documentName: 'Punjab Domicile Certificate', mandatory: true },
      { scholarshipId: punjabAmbedkar.id, documentName: 'SC Caste Certificate', mandatory: true },
      { scholarshipId: punjabAmbedkar.id, documentName: 'Income Certificate', mandatory: true },
      { scholarshipId: punjabAmbedkar.id, documentName: 'Previous Year Marksheet', mandatory: true },
      { scholarshipId: punjabAmbedkar.id, documentName: 'Aadhaar Card', mandatory: true },
    ],
  });

  // ─────────────────────────────────────────────────────────────
  // 25. Gujarat Scholarship for SC Students (Manav Garima)
  // ─────────────────────────────────────────────────────────────
  const manavGarima = await prisma.scholarship.create({
    data: {
      title: 'Gujarat Manav Garima Scheme for SC Artisans and Students',
      description:
        'Provides financial assistance and equipment/toolkits to SC students and artisans in Gujarat to enable them to become self-reliant. Also covers educational expenses for Class 11 and above.',
      provider: 'Social Justice and Empowerment Department, Govt of Gujarat',
      amount: 14000,
      applicationUrl: 'https://esamajkalyan.gujarat.gov.in',
      deadline: new Date('2026-12-31'),
      status: 'ACTIVE',
    },
  });
  await prisma.eligibilityRule.create({
    data: {
      scholarshipId: manavGarima.id,
      ruleJson: {
        state: ['Gujarat'],
        category: ['SC'],
        income: { max: 120000 },
        educationLevel: ['School', 'Undergraduate', 'Diploma'],
      },
    },
  });
  await prisma.requiredDocument.createMany({
    data: [
      { scholarshipId: manavGarima.id, documentName: 'Gujarat Domicile Certificate', mandatory: true },
      { scholarshipId: manavGarima.id, documentName: 'SC Caste Certificate', mandatory: true },
      { scholarshipId: manavGarima.id, documentName: 'Income Certificate (below ₹1.2 lakh)', mandatory: true },
      { scholarshipId: manavGarima.id, documentName: 'Previous Year Marksheet', mandatory: true },
      { scholarshipId: manavGarima.id, documentName: 'Aadhaar Card', mandatory: true },
    ],
  });

  // ─────────────────────────────────────────────────────────────
  // 26. Odisha PRERANA Scholarship
  // ─────────────────────────────────────────────────────────────
  const prerana = await prisma.scholarship.create({
    data: {
      title: 'Odisha PRERANA Scholarship for Meritorious SC/ST Students',
      description:
        'Encourages meritorious SC/ST students in Odisha for pursuing professional degrees such as Engineering, Medicine, Law, and Management. Covers tuition fees, book grants, and maintenance allowance.',
      provider: 'ST & SC Development Department, Govt of Odisha',
      amount: 35000,
      applicationUrl: 'https://scholarship.odisha.gov.in',
      deadline: new Date('2026-10-15'),
      status: 'ACTIVE',
    },
  });
  await prisma.eligibilityRule.create({
    data: {
      scholarshipId: prerana.id,
      ruleJson: {
        state: ['Odisha'],
        category: ['SC', 'ST'],
        income: { max: 250000 },
        educationLevel: ['Engineering', 'Medicine', 'Law', 'Management', 'Undergraduate'],
        minimumMarks: 60,
      },
    },
  });
  await prisma.requiredDocument.createMany({
    data: [
      { scholarshipId: prerana.id, documentName: 'Odisha Domicile Certificate', mandatory: true },
      { scholarshipId: prerana.id, documentName: 'SC/ST Caste Certificate', mandatory: true },
      { scholarshipId: prerana.id, documentName: 'Income Certificate', mandatory: true },
      { scholarshipId: prerana.id, documentName: 'Class 12 Marksheet (Min 60%)', mandatory: true },
      { scholarshipId: prerana.id, documentName: 'Aadhaar Card', mandatory: true },
      { scholarshipId: prerana.id, documentName: 'OJEE/JEE Rank Card (for Engineering)', mandatory: false },
    ],
  });

  // ─────────────────────────────────────────────────────────────
  // 27. Telangana TS ePass Scholarship
  // ─────────────────────────────────────────────────────────────
  const tsEpass = await prisma.scholarship.create({
    data: {
      title: 'Telangana State TS ePass Post Matric Scholarship',
      description:
        'Financial assistance for SC, ST, BC, EBC and Disabled students domiciled in Telangana for pursuing post-matriculation courses. Covers course fee, special fee and maintenance allowance.',
      provider: 'Backward Classes Welfare Department, Govt of Telangana',
      amount: 45000,
      applicationUrl: 'https://telanganaepass.cgg.gov.in',
      deadline: new Date('2026-11-30'),
      status: 'ACTIVE',
    },
  });
  await prisma.eligibilityRule.create({
    data: {
      scholarshipId: tsEpass.id,
      ruleJson: {
        state: ['Telangana'],
        category: ['SC', 'ST', 'BC', 'EBC'],
        income: { max: 200000 },
        educationLevel: ['School', 'Undergraduate', 'Postgraduate', 'Engineering', 'Medicine'],
      },
    },
  });
  await prisma.requiredDocument.createMany({
    data: [
      { scholarshipId: tsEpass.id, documentName: 'Telangana Domicile Certificate', mandatory: true },
      { scholarshipId: tsEpass.id, documentName: 'Caste Certificate', mandatory: true },
      { scholarshipId: tsEpass.id, documentName: 'Income Certificate', mandatory: true },
      { scholarshipId: tsEpass.id, documentName: 'Previous Year Marksheet', mandatory: true },
      { scholarshipId: tsEpass.id, documentName: 'Aadhaar Card', mandatory: true },
      { scholarshipId: tsEpass.id, documentName: 'Fee Receipts', mandatory: true },
    ],
  });

  // ─────────────────────────────────────────────────────────────
  // 28. Andhra Pradesh Jagananna Vidya Deevena
  // ─────────────────────────────────────────────────────────────
  const jaganannaVD = await prisma.scholarship.create({
    data: {
      title: "Andhra Pradesh Jagananna Vidya Deevena (Fee Reimbursement)",
      description:
        'Covers full tuition fee reimbursement for all students of SC, ST, BC, EBC, Kapu and Minority communities of Andhra Pradesh pursuing degree, engineering, polytechnic, pharma and other professional courses.',
      provider: 'BC Welfare Department, Govt of Andhra Pradesh',
      amount: 100000,
      applicationUrl: 'https://navasakam.ap.gov.in',
      deadline: new Date('2026-10-31'),
      status: 'ACTIVE',
    },
  });
  await prisma.eligibilityRule.create({
    data: {
      scholarshipId: jaganannaVD.id,
      ruleJson: {
        state: ['Andhra Pradesh'],
        category: ['SC', 'ST', 'BC', 'EBC', 'Minority', 'Kapu'],
        income: { max: 250000 },
        educationLevel: ['Undergraduate', 'Engineering', 'Medicine', 'Pharmacy', 'Diploma'],
      },
    },
  });
  await prisma.requiredDocument.createMany({
    data: [
      { scholarshipId: jaganannaVD.id, documentName: 'AP Domicile Certificate', mandatory: true },
      { scholarshipId: jaganannaVD.id, documentName: 'Caste Certificate', mandatory: true },
      { scholarshipId: jaganannaVD.id, documentName: 'Income Certificate', mandatory: true },
      { scholarshipId: jaganannaVD.id, documentName: 'Class 12 Marksheet', mandatory: true },
      { scholarshipId: jaganannaVD.id, documentName: 'Aadhaar Card', mandatory: true },
      { scholarshipId: jaganannaVD.id, documentName: 'College Fee Receipt', mandatory: true },
    ],
  });

  // ─────────────────────────────────────────────────────────────
  // 29. HDFC Badhte Kadam Scholarship
  // ─────────────────────────────────────────────────────────────
  const hdfcBadhte = await prisma.scholarship.create({
    data: {
      title: 'HDFC Bank Badhte Kadam Scholarship',
      description:
        'Provides financial support to underprivileged students in India from Class 6 to postgraduate level. Aims to enable children of daily wage labourers, farm workers, and low-income families to continue their education without interruption.',
      provider: 'HDFC Bank Parivartan (CSR) / Buddy4Study',
      amount: 18000,
      applicationUrl: 'https://www.buddy4study.com/scholarship/hdfc-bank-badhte-kadam-scholarship',
      deadline: new Date('2026-09-30'),
      status: 'ACTIVE',
    },
  });
  await prisma.eligibilityRule.create({
    data: {
      scholarshipId: hdfcBadhte.id,
      ruleJson: {
        income: { max: 200000 },
        educationLevel: ['School', 'Undergraduate', 'Postgraduate'],
        minimumMarks: 55,
      },
    },
  });
  await prisma.requiredDocument.createMany({
    data: [
      { scholarshipId: hdfcBadhte.id, documentName: 'Previous Year Marksheet (Min 55%)', mandatory: true },
      { scholarshipId: hdfcBadhte.id, documentName: 'Income Certificate or Salary Slip', mandatory: true },
      { scholarshipId: hdfcBadhte.id, documentName: 'Aadhaar Card', mandatory: true },
      { scholarshipId: hdfcBadhte.id, documentName: 'Bank Account Details', mandatory: true },
      { scholarshipId: hdfcBadhte.id, documentName: 'Passport Size Photograph', mandatory: true },
    ],
  });

  // ─────────────────────────────────────────────────────────────
  // 30. Tata Capital Pankh Scholarship
  // ─────────────────────────────────────────────────────────────
  const tataPankh = await prisma.scholarship.create({
    data: {
      title: 'Tata Capital Pankh Scholarship Programme',
      description:
        'Tata Capital supports students from economically weaker sections studying in Class 11 and 12 (vocational/science/commerce/arts), Diploma, ITI, Undergraduate and Postgraduate professional courses by providing financial assistance.',
      provider: 'Tata Capital Ltd. (CSR Initiative) / Buddy4Study',
      amount: 12000,
      applicationUrl: 'https://www.buddy4study.com/scholarship/tata-capital-pankh-scholarship',
      deadline: new Date('2026-10-15'),
      status: 'ACTIVE',
    },
  });
  await prisma.eligibilityRule.create({
    data: {
      scholarshipId: tataPankh.id,
      ruleJson: {
        income: { max: 400000 },
        educationLevel: ['School', 'Undergraduate', 'Postgraduate', 'Diploma', 'ITI'],
        minimumMarks: 60,
      },
    },
  });
  await prisma.requiredDocument.createMany({
    data: [
      { scholarshipId: tataPankh.id, documentName: 'Previous Year Marksheet (Min 60%)', mandatory: true },
      { scholarshipId: tataPankh.id, documentName: 'Income Certificate', mandatory: true },
      { scholarshipId: tataPankh.id, documentName: 'Aadhaar Card', mandatory: true },
      { scholarshipId: tataPankh.id, documentName: 'College/School Enrollment Certificate', mandatory: true },
      { scholarshipId: tataPankh.id, documentName: 'Bank Passbook', mandatory: true },
    ],
  });

  // ─────────────────────────────────────────────────────────────
  // 31. L&T Build India Scholarship
  // ─────────────────────────────────────────────────────────────
  const lntBuild = await prisma.scholarship.create({
    data: {
      title: "L&T Build India Scholarship for Engineering Students",
      description:
        'Larsen & Toubro (L&T) offers this scholarship to undergraduate Engineering students pursuing B.E./B.Tech in Civil, Mechanical, Electrical, or Electronics disciplines from recognized Indian universities. Aims to build India\'s future engineers.',
      provider: "Larsen & Toubro Ltd. (L&T) / Buddy4Study",
      amount: 60000,
      applicationUrl: 'https://www.buddy4study.com/scholarship/lt-build-india-scholarship',
      deadline: new Date('2026-09-30'),
      status: 'ACTIVE',
    },
  });
  await prisma.eligibilityRule.create({
    data: {
      scholarshipId: lntBuild.id,
      ruleJson: {
        income: { max: 600000 },
        educationLevel: ['Engineering'],
        subject: ['Civil', 'Mechanical', 'Electrical', 'Electronics'],
        minimumMarks: 60,
      },
    },
  });
  await prisma.requiredDocument.createMany({
    data: [
      { scholarshipId: lntBuild.id, documentName: 'Class 12 Marksheet (Min 60%)', mandatory: true },
      { scholarshipId: lntBuild.id, documentName: 'JEE Mains Score or Equivalent Exam', mandatory: true },
      { scholarshipId: lntBuild.id, documentName: 'Income Certificate', mandatory: true },
      { scholarshipId: lntBuild.id, documentName: 'Aadhaar Card', mandatory: true },
      { scholarshipId: lntBuild.id, documentName: 'Admission/Enrollment Letter', mandatory: true },
    ],
  });

  // ─────────────────────────────────────────────────────────────
  // 32. Sitaram Jindal Foundation Scholarship
  // ─────────────────────────────────────────────────────────────
  const jindal = await prisma.scholarship.create({
    data: {
      title: 'Sitaram Jindal Foundation Scholarship',
      description:
        'One of the largest corporate-funded scholarships in India. Available to underprivileged students from Class 11 to postgraduate level, covering engineering, medical, law, and arts courses at Indian colleges.',
      provider: 'Sitaram Jindal Foundation (JSW Group CSR)',
      amount: 36000,
      applicationUrl: 'https://www.sitaramjindalfoundation.org',
      deadline: new Date('2026-11-30'),
      status: 'ACTIVE',
    },
  });
  await prisma.eligibilityRule.create({
    data: {
      scholarshipId: jindal.id,
      ruleJson: {
        income: { max: 250000 },
        educationLevel: ['School', 'Undergraduate', 'Postgraduate', 'Engineering', 'Medicine', 'Law'],
        minimumMarks: 65,
      },
    },
  });
  await prisma.requiredDocument.createMany({
    data: [
      { scholarshipId: jindal.id, documentName: 'Previous Year Marksheet (Min 65%)', mandatory: true },
      { scholarshipId: jindal.id, documentName: 'Income Certificate', mandatory: true },
      { scholarshipId: jindal.id, documentName: 'Aadhaar Card', mandatory: true },
      { scholarshipId: jindal.id, documentName: 'Fee Receipt / Admission Letter', mandatory: true },
      { scholarshipId: jindal.id, documentName: 'Passport Size Photograph', mandatory: true },
    ],
  });

  // ─────────────────────────────────────────────────────────────
  // 33. Vidyasaarathi Scholarship (NSE Foundation)
  // ─────────────────────────────────────────────────────────────
  const vidyasaarathi = await prisma.scholarship.create({
    data: {
      title: 'Vidyasaarathi Scholarship by NSE Foundation',
      description:
        'NSE Foundation runs an aggregated corporate scholarship platform where multiple companies offer scholarships to meritorious and financially needy students in engineering, medicine, law, and social sciences.',
      provider: 'NSE Foundation / Multiple Corporates (Vidyasaarathi Platform)',
      amount: 50000,
      applicationUrl: 'https://www.vidyasaarathi.co.in',
      deadline: new Date('2026-12-31'),
      status: 'ACTIVE',
    },
  });
  await prisma.eligibilityRule.create({
    data: {
      scholarshipId: vidyasaarathi.id,
      ruleJson: {
        income: { max: 600000 },
        educationLevel: ['Engineering', 'Medicine', 'Law', 'Undergraduate', 'Postgraduate'],
        minimumMarks: 60,
      },
    },
  });
  await prisma.requiredDocument.createMany({
    data: [
      { scholarshipId: vidyasaarathi.id, documentName: 'Previous Year Marksheet', mandatory: true },
      { scholarshipId: vidyasaarathi.id, documentName: 'Income Certificate', mandatory: true },
      { scholarshipId: vidyasaarathi.id, documentName: 'Aadhaar Card', mandatory: true },
      { scholarshipId: vidyasaarathi.id, documentName: 'Enrollment Certificate', mandatory: true },
    ],
  });

  // ─────────────────────────────────────────────────────────────
  // 34. Aga Khan Foundation Scholarship
  // ─────────────────────────────────────────────────────────────
  const agaKhan = await prisma.scholarship.create({
    data: {
      title: 'Aga Khan Foundation International Scholarship Programme',
      description:
        'Supports high-achieving students from developing countries pursuing postgraduate-level studies. Grants are awarded on merit and financial need in the form of a half-grant / half-loan. Available to Indian citizens seeking PG abroad.',
      provider: 'Aga Khan Foundation (International)',
      amount: 1500000,
      applicationUrl: 'https://www.akdn.org/our-agencies/aga-khan-foundation/social-development/scholarships',
      deadline: new Date('2026-03-31'),
      status: 'ACTIVE',
    },
  });
  await prisma.eligibilityRule.create({
    data: {
      scholarshipId: agaKhan.id,
      ruleJson: {
        educationLevel: ['Postgraduate', 'Masters', 'Ph.D.'],
        income: { max: 600000 },
        minimumMarks: 75,
      },
    },
  });
  await prisma.requiredDocument.createMany({
    data: [
      { scholarshipId: agaKhan.id, documentName: 'Undergraduate Degree / Transcripts', mandatory: true },
      { scholarshipId: agaKhan.id, documentName: 'University Admission Letter (Abroad)', mandatory: true },
      { scholarshipId: agaKhan.id, documentName: 'Income Proof of Family', mandatory: true },
      { scholarshipId: agaKhan.id, documentName: 'Passport', mandatory: true },
      { scholarshipId: agaKhan.id, documentName: 'Statement of Purpose / Essay', mandatory: true },
      { scholarshipId: agaKhan.id, documentName: 'Two Letters of Recommendation', mandatory: true },
    ],
  });

  // ─────────────────────────────────────────────────────────────
  // 35. Reliance Foundation Scholarship
  // ─────────────────────────────────────────────────────────────
  const reliance = await prisma.scholarship.create({
    data: {
      title: 'Reliance Foundation Undergraduate Scholarship',
      description:
        'Supports exceptional undergraduates in India from STEM (Science, Technology, Engineering and Mathematics) and Humanities & Liberal Arts disciplines. Selected scholars get financial support plus mentoring, leadership development and networking.',
      provider: 'Reliance Foundation (Reliance Industries CSR)',
      amount: 200000,
      applicationUrl: 'https://reliancefoundation.org/scholarships',
      deadline: new Date('2026-02-28'),
      status: 'ACTIVE',
    },
  });
  await prisma.eligibilityRule.create({
    data: {
      scholarshipId: reliance.id,
      ruleJson: {
        income: { max: 1500000 },
        educationLevel: ['Undergraduate', 'Engineering', 'Science', 'Arts'],
        minimumMarks: 60,
      },
    },
  });
  await prisma.requiredDocument.createMany({
    data: [
      { scholarshipId: reliance.id, documentName: 'Class 12 Marksheet (Min 60%)', mandatory: true },
      { scholarshipId: reliance.id, documentName: 'Income Certificate / ITR', mandatory: true },
      { scholarshipId: reliance.id, documentName: 'Aadhaar Card', mandatory: true },
      { scholarshipId: reliance.id, documentName: 'Enrollment Letter from College', mandatory: true },
      { scholarshipId: reliance.id, documentName: 'Short Essay on Future Goals', mandatory: true },
    ],
  });

  // ─────────────────────────────────────────────────────────────
  // Create embeddings for all new scholarships
  // ─────────────────────────────────────────────────────────────
  const newScholarships = [
    ambedkarEBC, ishanUday, pmsSC, pmsST, preMatricOBC,
    manf, kvpy, inspire, anuprati, karnataka,
    upScholarship, aikyashree, tamilnaduCM, punjabAmbedkar, manavGarima,
    prerana, tsEpass, jaganannaVD, hdfcBadhte, tataPankh,
    lntBuild, jindal, vidyasaarathi, agaKhan, reliance,
  ];

  for (const s of newScholarships) {
    const rules = await prisma.eligibilityRule.findFirst({ where: { scholarshipId: s.id } });
    const docs = await prisma.requiredDocument.findMany({ where: { scholarshipId: s.id } });
    const docsStr = docs.map((d) => `- ${d.documentName} (${d.mandatory ? 'Mandatory' : 'Optional'})`).join('\n');

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

  const total = await prisma.scholarship.count();
  console.log(`✅ Seeding complete! Total scholarships in database: ${total}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
