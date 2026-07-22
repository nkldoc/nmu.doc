USE [EIS_ERP];
GO

-- Reset password for a known user.
-- New password: Admin@1234
-- Change @username_or_email before running this script.

DECLARE @username_or_email NVARCHAR(255) = N'admin';

UPDATE [dbo].[users]
SET [password_hash] = N'$2a$10$Mz6fVOvYVKktHSoCX4FpC.LCgesoN6Sc7AlIsD29vT3QdZmeRe6cC',
    [active] = 1,
    [locked] = 0,
    [login_fail_count] = 0,
    [updated_date] = GETDATE()
WHERE LOWER([username]) = LOWER(@username_or_email)
   OR LOWER([email]) = LOWER(@username_or_email);

SELECT [user_id],
       [username],
       [email],
       [full_name],
       [active],
       [locked],
       [login_fail_count],
       [updated_date]
FROM [dbo].[users]
WHERE LOWER([username]) = LOWER(@username_or_email)
   OR LOWER([email]) = LOWER(@username_or_email);
