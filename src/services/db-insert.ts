import prisma from '@/lib/prisma';

export async function insertResume(data: Record<string, any>) {
  return prisma.resume.create({ data });
}

export async function insertResumeAnalysis(data: Record<string, any>) {
  return prisma.resumeAnalysis.create({ data });
}

export async function insertSkillGapAnalysis(data: Record<string, any>) {
  return prisma.skillGapAnalysis.create({ data });
}

export async function insertCandidateNote(data: Record<string, any>) {
  return prisma.candidateNote.create({ data });
}

export async function insertFeedback(data: Record<string, any>) {
  return prisma.feedback.create({ data });
}

export async function insertRecruiterMatch(data: Record<string, any>) {
  return prisma.recruiterMatch.create({ data });
}
