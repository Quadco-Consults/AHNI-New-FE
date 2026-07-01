/**
 * Smart PR Selector Components
 * Shows filtered PRs for each procurement workflow
 */

"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  useRFQEligiblePRs,
  useServiceOrderEligiblePRs,
  usePaymentRequestEligiblePRs,
  type RFQEligiblePR,
  type ServiceOrderEligiblePR,
  type PaymentRequestEligiblePR,
} from "@/hooks/usePRFiltering";
import { CheckCircle2, Package, FileText, Users } from "lucide-react";

/**
 * RFQ Eligible PR Selector
 * Shows only PRs with physical goods
 */
export function RFQEligiblePRSelector({
  onSelectPR,
}: {
  onSelectPR: (pr: RFQEligiblePR) => void;
}) {
  const { data, isLoading, error } = useRFQEligiblePRs();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load RFQ-eligible PRs. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  if (!data || data.count === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <Package className="mx-auto h-12 w-12 opacity-50 mb-3" />
            <p>No PRs with physical goods available for RFQ creation.</p>
            <p className="text-sm mt-2">
              Only PRs with equipment, supplies, or materials appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Select Purchase Request</h3>
          <p className="text-sm text-muted-foreground">
            Showing {data.count} PRs with physical goods needing quotations
          </p>
        </div>
        <Badge variant="outline" className="gap-1">
          <Package className="h-3 w-3" />
          Physical Goods Only
        </Badge>
      </div>

      <div className="grid gap-4">
        {data.prs.map((pr) => (
          <Card key={pr.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{pr.ref_number}</CardTitle>
                  <CardDescription>
                    {pr.items_count} items • Total: ₦
                    {parseFloat(pr.total_cost).toLocaleString()}
                  </CardDescription>
                </div>
                <Button onClick={() => onSelectPR(pr)} size="sm">
                  Create RFQ
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm font-medium">Items:</p>
                <ul className="space-y-1">
                  {pr.items.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>
                        {item.name} (Qty: {item.quantity}) - ₦
                        {parseFloat(item.amount).toLocaleString()}
                      </span>
                    </li>
                  ))}
                  {pr.items.length > 3 && (
                    <li className="text-sm text-muted-foreground italic">
                      + {pr.items.length - 3} more items
                    </li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/**
 * Service Order Eligible PR Selector
 * Shows only PRs with recurring services
 */
export function ServiceOrderEligiblePRSelector({
  onSelectPR,
}: {
  onSelectPR: (pr: ServiceOrderEligiblePR) => void;
}) {
  const { data, isLoading, error } = useServiceOrderEligiblePRs();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load Service Order-eligible PRs. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  if (!data || data.count === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <FileText className="mx-auto h-12 w-12 opacity-50 mb-3" />
            <p>No PRs with recurring services available.</p>
            <p className="text-sm mt-2">
              Only PRs with tickets, data, feeding, etc. appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Select Purchase Request</h3>
          <p className="text-sm text-muted-foreground">
            Showing {data.count} PRs with recurring services
          </p>
        </div>
        <Badge variant="outline" className="gap-1">
          <FileText className="h-3 w-3" />
          Recurring Services
        </Badge>
      </div>

      <div className="grid gap-4">
        {data.prs.map((pr) => (
          <Card key={pr.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{pr.ref_number}</CardTitle>
                  <CardDescription>
                    {pr.items_count} services • Total: ₦
                    {parseFloat(pr.total_cost).toLocaleString()}
                  </CardDescription>
                </div>
                <Button onClick={() => onSelectPR(pr)} size="sm">
                  Create Service Order
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm font-medium">Services:</p>
                <ul className="space-y-1">
                  {pr.items.map((item, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>
                        {item.name} - ₦{parseFloat(item.amount).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/**
 * Payment Request Eligible PR Selector
 * Shows only PRs with personnel costs, categorized by type
 */
export function PaymentRequestEligiblePRSelector({
  onSelectPR,
}: {
  onSelectPR: (pr: PaymentRequestEligiblePR, category: string) => void;
}) {
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);

  const { data, isLoading, error } = usePaymentRequestEligiblePRs(
    "Approved",
    activeCategory as any
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load Payment Request-eligible PRs. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  const categories = [
    { value: undefined, label: "All", icon: Users },
    { value: "CONSULTANT", label: "Consultants", icon: Users },
    { value: "ADHOC", label: "Adhoc Staff", icon: Users },
    { value: "FACILITATOR", label: "Facilitators", icon: Users },
    { value: "OTHER", label: "Other", icon: Users },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-3">Select Payment Request</h3>

        <Tabs
          value={activeCategory || "all"}
          onValueChange={(v) => setActiveCategory(v === "all" ? undefined : v)}
        >
          <TabsList className="grid w-full grid-cols-5">
            {categories.map((cat) => (
              <TabsTrigger key={cat.value || "all"} value={cat.value || "all"}>
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {!data || data.count === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <Users className="mx-auto h-12 w-12 opacity-50 mb-3" />
              <p>No personnel payment PRs available in this category.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Showing {data.count} PRs {activeCategory && `in ${activeCategory} category`}
          </p>

          <div className="grid gap-4">
            {data.prs.map((pr) => (
              <Card key={pr.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{pr.ref_number}</CardTitle>
                      <CardDescription>
                        {activeCategory ? (
                          <>
                            {pr.items_count} items • Category: {pr.payment_category}
                          </>
                        ) : (
                          <>
                            {pr.total_items} total items • Multiple categories
                          </>
                        )}
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => onSelectPR(pr, pr.payment_category || "OTHER")}
                      size="sm"
                    >
                      Create Payment Request
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {activeCategory ? (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Items:</p>
                      <ul className="space-y-1">
                        {pr.items?.map((item, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <span>
                              {item.name} - ₦{parseFloat(item.amount).toLocaleString()}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {pr.categories && (
                        <>
                          <div>
                            <span className="font-medium">Consultants:</span> {pr.categories.consultant}
                          </div>
                          <div>
                            <span className="font-medium">Adhoc:</span> {pr.categories.adhoc}
                          </div>
                          <div>
                            <span className="font-medium">Facilitators:</span> {pr.categories.facilitator}
                          </div>
                          <div>
                            <span className="font-medium">Other:</span> {pr.categories.other}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
