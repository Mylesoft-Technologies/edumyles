// ============================================================
// EduMyles — Linear Webhook Handler
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Linear webhook event types
interface LinearWebhookEvent {
  action: string;
  created_at: string;
  data: {
    id: string;
    type: string;
    [key: string]: any;
  };
  url: string;
  webhookId: string;
}

// Verify Linear webhook signature
function verifyWebhookSignature(body: string, signature: string, secret: string): boolean {
  if (!secret) {
    console.warn("Linear webhook secret not configured");
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body, "utf8")
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature, "hex"),
    Buffer.from(expectedSignature, "hex")
  );
}

// Handle different Linear webhook events
async function handleWebhookEvent(event: LinearWebhookEvent): Promise<void> {
  const { action, data } = event;

  switch (action) {
    case "create":
      await handleIssueCreated(data);
      break;
    case "update":
      await handleIssueUpdated(data);
      break;
    case "remove":
      await handleIssueRemoved(data);
      break;
    case "create_comment":
      await handleCommentCreated(data);
      break;
    case "update_comment":
      await handleCommentUpdated(data);
      break;
    default:
      console.log(`Unhandled Linear webhook action: ${action}`);
  }
}

// Handle issue creation
async function handleIssueCreated(issueData: any): Promise<void> {
  console.log("Linear issue created:", issueData);
  
  // Here you can:
  // 1. Send notifications to relevant users
  // 2. Create corresponding tasks in other systems
  // 3. Update internal dashboards
  // 4. Log to audit trail
  
  // Example: Send notification to project team
  // await sendNotification({
  //   type: "linear_issue_created",
  //   data: {
  //     issueId: issueData.id,
  //     title: issueData.title,
  //     assigneeId: issueData.assignee?.id,
  //     teamId: issueData.team?.id,
  //   }
  // });
}

// Handle issue updates
async function handleIssueUpdated(issueData: any): Promise<void> {
  console.log("Linear issue updated:", issueData);
  
  // Here you can:
  // 1. Send status change notifications
  // 2. Update project timelines
  // 3. Sync with other project management tools
  // 4. Update analytics
}

// Handle issue removal
async function handleIssueRemoved(issueData: any): Promise<void> {
  console.log("Linear issue removed:", issueData);
  
  // Here you can:
  // 1. Clean up related data
  // 2. Archive related notifications
  // 3. Update project statistics
}

// Handle comment creation
async function handleCommentCreated(commentData: any): Promise<void> {
  console.log("Linear comment created:", commentData);
  
  // Here you can:
  // 1. Send mention notifications
  // 2. Update activity feeds
  // 3. Trigger automated workflows
}

// Handle comment updates
async function handleCommentUpdated(commentData: any): Promise<void> {
  console.log("Linear comment updated:", commentData);
}

// Main webhook handler
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.text();
    const signature = request.headers.get("linear-signature") || "";
    const webhookSecret = process.env.LINEAR_WEBHOOK_SECRET;

    // Verify webhook signature
    if (!webhookSecret || !verifyWebhookSignature(body, signature, webhookSecret)) {
      console.error("Invalid Linear webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Parse webhook event
    const event: LinearWebhookEvent = JSON.parse(body);
    
    // Process the event
    await handleWebhookEvent(event);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing Linear webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Handle webhook verification (GET request for Linear setup)
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: "Linear webhook endpoint is active",
    timestamp: new Date().toISOString(),
  });
}
