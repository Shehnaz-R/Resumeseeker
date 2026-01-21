const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Setting up PostgreSQL database tables...');

    try {
        // Create User table
        await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" VARCHAR(191) NOT NULL,
        "email" VARCHAR(191) NOT NULL,
        "name" VARCHAR(191),
        "password" VARCHAR(191),
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        PRIMARY KEY ("id"),
        UNIQUE ("email")
      );
    `;

        // Create Resume table
        await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Resume" (
        "id" VARCHAR(191) NOT NULL,
        "userId" VARCHAR(191) NOT NULL,
        "title" VARCHAR(191) NOT NULL,
        "content" JSONB NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "anonymizedVersion" VARCHAR(191),
        "sentimentScore" DOUBLE PRECISION,
        PRIMARY KEY ("id")
      );
    `;

        // Create JobMatch table
        await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "JobMatch" (
        "id" VARCHAR(191) NOT NULL,
        "resumeId" VARCHAR(191) NOT NULL,
        "jobData" JSONB NOT NULL,
        "matchScore" INTEGER,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("id")
      );
    `;

        // Create SkillGapAnalysis table
        await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "SkillGapAnalysis" (
        "id" VARCHAR(191) NOT NULL,
        "resumeId" VARCHAR(191) NOT NULL,
        "jobDescription" TEXT NOT NULL,
        "requiredSkills" JSONB NOT NULL,
        "missingSkills" JSONB NOT NULL,
        "recommendations" JSONB NOT NULL,
        "matchPercentage" INTEGER NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("id")
      );
    `;

        // Create JobApplication table
        await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "JobApplication" (
        "id" VARCHAR(191) NOT NULL,
        "userId" VARCHAR(191) NOT NULL,
        "resumeId" VARCHAR(191) NOT NULL,
        "jobMatchId" VARCHAR(191),
        "jobTitle" VARCHAR(191) NOT NULL,
        "company" VARCHAR(191) NOT NULL,
        "applicationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "status" VARCHAR(191) NOT NULL,
        "notes" TEXT,
        "nextSteps" VARCHAR(191),
        "interviewDate" TIMESTAMP(3),
        PRIMARY KEY ("id")
      );
    `;

        // Create SkillDevelopment table
        await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "SkillDevelopment" (
        "id" VARCHAR(191) NOT NULL,
        "userId" VARCHAR(191) NOT NULL,
        "skill" VARCHAR(191) NOT NULL,
        "courses" JSONB NOT NULL,
        "progress" INTEGER NOT NULL,
        "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "targetDate" TIMESTAMP(3),
        "completed" BOOLEAN NOT NULL DEFAULT false,
        PRIMARY KEY ("id")
      );
    `;

        // Create UserPreferences table
        await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "UserPreferences" (
        "id" VARCHAR(191) NOT NULL,
        "userId" VARCHAR(191) NOT NULL,
        "privacySettings" JSONB NOT NULL,
        "jobAlertFrequency" VARCHAR(191),
        "desiredLocations" JSONB,
        "remotePreference" VARCHAR(191),
        "salaryExpectations" JSONB,
        UNIQUE ("userId"),
        PRIMARY KEY ("id")
      );
    `;

        // Create LinkedAccount table
        await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "LinkedAccount" (
        "id" VARCHAR(191) NOT NULL,
        "userId" VARCHAR(191) NOT NULL,
        "provider" VARCHAR(191) NOT NULL,
        "providerUserId" VARCHAR(191) NOT NULL,
        "accessToken" VARCHAR(191),
        "refreshToken" VARCHAR(191),
        "expiresAt" TIMESTAMP(3),
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        UNIQUE ("provider", "providerUserId"),
        PRIMARY KEY ("id")
      );
    `;

        // Create PasswordReset table
        await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "PasswordReset" (
        "id" VARCHAR(191) NOT NULL,
        "userId" VARCHAR(191) NOT NULL,
        "token" VARCHAR(191) NOT NULL,
        "expiresAt" TIMESTAMP(3) NOT NULL,
        "used" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE ("token"),
        PRIMARY KEY ("id")
      );
    `;

        // Create Candidate table
        await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Candidate" (
        "id" VARCHAR(191) NOT NULL,
        "name" VARCHAR(191) NOT NULL,
        "email" VARCHAR(191),
        "phone" VARCHAR(191),
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "userId" VARCHAR(191) NOT NULL,
        PRIMARY KEY ("id")
      );
    `;

        // Create CandidateResume table
        await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "CandidateResume" (
        "id" VARCHAR(191) NOT NULL,
        "title" VARCHAR(191) NOT NULL,
        "fileName" VARCHAR(191) NOT NULL,
        "fileType" VARCHAR(191) NOT NULL,
        "fileSize" INTEGER NOT NULL,
        "fileUrl" VARCHAR(191) NOT NULL,
        "content" TEXT,
        "parsedData" JSONB,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "candidateId" VARCHAR(191) NOT NULL,
        PRIMARY KEY ("id")
      );
    `;

        // Create CandidateResumeAnalysis table
        await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "CandidateResumeAnalysis" (
        "id" VARCHAR(191) NOT NULL,
        "skills" JSONB,
        "experience" JSONB,
        "education" JSONB,
        "summary" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "resumeId" VARCHAR(191) NOT NULL,
        UNIQUE ("resumeId"),
        PRIMARY KEY ("id")
      );
    `;

        // Create JobPosting table
        await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "JobPosting" (
        "id" VARCHAR(191) NOT NULL,
        "title" VARCHAR(191) NOT NULL,
        "description" TEXT NOT NULL,
        "company" VARCHAR(191),
        "location" VARCHAR(191),
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "userId" VARCHAR(191) NOT NULL,
        PRIMARY KEY ("id")
      );
    `;

        // Create CandidateJobMatch table
        await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "CandidateJobMatch" (
        "id" VARCHAR(191) NOT NULL,
        "score" INTEGER NOT NULL,
        "assessment" VARCHAR(191),
        "keyMatches" JSONB,
        "keyMismatches" JSONB,
        "feedback" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "resumeId" VARCHAR(191) NOT NULL,
        "candidateId" VARCHAR(191) NOT NULL,
        "jobPostingId" VARCHAR(191) NOT NULL,
        PRIMARY KEY ("id")
      );
    `;

        // Create CandidateTag table
        await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "CandidateTag" (
        "id" VARCHAR(191) NOT NULL,
        "name" VARCHAR(191) NOT NULL,
        "color" VARCHAR(191),
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "candidateId" VARCHAR(191) NOT NULL,
        UNIQUE ("candidateId", "name"),
        PRIMARY KEY ("id")
      );
    `;

        // Create CandidateNote table
        await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "CandidateNote" (
        "id" VARCHAR(191) NOT NULL,
        "content" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "candidateId" VARCHAR(191) NOT NULL,
        PRIMARY KEY ("id")
      );
    `;

        // Create indexes
        await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "Resume_userId_idx" ON "Resume"("userId");`;
        await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "JobMatch_resumeId_idx" ON "JobMatch"("resumeId");`;
        await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "SkillGapAnalysis_resumeId_idx" ON "SkillGapAnalysis"("resumeId");`;
        await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "JobApplication_userId_idx" ON "JobApplication"("userId");`;
        await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "JobApplication_resumeId_idx" ON "JobApplication"("resumeId");`;
        await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "JobApplication_jobMatchId_idx" ON "JobApplication"("jobMatchId");`;
        await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "SkillDevelopment_userId_idx" ON "SkillDevelopment"("userId");`;
        await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "LinkedAccount_userId_idx" ON "LinkedAccount"("userId");`;
        await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "PasswordReset_userId_idx" ON "PasswordReset"("userId");`;
        await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "PasswordReset_token_idx" ON "PasswordReset"("token");`;
        await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "Candidate_userId_idx" ON "Candidate"("userId");`;
        await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "CandidateResume_candidateId_idx" ON "CandidateResume"("candidateId");`;
        await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "JobPosting_userId_idx" ON "JobPosting"("userId");`;
        await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "CandidateJobMatch_resumeId_idx" ON "CandidateJobMatch"("resumeId");`;
        await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "CandidateJobMatch_candidateId_idx" ON "CandidateJobMatch"("candidateId");`;
        await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "CandidateJobMatch_jobPostingId_idx" ON "CandidateJobMatch"("jobPostingId");`;
        await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "CandidateTag_candidateId_idx" ON "CandidateTag"("candidateId");`;
        await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "CandidateNote_candidateId_idx" ON "CandidateNote"("candidateId");`;

        // Add foreign key constraints
        await prisma.$executeRaw`
      ALTER TABLE "Resume" ADD CONSTRAINT "Resume_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `;

        await prisma.$executeRaw`
      ALTER TABLE "JobMatch" ADD CONSTRAINT "JobMatch_resumeId_fkey"
      FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `;

        await prisma.$executeRaw`
      ALTER TABLE "SkillGapAnalysis" ADD CONSTRAINT "SkillGapAnalysis_resumeId_fkey"
      FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `;

        await prisma.$executeRaw`
      ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `;

        await prisma.$executeRaw`
      ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_resumeId_fkey"
      FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `;

        await prisma.$executeRaw`
      ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_jobMatchId_fkey"
      FOREIGN KEY ("jobMatchId") REFERENCES "JobMatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    `;

        await prisma.$executeRaw`
      ALTER TABLE "SkillDevelopment" ADD CONSTRAINT "SkillDevelopment_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `;

        await prisma.$executeRaw`
      ALTER TABLE "UserPreferences" ADD CONSTRAINT "UserPreferences_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `;

        await prisma.$executeRaw`
      ALTER TABLE "LinkedAccount" ADD CONSTRAINT "LinkedAccount_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `;

        await prisma.$executeRaw`
      ALTER TABLE "PasswordReset" ADD CONSTRAINT "PasswordReset_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `;

        await prisma.$executeRaw`
      ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `;

        await prisma.$executeRaw`
      ALTER TABLE "CandidateResume" ADD CONSTRAINT "CandidateResume_candidateId_fkey"
      FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `;

        await prisma.$executeRaw`
      ALTER TABLE "CandidateResumeAnalysis" ADD CONSTRAINT "CandidateResumeAnalysis_resumeId_fkey"
      FOREIGN KEY ("resumeId") REFERENCES "CandidateResume"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `;

        await prisma.$executeRaw`
      ALTER TABLE "JobPosting" ADD CONSTRAINT "JobPosting_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `;

        await prisma.$executeRaw`
      ALTER TABLE "CandidateJobMatch" ADD CONSTRAINT "CandidateJobMatch_resumeId_fkey"
      FOREIGN KEY ("resumeId") REFERENCES "CandidateResume"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `;

        await prisma.$executeRaw`
      ALTER TABLE "CandidateJobMatch" ADD CONSTRAINT "CandidateJobMatch_candidateId_fkey"
      FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `;

        await prisma.$executeRaw`
      ALTER TABLE "CandidateJobMatch" ADD CONSTRAINT "CandidateJobMatch_jobPostingId_fkey"
      FOREIGN KEY ("jobPostingId") REFERENCES "JobPosting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `;

        await prisma.$executeRaw`
      ALTER TABLE "CandidateTag" ADD CONSTRAINT "CandidateTag_candidateId_fkey"
      FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `;

        await prisma.$executeRaw`
      ALTER TABLE "CandidateNote" ADD CONSTRAINT "CandidateNote_candidateId_fkey"
      FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `;

        console.log('PostgreSQL database tables created successfully');
    } catch (error) {
        console.error('Error setting up PostgreSQL database tables:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
