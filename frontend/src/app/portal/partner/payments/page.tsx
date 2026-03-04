"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function PartnerPaymentsPage() {
  const { isLoading } = useAuth();
  const data = useQuery(api.modules.portal.partner.queries.getPartnerPayments, {});

  if (isLoading || data === undefined) {
    return <LoadingSkeleton variant="page" />;
  }

  const { payments, upcomingDues } = data;

  return (
    <div>
      <PageHeader
        title="Payments"
        description="Payment history and upcoming dues for sponsored students"
      />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment history</CardTitle>
          </CardHeader>
          <CardContent>
            {!payments?.length ? (
              <p className="text-sm text-muted-foreground">No payment records yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.slice(0, 50).map((p: any) => (
                    <TableRow key={p._id}>
                      <TableCell>{new Date(p.processedAt).toLocaleDateString()}</TableCell>
                      <TableCell>KES {(p.amount ?? 0).toLocaleString()}</TableCell>
                      <TableCell>{p.method}</TableCell>
                      <TableCell>{p.reference}</TableCell>
                      <TableCell>{p.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming dues</CardTitle>
          </CardHeader>
          <CardContent>
            {!upcomingDues?.length ? (
              <p className="text-sm text-muted-foreground">No upcoming dues.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Due date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingDues.map((inv: any) => (
                    <TableRow key={inv._id}>
                      <TableCell>{inv.dueDate}</TableCell>
                      <TableCell>KES {(inv.amount ?? 0).toLocaleString()}</TableCell>
                      <TableCell>{inv.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
