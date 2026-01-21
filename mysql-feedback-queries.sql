-- MySQL Queries for Feedback Table
-- Use these queries in any MySQL client (MySQL Workbench, phpMyAdmin, etc.)

-- 1. View all feedback
SELECT * FROM Feedback ORDER BY createdAt DESC;

-- 2. View feedback with user information (if available)
SELECT 
    f.id,
    f.feedbackType,
    f.content,
    f.rating,
    f.status,
    f.createdAt,
    u.name as userName,
    u.email as userEmail
FROM Feedback f
LEFT JOIN User u ON f.userId = u.id
ORDER BY f.createdAt DESC;

-- 3. Count feedback by type
SELECT 
    feedbackType,
    COUNT(*) as count
FROM Feedback 
GROUP BY feedbackType;

-- 4. Count feedback by status
SELECT 
    status,
    COUNT(*) as count
FROM Feedback 
GROUP BY status;

-- 5. Average rating
SELECT 
    AVG(rating) as averageRating,
    COUNT(rating) as totalRatings
FROM Feedback 
WHERE rating IS NOT NULL;

-- 6. Recent feedback (last 7 days)
SELECT * FROM Feedback 
WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY createdAt DESC;

-- 7. Update feedback status (admin use)
-- UPDATE Feedback SET status = 'reviewed' WHERE id = 'your-feedback-id';

-- 8. Add admin response (admin use)
-- UPDATE Feedback SET adminResponse = 'Thank you for your feedback!' WHERE id = 'your-feedback-id';
