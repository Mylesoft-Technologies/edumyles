"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@/hooks/useSSRSafeConvex";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  ArrowLeft, 
  Send,
  AlertTriangle,
  Clock,
  CheckCircle
} from "lucide-react";

const CATEGORIES = [
  { value: "technical", label: "Technical", color: "bg-em-info-bg text-em-info" },
  { value: "billing", label: "Billing", color: "bg-em-warning-bg text-em-accent-dark" },
  { value: "feature", label: "Feature Request", color: "bg-em-success-bg text-em-success" },
  { value: "bug", label: "Bug Report", color: "bg-em-danger-bg text-em-danger" },
  { value: "support", label: "Support", color: "bg-muted-bg text-muted-foreground" },
];

const PRIORITIES = [
  { value: "P1", label: "Critical", color: "bg-em-danger-bg text-em-danger" },
  { value: "P2", label: "High", color: "bg-em-warning-bg text-em-accent-dark" },
  { value: "P3", label: "Medium", color: "bg-em-info-bg text-em-info" },
  { value: "P4", label: "Low", color: "bg-em-success-bg text-em-success" },
];

export default function CreateTicketPage() {
  const { isLoading, sessionToken } = useAuth();
  const router = useRouter();
  const createTicket = useMutation(api.tickets.createTicket);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "technical",
    priority: "P2",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title.trim() || !form.description.trim()) {
      setSubmitError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await createTicket({
        title: form.title,
        body: form.description,
        category: form.category as any,
        priority: form.priority as any,
      });

      // Success - redirect to tickets list
      router.push("/platform/tickets");
    } catch (error) {
      console.error("Failed to create ticket:", error);
      setSubmitError("Failed to create ticket. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setSubmitError(null);
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  }

  const selectedCategory = CATEGORIES.find(c => c.value === form.category);
  const selectedPriority = PRIORITIES.find(p => p.value === form.priority);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <PageHeader
              title="Create Support Ticket"
              description="Create a new support ticket for assistance"
            />
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Ticket Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Brief description of the issue"
                value={form.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="resize-none"
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground">
                Maximum 200 characters
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Detailed description of the issue, steps to reproduce, expected behavior, etc."
                value={form.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="min-h-[120px] resize-none"
                maxLength={2000}
              />
              <p className="text-xs text-muted-foreground">
                Maximum 2000 characters
              </p>
            </div>

            {/* Category and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(value) => handleInputChange("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center space-x-2">
                          <Badge className={category.color} variant="secondary">
                            {category.label}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedCategory && (
                  <p className="text-xs text-muted-foreground">
                    <Badge className={selectedCategory.color} variant="secondary">
                      {selectedCategory.label}
                    </Badge>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={form.priority}
                  onValueChange={(value) => handleInputChange("priority", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        <div className="flex items-center space-x-2">
                          <Badge className={priority.color} variant="secondary">
                            {priority.label}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedPriority && (
                  <p className="text-xs text-muted-foreground">
                    <Badge className={selectedPriority.color} variant="secondary">
                      {selectedPriority.label}
                    </Badge>
                  </p>
                )}
              </div>
            </div>

            {/* Priority Guide */}
            <Card className="bg-muted/30 border-border/50">
              <CardContent className="pt-4">
                <h4 className="font-medium text-sm mb-3">Priority Guidelines</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-em-danger-bg text-em-danger" variant="secondary">P1</Badge>
                    <span>Critical - System down, major functionality broken</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-em-warning-bg text-em-accent-dark" variant="secondary">P2</Badge>
                    <span>High - Important feature not working</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-em-info-bg text-em-info" variant="secondary">P3</Badge>
                    <span>Medium - Minor issues or improvements</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-em-success-bg text-em-success" variant="secondary">P4</Badge>
                    <span>Low - Nice to have features</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Error Message */}
            {submitError && (
              <Card className="border-em-danger bg-em-danger-bg/10">
                <CardContent className="pt-4">
                  <div className="flex items-center space-x-2 text-em-danger">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm">{submitError}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !form.title.trim() || !form.description.trim()}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Create Ticket
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="max-w-2xl mx-auto bg-muted/30 border-border/50">
        <CardContent className="pt-4">
          <div className="flex items-start space-x-3">
            <Clock className="h-5 w-5 text-em-info mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Response Times</h4>
              <p className="text-xs text-muted-foreground">
                Our team typically responds to tickets within:
              </p>
              <div className="space-y-1 text-xs">
                <div className="flex items-center space-x-2">
                  <Badge className="bg-em-danger-bg text-em-danger" variant="secondary">P1</Badge>
                  <span>Within 1 hour</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-em-warning-bg text-em-accent-dark" variant="secondary">P2</Badge>
                  <span>Within 4 hours</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-em-info-bg text-em-info" variant="secondary">P3</Badge>
                  <span>Within 24 hours</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-em-success-bg text-em-success" variant="secondary">P4</Badge>
                  <span>Within 48 hours</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
