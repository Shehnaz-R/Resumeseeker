-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: resumeseeker
-- ------------------------------------------------------
-- Server version	9.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `appsettings`
--

DROP TABLE IF EXISTS `appsettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appsettings` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `settingKey` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `settingValue` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `settingType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isPublic` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `AppSettings_settingKey_key` (`settingKey`),
  KEY `AppSettings_settingKey_idx` (`settingKey`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appsettings`
--

LOCK TABLES `appsettings` WRITE;
/*!40000 ALTER TABLE `appsettings` DISABLE KEYS */;
/*!40000 ALTER TABLE `appsettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `appusagestats`
--

DROP TABLE IF EXISTS `appusagestats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appusagestats` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `eventType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `eventData` json DEFAULT NULL,
  `userAgent` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ipAddress` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `referrer` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `timestamp` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `sessionId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `AppUsageStats_userId_idx` (`userId`),
  KEY `AppUsageStats_eventType_idx` (`eventType`),
  KEY `AppUsageStats_timestamp_idx` (`timestamp`),
  KEY `AppUsageStats_sessionId_idx` (`sessionId`),
  CONSTRAINT `AppUsageStats_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appusagestats`
--

LOCK TABLES `appusagestats` WRITE;
/*!40000 ALTER TABLE `appusagestats` DISABLE KEYS */;
INSERT INTO `appusagestats` VALUES ('03a26f72-66e4-4e3d-8ea1-9a65b2950804',NULL,'page_view','{\"pageName\": \"feedback_page\"}','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36','::1','http://localhost:9004/feedback','2025-09-21 10:39:13.410','session_1758449302949_tb0tuc28h9'),('0533870d-c8c0-43ba-aacd-bb80d8fdcdad',NULL,'ai_chat_interaction','{\"question\": \"how can i improve my resume\\n\", \"response\": \"I understand you\'re asking about \\\"how can i improve my resume\\n\\\". Due to current API limitations, I can provide general advice: Focus on highlighting your key skills (Analysis temporarily unavailable), quantifying your achievements, and tailoring your resume to the specific role you\'re targeting.\", \"resumeId\": \"63e30940-43b9-48ce-b22a-2293d9531b81\"}','ResumeSeeker AI Chat','127.0.0.1',NULL,'2025-09-21 09:33:50.835',NULL),('1b58f9a8-d7d7-42f1-9dd3-0c15074159c5',NULL,'page_view','{\"pageName\": \"feedback_page\"}','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36','::1','http://localhost:9004/feedback','2025-09-21 10:39:18.972','session_1758449302949_tb0tuc28h9'),('261f19e3-c7c0-480d-8e3f-43ad41130f64',NULL,'ai_chat_interaction','{\"question\": \"how can i improve my resume\\n\", \"response\": \"I understand you\'re asking about \\\"how can i improve my resume\\n\\\". Due to current API limitations, I can provide general advice: Focus on highlighting your key skills (Analysis temporarily unavailable), quantifying your achievements, and tailoring your resume to the specific role you\'re targeting.\", \"resumeId\": \"63e30940-43b9-48ce-b22a-2293d9531b81\"}','ResumeSeeker AI Chat','127.0.0.1',NULL,'2025-09-21 09:33:48.686',NULL),('268911c1-053b-46a0-89d4-0c0a48cf6f1f',NULL,'ai_chat_interaction','{\"question\": \"what about resume how it is\\n\", \"response\": \"Your resume showcases a solid blend of retail experience and creative education, which is great for roles that value customer service, visual merchandising, and design. However, it could be stronger by adding specific achievements, clarifying your responsibilities, and tailoring the format to highlight your most relevant skills for the positions you’re aiming for.\", \"resumeId\": \"e5da1e9a-6f95-4467-8142-7193bbceaa71\"}','ResumeSeeker AI Chat','127.0.0.1',NULL,'2025-09-21 09:50:49.753',NULL),('295d488a-2343-47a9-b169-5dfece1d2431',NULL,'ai_chat_interaction','{\"question\": \"hii\", \"response\": \"Hi! I\'d love to help you improve your resume. Since you didn\'t provide the current version, I can offer some general tips and ask a few questions to better understand your background.\", \"resumeId\": \"0d40400f-388e-4604-8b94-2192e9411390\"}','ResumeSeeker AI Chat','127.0.0.1',NULL,'2025-09-21 10:33:55.208',NULL),('2a86b37c-7f8f-44e3-a9fe-f37eb9c06da5',NULL,'page_view','{\"pageName\": \"feedback_page\"}','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36','::1','http://localhost:9004/feedback','2025-09-21 10:38:33.970','session_1758449302949_tb0tuc28h9'),('30236cc8-b74f-438a-83bd-67a1a28f401a',NULL,'page_view','{\"pageName\": \"feedback_page\"}','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36','::1','http://localhost:9004/feedback','2025-09-21 10:42:59.936','session_1758449302949_tb0tuc28h9'),('36d60766-8751-4167-8422-2c0b8fd14eb6',NULL,'ai_chat_interaction','{\"question\": \"How can i improve the resume\", \"response\": \"Your resume showcases a solid background in retail and customer service, but it can be strengthened by sharpening the presentation, adding measurable accomplishments, and tailoring it to your career goals. Below are concrete steps to help you stand out and make your experience more impactful.\", \"resumeId\": \"5042055b-e2fa-4444-9f38-c3225a27b7c0\"}','ResumeSeeker AI Chat','127.0.0.1',NULL,'2025-09-21 10:04:14.982',NULL),('42b0db3a-abd2-42b3-a62c-355ab2a49cec',NULL,'ai_chat_interaction','{\"question\": \"how can i improve my resume\\n\", \"response\": \"I understand you\'re asking about \\\"how can i improve my resume\\n\\\". Due to current API limitations, I can provide general advice: Focus on highlighting your key skills (Analysis temporarily unavailable), quantifying your achievements, and tailoring your resume to the specific role you\'re targeting.\", \"resumeId\": \"63e30940-43b9-48ce-b22a-2293d9531b81\"}','ResumeSeeker AI Chat','127.0.0.1',NULL,'2025-09-21 09:33:50.351',NULL),('4da6dea2-60a6-404e-885d-ca711d1a0ef8',NULL,'page_view','{\"pageName\": \"feedback_page\"}','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36','::ffff:192.168.1.9','http://192.168.1.9:9004/feedback','2025-09-21 10:26:05.183','session_1758450362442_k5fx3u629j9'),('502fb883-21f5-45f5-b790-8a843d4574ae',NULL,'login','{\"method\": \"email\", \"deviceInfo\": {\"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36\"}}','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36','::1',NULL,'2025-09-21 09:21:31.200',NULL),('5548ded4-c37c-4a58-88a7-ed944d1d7f65',NULL,'ai_chat_interaction','{\"question\": \"what is best in this resume\", \"response\": \"Your resume showcases a solid foundation in retail sales, merchandising, and customer service, backed by a strong academic record in graphic design. The diverse roles demonstrate adaptability, leadership, and a keen eye for trends—valuable assets for many positions. However, to make the resume stand out to hiring managers and applicant‑tracking systems, consider tightening the narrative, quantifying achievements, and aligning your experience with the specific job you’re targeting.\", \"resumeId\": \"5042055b-e2fa-4444-9f38-c3225a27b7c0\"}','ResumeSeeker AI Chat','127.0.0.1',NULL,'2025-09-21 10:03:45.997',NULL),('6ab9e35f-695e-4e1f-ab15-200cfbbac479',NULL,'page_view','{\"pageName\": \"feedback_page\"}','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36','::1','http://localhost:9004/feedback','2025-09-21 10:20:57.128','session_1758449302949_tb0tuc28h9'),('6c2f94ca-c921-47df-8610-924d1bb7d053',NULL,'page_view','{\"pageName\": \"feedback_page\"}','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36','::1','http://localhost:9004/feedback','2025-09-21 10:45:27.120','session_1758449302949_tb0tuc28h9'),('83c8e097-cb9d-43eb-ba42-104567dbc187',NULL,'login','{\"method\": \"email\", \"deviceInfo\": {\"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36\"}}','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36','::1',NULL,'2025-09-21 09:58:01.325',NULL),('85727bb8-0c6f-4da8-8640-c6932b57e453',NULL,'page_view','{\"pageName\": \"feedback_page\"}','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36','::ffff:192.168.1.9','http://192.168.1.9:9004/feedback','2025-09-21 10:26:05.184','session_1758450362442_k5fx3u629j9'),('894d4535-0047-4666-9d25-22a4b43843f3',NULL,'login','{\"method\": \"email\", \"deviceInfo\": {\"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36\"}}','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36','::ffff:192.168.1.9',NULL,'2025-09-21 08:52:32.058',NULL),('8e7f4adb-d7d1-4b64-9be2-d821fed31651',NULL,'page_view','{\"pageName\": \"feedback_page\"}','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36','::1','http://localhost:9004/feedback','2025-09-21 10:39:18.887','session_1758449302949_tb0tuc28h9'),('8f84b296-aea5-4ce0-8065-cf50d5a4a382',NULL,'page_view','{\"pageName\": \"feedback_page\"}','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36','::1','http://localhost:9004/feedback','2025-09-21 10:08:26.653','session_1758449302949_tb0tuc28h9'),('9b1f655c-05d0-4b33-9a51-3e4e57f70cb2',NULL,'page_view','{\"pageName\": \"feedback_page\"}','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36','::1','http://localhost:9004/feedback','2025-09-21 10:39:13.439','session_1758449302949_tb0tuc28h9'),('a60b301c-baac-4c43-a924-a6cdda6d0208',NULL,'ai_chat_interaction','{\"question\": \"how can i improve my resume\\n\", \"response\": \"I understand you\'re asking about \\\"how can i improve my resume\\n\\\". Due to current API limitations, I can provide general advice: Focus on highlighting your key skills (Analysis temporarily unavailable), quantifying your achievements, and tailoring your resume to the specific role you\'re targeting.\", \"resumeId\": \"63e30940-43b9-48ce-b22a-2293d9531b81\"}','ResumeSeeker AI Chat','127.0.0.1',NULL,'2025-09-21 09:33:51.062',NULL),('b2093c2b-614f-4940-be28-47def2821611',NULL,'ai_chat_interaction','{\"question\": \"heelo\", \"response\": \"I understand you\'re asking about \\\"heelo\\\". Due to current API limitations, I can provide general advice: Focus on highlighting your key skills (Analysis temporarily unavailable), quantifying your achievements, and tailoring your resume to the specific role you\'re targeting.\", \"resumeId\": \"63e30940-43b9-48ce-b22a-2293d9531b81\"}','ResumeSeeker AI Chat','127.0.0.1',NULL,'2025-09-21 09:33:31.132',NULL),('b31f7a4b-93f9-41c5-bf6b-842db57aaa78',NULL,'page_view','{\"pageName\": \"feedback_page\"}','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36','::1','http://localhost:9004/feedback','2025-09-21 10:45:27.118','session_1758449302949_tb0tuc28h9'),('b9f9b712-75a1-422d-a43b-158304f201f9',NULL,'page_view','{\"pageName\": \"feedback_page\"}','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36','::1','http://localhost:9004/feedback','2025-09-21 10:42:53.560','session_1758449302949_tb0tuc28h9'),('bc0599b3-2f2c-4698-ba23-90cd548ab1f4',NULL,'ai_chat_interaction','{\"question\": \"how can i improve my resume\\n\", \"response\": \"I understand you\'re asking about \\\"how can i improve my resume\\n\\\". Due to current API limitations, I can provide general advice: Focus on highlighting your key skills (Analysis temporarily unavailable), quantifying your achievements, and tailoring your resume to the specific role you\'re targeting.\", \"resumeId\": \"63e30940-43b9-48ce-b22a-2293d9531b81\"}','ResumeSeeker AI Chat','127.0.0.1',NULL,'2025-09-21 09:33:50.621',NULL),('cc5a9d38-f258-4427-b525-b97a2e43a7a7',NULL,'ai_chat_interaction','{\"question\": \"how can i improve my resume\\n\", \"response\": \"I understand you\'re asking about \\\"how can i improve my resume\\n\\\". Due to current API limitations, I can provide general advice: Focus on highlighting your key skills (Analysis temporarily unavailable), quantifying your achievements, and tailoring your resume to the specific role you\'re targeting.\", \"resumeId\": \"63e30940-43b9-48ce-b22a-2293d9531b81\"}','ResumeSeeker AI Chat','127.0.0.1',NULL,'2025-09-21 09:33:49.877',NULL),('f35c216e-3472-4eab-b3cc-398a033623e3',NULL,'ai_chat_interaction','{\"question\": \"hello\", \"response\": \"Hello! It’s great to see you’re looking to polish your resume. I’ve taken a look at your experience and skills and can suggest a few ways to make it even stronger.\", \"resumeId\": \"e5da1e9a-6f95-4467-8142-7193bbceaa71\"}','ResumeSeeker AI Chat','127.0.0.1',NULL,'2025-09-21 09:49:52.638',NULL),('f380f4e9-0efd-42f5-8bff-3d8a6ff8f524',NULL,'login','{\"method\": \"email\", \"deviceInfo\": {\"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36\"}}','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36','::1',NULL,'2025-09-21 08:59:33.187',NULL),('f91693f7-dd2f-4330-93d2-0389ee87772d',NULL,'page_view','{\"pageName\": \"feedback_page\"}','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36','::1','http://localhost:9004/feedback','2025-09-21 10:08:26.653','session_1758449302949_tb0tuc28h9'),('fa416f32-7f3e-4b52-8a74-1bf183476614',NULL,'page_view','{\"pageName\": \"feedback_page\"}','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36','::1','http://localhost:9004/feedback','2025-09-21 10:38:33.970','session_1758449302949_tb0tuc28h9');
/*!40000 ALTER TABLE `appusagestats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `candidate`
--

DROP TABLE IF EXISTS `candidate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidate` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Candidate_userId_idx` (`userId`),
  CONSTRAINT `Candidate_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidate`
--

LOCK TABLES `candidate` WRITE;
/*!40000 ALTER TABLE `candidate` DISABLE KEYS */;
/*!40000 ALTER TABLE `candidate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `candidatejobmatch`
--

DROP TABLE IF EXISTS `candidatejobmatch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidatejobmatch` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `score` int NOT NULL,
  `assessment` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `keyMatches` json DEFAULT NULL,
  `keyMismatches` json DEFAULT NULL,
  `feedback` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `resumeId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `candidateId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jobPostingId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `CandidateJobMatch_resumeId_idx` (`resumeId`),
  KEY `CandidateJobMatch_candidateId_idx` (`candidateId`),
  KEY `CandidateJobMatch_jobPostingId_idx` (`jobPostingId`),
  CONSTRAINT `CandidateJobMatch_candidateId_fkey` FOREIGN KEY (`candidateId`) REFERENCES `candidate` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `CandidateJobMatch_jobPostingId_fkey` FOREIGN KEY (`jobPostingId`) REFERENCES `jobposting` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `CandidateJobMatch_resumeId_fkey` FOREIGN KEY (`resumeId`) REFERENCES `candidateresume` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidatejobmatch`
--

LOCK TABLES `candidatejobmatch` WRITE;
/*!40000 ALTER TABLE `candidatejobmatch` DISABLE KEYS */;
/*!40000 ALTER TABLE `candidatejobmatch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `candidatenote`
--

DROP TABLE IF EXISTS `candidatenote`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidatenote` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `candidateId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `CandidateNote_candidateId_idx` (`candidateId`),
  CONSTRAINT `CandidateNote_candidateId_fkey` FOREIGN KEY (`candidateId`) REFERENCES `candidate` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidatenote`
--

LOCK TABLES `candidatenote` WRITE;
/*!40000 ALTER TABLE `candidatenote` DISABLE KEYS */;
/*!40000 ALTER TABLE `candidatenote` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `candidateresume`
--

DROP TABLE IF EXISTS `candidateresume`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidateresume` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fileName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fileType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fileSize` int NOT NULL,
  `fileUrl` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci,
  `parsedData` json DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `candidateId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `CandidateResume_candidateId_idx` (`candidateId`),
  CONSTRAINT `CandidateResume_candidateId_fkey` FOREIGN KEY (`candidateId`) REFERENCES `candidate` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidateresume`
--

LOCK TABLES `candidateresume` WRITE;
/*!40000 ALTER TABLE `candidateresume` DISABLE KEYS */;
/*!40000 ALTER TABLE `candidateresume` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `candidateresumeanalysis`
--

DROP TABLE IF EXISTS `candidateresumeanalysis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidateresumeanalysis` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `skills` json DEFAULT NULL,
  `experience` json DEFAULT NULL,
  `education` json DEFAULT NULL,
  `summary` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `resumeId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `CandidateResumeAnalysis_resumeId_key` (`resumeId`),
  CONSTRAINT `CandidateResumeAnalysis_resumeId_fkey` FOREIGN KEY (`resumeId`) REFERENCES `candidateresume` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidateresumeanalysis`
--

LOCK TABLES `candidateresumeanalysis` WRITE;
/*!40000 ALTER TABLE `candidateresumeanalysis` DISABLE KEYS */;
/*!40000 ALTER TABLE `candidateresumeanalysis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `candidatetag`
--

DROP TABLE IF EXISTS `candidatetag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidatetag` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `color` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `candidateId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `CandidateTag_candidateId_name_key` (`candidateId`,`name`),
  KEY `CandidateTag_candidateId_idx` (`candidateId`),
  CONSTRAINT `CandidateTag_candidateId_fkey` FOREIGN KEY (`candidateId`) REFERENCES `candidate` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidatetag`
--

LOCK TABLES `candidatetag` WRITE;
/*!40000 ALTER TABLE `candidatetag` DISABLE KEYS */;
/*!40000 ALTER TABLE `candidatetag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `feedbackType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` int DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `adminResponse` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Feedback_userId_idx` (`userId`),
  KEY `Feedback_feedbackType_idx` (`feedbackType`),
  KEY `Feedback_status_idx` (`status`),
  CONSTRAINT `Feedback_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobapplication`
--

DROP TABLE IF EXISTS `jobapplication`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobapplication` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `resumeId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jobMatchId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `jobTitle` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `applicationDate` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `nextSteps` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `interviewDate` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `JobApplication_userId_idx` (`userId`),
  KEY `JobApplication_resumeId_idx` (`resumeId`),
  KEY `JobApplication_jobMatchId_idx` (`jobMatchId`),
  CONSTRAINT `JobApplication_jobMatchId_fkey` FOREIGN KEY (`jobMatchId`) REFERENCES `jobmatch` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `JobApplication_resumeId_fkey` FOREIGN KEY (`resumeId`) REFERENCES `resume` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `JobApplication_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobapplication`
--

LOCK TABLES `jobapplication` WRITE;
/*!40000 ALTER TABLE `jobapplication` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobapplication` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobmatch`
--

DROP TABLE IF EXISTS `jobmatch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobmatch` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `resumeId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jobData` json NOT NULL,
  `matchScore` int DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `JobMatch_resumeId_idx` (`resumeId`),
  CONSTRAINT `JobMatch_resumeId_fkey` FOREIGN KEY (`resumeId`) REFERENCES `resume` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobmatch`
--

LOCK TABLES `jobmatch` WRITE;
/*!40000 ALTER TABLE `jobmatch` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobmatch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobposting`
--

DROP TABLE IF EXISTS `jobposting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobposting` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `company` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `JobPosting_userId_idx` (`userId`),
  CONSTRAINT `JobPosting_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobposting`
--

LOCK TABLES `jobposting` WRITE;
/*!40000 ALTER TABLE `jobposting` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobposting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `linkedaccount`
--

DROP TABLE IF EXISTS `linkedaccount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `linkedaccount` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `providerUserId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `accessToken` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `refreshToken` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expiresAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `LinkedAccount_provider_providerUserId_key` (`provider`,`providerUserId`),
  KEY `LinkedAccount_userId_idx` (`userId`),
  CONSTRAINT `LinkedAccount_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `linkedaccount`
--

LOCK TABLES `linkedaccount` WRITE;
/*!40000 ALTER TABLE `linkedaccount` DISABLE KEYS */;
/*!40000 ALTER TABLE `linkedaccount` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `passwordreset`
--

DROP TABLE IF EXISTS `passwordreset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `passwordreset` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiresAt` datetime(3) NOT NULL,
  `used` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `PasswordReset_token_key` (`token`),
  KEY `PasswordReset_userId_idx` (`userId`),
  KEY `PasswordReset_token_idx` (`token`),
  CONSTRAINT `PasswordReset_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `passwordreset`
--

LOCK TABLES `passwordreset` WRITE;
/*!40000 ALTER TABLE `passwordreset` DISABLE KEYS */;
/*!40000 ALTER TABLE `passwordreset` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recruitermatch`
--

DROP TABLE IF EXISTS `recruitermatch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recruitermatch` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `recruiterId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jobTitle` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jobDescription` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `jobRequirements` json NOT NULL,
  `jobLocation` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `candidateName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `candidateEmail` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `resumeText` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `resumeFile` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `matchScore` int NOT NULL,
  `skillMatch` json NOT NULL,
  `experienceMatch` json NOT NULL,
  `educationMatch` json NOT NULL,
  `strengths` json NOT NULL,
  `weaknesses` json NOT NULL,
  `recommendations` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'new',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `RecruiterMatch_recruiterId_idx` (`recruiterId`),
  KEY `RecruiterMatch_jobTitle_idx` (`jobTitle`),
  KEY `RecruiterMatch_candidateName_idx` (`candidateName`),
  KEY `RecruiterMatch_matchScore_idx` (`matchScore`),
  KEY `RecruiterMatch_status_idx` (`status`),
  CONSTRAINT `RecruiterMatch_recruiterId_fkey` FOREIGN KEY (`recruiterId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recruitermatch`
--

LOCK TABLES `recruitermatch` WRITE;
/*!40000 ALTER TABLE `recruitermatch` DISABLE KEYS */;
/*!40000 ALTER TABLE `recruitermatch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resume`
--

DROP TABLE IF EXISTS `resume`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resume` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longblob NOT NULL,
  `fileType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `optionSelected` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `anonymizedVersion` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sentimentScore` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Resume_userId_idx` (`userId`),
  CONSTRAINT `Resume_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resume`
--

LOCK TABLES `resume` WRITE;
/*!40000 ALTER TABLE `resume` DISABLE KEYS */;
/*!40000 ALTER TABLE `resume` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resumeanalysis`
--

DROP TABLE IF EXISTS `resumeanalysis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resumeanalysis` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `resumeId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `extractedData` json NOT NULL,
  `skills` json NOT NULL,
  `experience` json NOT NULL,
  `education` json NOT NULL,
  `missingElements` json NOT NULL,
  `improvementSuggestions` json DEFAULT NULL,
  `atsScore` int DEFAULT NULL,
  `atsIssues` json DEFAULT NULL,
  `jobRecommendations` json DEFAULT NULL,
  `careerPathOptions` json DEFAULT NULL,
  `skillGaps` json DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ResumeAnalysis_userId_resumeId_key` (`userId`,`resumeId`),
  KEY `ResumeAnalysis_userId_idx` (`userId`),
  KEY `ResumeAnalysis_resumeId_idx` (`resumeId`),
  CONSTRAINT `ResumeAnalysis_resumeId_fkey` FOREIGN KEY (`resumeId`) REFERENCES `resume` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ResumeAnalysis_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resumeanalysis`
--

LOCK TABLES `resumeanalysis` WRITE;
/*!40000 ALTER TABLE `resumeanalysis` DISABLE KEYS */;
/*!40000 ALTER TABLE `resumeanalysis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resumetemplate`
--

DROP TABLE IF EXISTS `resumetemplate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resumetemplate` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `previewImageUrl` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isDefault` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ResumeTemplate_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resumetemplate`
--

LOCK TABLES `resumetemplate` WRITE;
/*!40000 ALTER TABLE `resumetemplate` DISABLE KEYS */;
/*!40000 ALTER TABLE `resumetemplate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `skilldevelopment`
--

DROP TABLE IF EXISTS `skilldevelopment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `skilldevelopment` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `skill` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `courses` json NOT NULL,
  `progress` int NOT NULL,
  `startDate` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `targetDate` datetime(3) DEFAULT NULL,
  `completed` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `SkillDevelopment_userId_idx` (`userId`),
  CONSTRAINT `SkillDevelopment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skilldevelopment`
--

LOCK TABLES `skilldevelopment` WRITE;
/*!40000 ALTER TABLE `skilldevelopment` DISABLE KEYS */;
/*!40000 ALTER TABLE `skilldevelopment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `skillgapanalysis`
--

DROP TABLE IF EXISTS `skillgapanalysis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `skillgapanalysis` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `resumeId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jobDescription` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `requiredSkills` json NOT NULL,
  `missingSkills` json NOT NULL,
  `recommendations` json NOT NULL,
  `matchPercentage` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `SkillGapAnalysis_resumeId_idx` (`resumeId`),
  CONSTRAINT `SkillGapAnalysis_resumeId_fkey` FOREIGN KEY (`resumeId`) REFERENCES `resume` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skillgapanalysis`
--

LOCK TABLES `skillgapanalysis` WRITE;
/*!40000 ALTER TABLE `skillgapanalysis` DISABLE KEYS */;
/*!40000 ALTER TABLE `skillgapanalysis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userpreferences`
--

DROP TABLE IF EXISTS `userpreferences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userpreferences` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `privacySettings` json NOT NULL,
  `jobAlertFrequency` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `desiredLocations` json DEFAULT NULL,
  `remotePreference` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `salaryExpectations` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UserPreferences_userId_key` (`userId`),
  CONSTRAINT `UserPreferences_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userpreferences`
--

LOCK TABLES `userpreferences` WRITE;
/*!40000 ALTER TABLE `userpreferences` DISABLE KEYS */;
/*!40000 ALTER TABLE `userpreferences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usersignupdata`
--

DROP TABLE IF EXISTS `usersignupdata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usersignupdata` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `signupDate` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `referralSource` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `initialPlan` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `jobTitle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `industry` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `yearsOfExperience` int DEFAULT NULL,
  `educationLevel` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `skills` json NOT NULL,
  `jobSearchStatus` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `preferredJobTypes` json NOT NULL,
  `preferredLocations` json NOT NULL,
  `remotePreference` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deviceInfo` json DEFAULT NULL,
  `completedProfile` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UserSignupData_userId_key` (`userId`),
  KEY `UserSignupData_jobTitle_idx` (`jobTitle`),
  KEY `UserSignupData_industry_idx` (`industry`),
  KEY `UserSignupData_location_idx` (`location`),
  CONSTRAINT `UserSignupData_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usersignupdata`
--

LOCK TABLES `usersignupdata` WRITE;
/*!40000 ALTER TABLE `usersignupdata` DISABLE KEYS */;
/*!40000 ALTER TABLE `usersignupdata` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-21 16:40:38
