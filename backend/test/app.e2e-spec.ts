import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma.service';

describe('Bureaucracy Copilot API (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  // Shared variables between tests
  const randomEmail = `test_${Date.now()}@example.com`;
  let userToken: string;
  let refreshToken: string;
  let testScholarshipId: string;
  let testApplicationId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
  }, 30000);

  afterAll(async () => {
    // Cleanup created test records
    if (prisma) {
      await prisma.user.deleteMany({
        where: { email: { startsWith: 'test_' } },
      });
    }
    await app.close();
  }, 30000);

  describe('Core Health API', () => {
    it('GET /health', () => {
      return request(app.getHttpServer())
        .get('/api/v1/health')
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('UP');
          expect(res.body.database).toBe('CONNECTED');
        });
    });
  });

  describe('Authentication Module', () => {
    it('POST /auth/register - Register User (AUTH-001)', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          name: 'Test Student',
          email: randomEmail,
          password: 'Password@123',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
        });
    });

    it('POST /auth/register - Register with existing email (AUTH-002)', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          name: 'Dupe User',
          email: randomEmail,
          password: 'Password@123',
        })
        .expect(400);
    });

    it('POST /auth/login - Valid login (AUTH-003)', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: randomEmail,
          password: 'Password@123',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.accessToken).toBeDefined();
          expect(res.body.refreshToken).toBeDefined();
          userToken = res.body.accessToken;
          refreshToken = res.body.refreshToken;
        });
    });

    it('POST /auth/login - Invalid Password (AUTH-004)', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: randomEmail,
          password: 'WrongPassword',
        })
        .expect(401);
    });

    it('GET /auth/me - Retrieve session user', () => {
      return request(app.getHttpServer())
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.email).toBe(randomEmail.toLowerCase());
        });
    });
  });

  describe('User Profile Module', () => {
    it('POST /profile - Create or Update Profile (PROF-001 / PROF-002)', () => {
      return request(app.getHttpServer())
        .post('/api/v1/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          age: 22,
          gender: 'Female',
          state: 'Maharashtra',
          educationLevel: 'Engineering',
          institutionType: 'Private',
          annualIncome: 250000,
          category: 'OBC',
          disability: false,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.age).toBe(22);
          expect(res.body.data.state).toBe('Maharashtra');
        });
    });

    it('POST /profile - Invalid Income verification (PROF-003)', () => {
      return request(app.getHttpServer())
        .post('/api/v1/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          annualIncome: -5000,
        })
        .expect(400);
    });

    it('GET /profile - Retrieve User Profile', () => {
      return request(app.getHttpServer())
        .get('/api/v1/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.age).toBe(22);
          expect(res.body.state).toBe('Maharashtra');
        });
    });
  });

  describe('Scholarship Catalog Module', () => {
    it('GET /scholarships - Retrieve Scholarships (SCH-001)', () => {
      return request(app.getHttpServer())
        .get('/api/v1/scholarships')
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toBeDefined();
          expect(res.body.total).toBeDefined();
          if (res.body.data.length > 0) {
            testScholarshipId = res.body.data[0].id;
          }
        });
    });

    it('GET /scholarships/:id - Retrieve Details (SCH-002)', async () => {
      if (!testScholarshipId) return;
      await request(app.getHttpServer())
        .get(`/api/v1/scholarships/${testScholarshipId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(testScholarshipId);
          expect(res.body.title).toBeDefined();
        });
    });

    it('POST /scholarships/search - Search Scholarships (SCH-003)', () => {
      return request(app.getHttpServer())
        .post('/api/v1/scholarships/search')
        .send({ keyword: 'Merit' })
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body.results)).toBe(true);
        });
    });
  });

  describe('Eligibility Engine', () => {
    it('POST /eligibility/check - Dynamic profile evaluation (ELIG-001 / ELIG-002)', () => {
      return request(app.getHttpServer())
        .post('/api/v1/eligibility/check')
        .send({
          state: 'Maharashtra',
          annualIncome: 300000,
          educationLevel: 'Engineering',
          category: 'OBC',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.matches).toBeDefined();
          expect(res.body.matches.length).toBeGreaterThanOrEqual(0);
        });
    });

    it('GET /eligibility/recommendations - Evaluate using saved profile (ELIG-003 / ELIG-005 / ELIG-006)', () => {
      return request(app.getHttpServer())
        .get('/api/v1/eligibility/recommendations')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.matches).toBeDefined();
          // First item should have the highest match score (Ranking check)
          if (res.body.matches.length > 1) {
            expect(res.body.matches[0].score).toBeGreaterThanOrEqual(res.body.matches[1].score);
          }
        });
    });
  });

  describe('Bookmarks & Saved Scholarships', () => {
    it('POST /saved-scholarships - Bookmark scheme (SAVE-001)', async () => {
      if (!testScholarshipId) return;
      await request(app.getHttpServer())
        .post('/api/v1/saved-scholarships')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ scholarshipId: testScholarshipId })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
        });
    });

    it('GET /saved-scholarships - List bookmarks', () => {
      return request(app.getHttpServer())
        .get('/api/v1/saved-scholarships')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toBeDefined();
          expect(res.body.data.length).toBeGreaterThan(0);
        });
    });

    it('DELETE /saved-scholarships/:id - Remove bookmark (SAVE-003)', async () => {
      if (!testScholarshipId) return;
      await request(app.getHttpServer())
        .delete(`/api/v1/saved-scholarships/${testScholarshipId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
        });
    });
  });

  describe('Application Kanban Progress Tracking', () => {
    it('POST /applications - Log status progress (APP-001)', async () => {
      if (!testScholarshipId) return;
      await request(app.getHttpServer())
        .post('/api/v1/applications')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          scholarshipId: testScholarshipId,
          status: 'INTERESTED',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
        });
    });

    it('GET /applications - List applications tracker cards (APP-003)', () => {
      return request(app.getHttpServer())
        .get('/api/v1/applications')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.applications).toBeDefined();
          expect(res.body.applications.length).toBeGreaterThan(0);
          testApplicationId = res.body.applications[0].id;
        });
    });

    it('PATCH /applications/:id - Update status (APP-002)', async () => {
      if (!testApplicationId) return;
      await request(app.getHttpServer())
        .patch(`/api/v1/applications/${testApplicationId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ status: 'APPLIED' })
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
        });
    });
  });

  describe('AI RAG Assistant Module', () => {
    it('POST /ai/chat - Chatbot context retrieval (AI-001 / AI-005)', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/ai/chat')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          message: 'What documents are required for National Merit Scholarship?',
          scholarshipId: testScholarshipId || undefined,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.answer).toBeDefined();
        });
    }, 15000);

    it('POST /ai/explain - Summary explanation (AI-001)', async () => {
      if (!testScholarshipId) return;
      await request(app.getHttpServer())
        .post('/api/v1/ai/explain')
        .send({ scholarshipId: testScholarshipId })
        .expect(201)
        .expect((res) => {
          expect(res.body.summary).toBeDefined();
        });
    }, 15000);
  });

  describe('Role-Based Security Guards', () => {
    it('POST /admin/scholarships - Unauthorized route check (ADMIN-004 / SEC-004)', () => {
      return request(app.getHttpServer())
        .post('/api/v1/admin/scholarships')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: 'Illegal Admin Scholarship',
          provider: 'Hacker',
          amount: 999999,
        })
        .expect(403);
    });
  });
});
