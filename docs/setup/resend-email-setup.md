# Resend Email Integration Setup Guide

This guide walks you through setting up Resend email service for the EduMyles school management system.

## Overview

Resend is a modern email API service that provides reliable transactional email delivery with excellent developer experience. EduMyles integrates Resend for sending various types of emails including fee reminders, exam results, attendance alerts, and more.

## Prerequisites

- A Resend account (sign up at [resend.com](https://resend.com))
- Verified domain in Resend
- EduMyles application access

## Step 1: Create Resend Account

1. Sign up at [resend.com](https://resend.com)
2. Verify your email address
3. Complete the onboarding process

## Step 2: Verify Your Domain

1. Go to the Resend dashboard
2. Navigate to **Domains** section
3. Click **Add Domain**
4. Enter your school's domain (e.g., `edumyles.com`)
5. Add the required DNS records to your domain's DNS settings
6. Wait for domain verification (usually takes a few minutes to a few hours)

### DNS Records Required

You'll need to add these DNS records to your domain:

```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none

Type: TXT
Name: @
Value: v=spf1 include:spf.resend.com ~all

Type: CNAME
Name: resend
Value: return.resend.com
```

## Step 3: Generate API Keys

1. In Resend dashboard, go to **API Keys**
2. Click **Create API Key**
3. Give your API key a descriptive name (e.g., "EduMyles Production")
4. Copy the API key (starts with `re_`)
5. Store it securely - you won't be able to see it again

## Step 4: Configure Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
# Resend Email Configuration
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=noreply@edumyles.com
RESEND_FROM_NAME=EduMyles
```

### Environment Variable Details

- `RESEND_API_KEY`: Your Resend API key (required)
- `RESEND_FROM_EMAIL`: The email address emails are sent from (must be from your verified domain)
- `RESEND_FROM_NAME`: The display name for the sender

## Step 5: Test Email Configuration

### Using the Email Composer

1. Navigate to the admin panel: `/admin/communications/email`
2. Use the Email Composer to send a test email
3. Check both custom emails and template emails

### API Testing

You can test the email API directly:

```bash
curl -X POST http://localhost:3000/api/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "html": "<h1>Hello World</h1><p>This is a test email from EduMyles.</p>"
  }'
```

## Available Email Templates

EduMyles comes with pre-built email templates:

### 1. Fee Reminder (`fee_reminder`)
**Use Case:** Notify parents about upcoming fee payments
**Required Data:**
- `amount`: Fee amount in KES
- `dueDate`: Payment due date
- `studentName`: Student's full name
- `parentName`: Parent's full name
- `term`: Academic term

### 2. Exam Results (`exam_results`)
**Use Case:** Notify parents when exam results are available
**Required Data:**
- `term`: Academic term
- `year`: Academic year
- `studentName`: Student's full name
- `totalMarks`: Total marks obtained
- `grade`: Grade achieved
- `position`: Optional class position

### 3. Attendance Alert (`attendance_alert`)
**Use Case:** Alert parents about student absences
**Required Data:**
- `studentName`: Student's full name
- `date`: Date of absence
- `subjects`: List of subjects missed
- `reason`: Optional reason for absence

### 4. Payslip (`payslip`)
**Use Case:** Send staff payslip notifications
**Required Data:**
- `period`: Pay period
- `basicSalary`: Basic salary amount
- `allowances`: Total allowances
- `deductions`: Total deductions
- `netPay`: Net pay amount
- `employeeName`: Employee's full name

### 5. Welcome Email (`welcome_email`)
**Use Case:** Welcome new users to the system
**Required Data:**
- `name`: Recipient's name
- `role`: User's role (Teacher, Admin, etc.)
- `schoolName`: School name
- `loginUrl`: Login page URL

### 6. Password Reset (`password_reset`)
**Use Case:** Send password reset links
**Required Data:**
- `name`: User's name
- `resetUrl`: Password reset URL
- `expiryHours`: Link expiry time in hours

### 7. General Notification (`general_notification`)
**Use Case:** Send custom notifications
**Required Data:**
- `title`: Notification title
- `message`: Notification message
- `actionUrl`: Optional action button URL
- `actionText`: Optional action button text

## Step 6: Integration with Convex Backend

The Resend integration works with both:

### Frontend API Route
- Location: `/src/app/api/email/send/route.ts`
- Handles immediate email sending
- Good for user-triggered emails

### Convex Action
- Location: `/convex/actions/communications/email.ts`
- Handles server-side email sending
- Better for automated emails and background jobs
- Includes audit logging

## Step 7: Monitoring and Analytics

### Email Delivery Tracking

Resend provides built-in analytics:

1. Go to your Resend dashboard
2. Navigate to **Logs** to see email delivery status
3. Check **Analytics** for delivery rates, open rates, etc.

### Common Issues and Solutions

#### Domain Not Verified
- **Error:** `Domain not verified`
- **Solution:** Complete domain verification in Resend dashboard

#### Invalid From Address
- **Error:** `From address is not verified`
- **Solution:** Use an email from your verified domain

#### Rate Limiting
- **Error:** `Rate limit exceeded`
- **Solution:** Implement email sending delays or upgrade your plan

#### DNS Issues
- **Error:** `DNS validation failed`
- **Solution:** Check and fix DNS records for SPF/DKIM/DMARC

## Step 8: Production Deployment

### Vercel Environment Variables

Add these to your Vercel project environment:

1. Go to Vercel dashboard
2. Select your EduMyles project
3. Go to **Settings → Environment Variables**
4. Add the Resend environment variables
5. Redeploy your application

### Security Best Practices

1. **Never commit API keys to version control**
2. **Use different API keys for development and production**
3. **Regularly rotate API keys**
4. **Monitor email usage and costs**
5. **Implement rate limiting for email sending**

## Step 9: Advanced Configuration

### Custom Email Templates

You can create custom email templates by:

1. Adding new template types to `EmailTemplate` interface
2. Implementing the template HTML in the `EmailService` class
3. Adding template fields to the EmailComposer component

### Email Attachments

The email service supports attachments:

```typescript
const result = await emailService.sendEmail({
  to: 'recipient@example.com',
  subject: 'Document Attached',
  html: '<p>Please find the attached document.</p>',
  attachments: [{
    filename: 'document.pdf',
    content: pdfBuffer,
    contentType: 'application/pdf'
  }]
});
```

### Bulk Email Sending

For sending emails to multiple recipients:

```typescript
const recipients = ['parent1@example.com', 'parent2@example.com'];
const result = await emailService.sendEmail({
  to: recipients,
  subject: 'School Announcement',
  html: '<p>Important school announcement...</p>'
});
```

## Troubleshooting

### Common Error Messages

| Error | Cause | Solution |
|-------|--------|----------|
| `API key invalid` | Wrong API key | Check environment variables |
| `Domain not verified` | Domain not set up | Complete domain verification |
| `From address invalid` | Wrong from email | Use verified domain email |
| `Rate limit exceeded` | Too many emails | Implement rate limiting |

### Debug Mode

Enable debug logging by setting:

```bash
LOG_LEVEL=debug
```

This will provide detailed logs for email sending operations.

## Support

For additional help:

1. Check the [Resend Documentation](https://resend.com/docs)
2. Review EduMyles email service code in `/src/lib/email.ts`
3. Check the Convex email action in `/convex/actions/communications/email.ts`
4. Contact EduMyles support for platform-specific issues

## Next Steps

Once Resend is configured:

1. Test all email templates
2. Set up automated email workflows
3. Configure email preferences in user settings
4. Monitor email delivery metrics
5. Set up email analytics and reporting

Your EduMyles system is now ready to send professional, reliable emails to your school community!
