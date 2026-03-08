import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email';
import { z } from 'zod';

// Request schema for sending emails
const sendEmailSchema = z.object({
  to: z.union([z.string(), z.array(z.string())]),
  subject: z.string(),
  html: z.string().optional(),
  text: z.string().optional(),
  from: z.string().optional(),
  replyTo: z.string().optional(),
});

// Request schema for templated emails
const sendTemplatedEmailSchema = z.object({
  to: z.string(),
  template: z.enum([
    'fee_reminder',
    'exam_results', 
    'attendance_alert',
    'payslip',
    'welcome_email',
    'password_reset',
    'general_notification'
  ]),
  data: z.record(z.any()),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if this is a templated email or custom email
    if (body.template) {
      // Validate templated email request
      const { to, template, data } = sendTemplatedEmailSchema.parse(body);
      
      // Send templated email
      const result = await emailService.sendTemplatedEmail(
        to,
        template,
        data as any
      );
      
      if (!result.success) {
        return NextResponse.json(
          { error: 'Failed to send email', details: result.error },
          { status: 500 }
        );
      }
      
      return NextResponse.json({
        success: true,
        message: 'Email sent successfully',
        data: result.data
      });
      
    } else {
      // Validate custom email request
      const emailData = sendEmailSchema.parse(body);
      
      // Send custom email
      const result = await emailService.sendEmail({
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text,
        from: emailData.from,
        replyTo: emailData.replyTo,
      });
      
      if (!result.success) {
        return NextResponse.json(
          { error: 'Failed to send email', details: result.error },
          { status: 500 }
        );
      }
      
      return NextResponse.json({
        success: true,
        message: 'Email sent successfully',
        data: result.data
      });
    }
    
  } catch (error) {
    console.error('Email API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
