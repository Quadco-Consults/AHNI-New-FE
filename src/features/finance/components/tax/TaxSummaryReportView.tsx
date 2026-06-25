"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useGetTaxSummaryReport } from "../../controllers/taxController";
import { TaxSummaryQuery, TAX_CATEGORIES } from "../../types/tax.types";
import { FileText, TrendingUp, DollarSign, Calendar } from "lucide-react";

const reportFiltersSchema = z.object({
  period_from: z.string().min(1, "Start date is required"),
  period_to: z.string().min(1, "End date is required"),
  tax_category: z.enum(["WHT", "VAT", "PAYE", "ALL"], {
    required_error: "Tax category is required",
  }),
}).refine(
  (data) => {
    const from = new Date(data.period_from);
    const to = new Date(data.period_to);
    return from <= to;
  },
  {
    message: "End date must be after or equal to start date",
    path: ["period_to"],
  }
);

type FormValues = z.infer<typeof reportFiltersSchema>;

export default function TaxSummaryReportView() {
  const [reportQuery, setReportQuery] = useState<TaxSummaryQuery | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(reportFiltersSchema),
    defaultValues: {
      period_from: "",
      period_to: "",
      tax_category: "ALL",
    },
  });

  const { data: reportData, isLoading, refetch } = useGetTaxSummaryReport(
    reportQuery || undefined
  );

  const onSubmit = (data: FormValues) => {
    setReportQuery({
      period_from: data.period_from,
      period_to: data.period_to,
      tax_category: data.tax_category === "ALL" ? undefined : data.tax_category,
    });
  };

  const report = reportData?.data;

  return (
    <div className="space-y-6">
      {/* Filter Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Report Parameters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="period_from"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Period From *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="period_to"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Period To *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tax_category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Category *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ALL">All Tax Categories</SelectItem>
                          {TAX_CATEGORIES.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Generating..." : "Generate Report"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Report Results */}
      {report && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-blue-200 bg-blue-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  Total Withheld
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600">
                  ₦{Number(report.grand_totals.total_withheld).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {report.grand_totals.count} withholdings
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  Total Remitted
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  ₦{Number(report.grand_totals.total_remitted).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Successfully remitted
                </p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4 text-orange-600" />
                  Pending Remittance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-orange-600">
                  ₦{Number(report.grand_totals.total_pending).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Awaiting remittance
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tax Summary by Type</CardTitle>
              <p className="text-sm text-muted-foreground">
                Period: {new Date(report.period.from).toLocaleDateString()} -{" "}
                {new Date(report.period.to).toLocaleDateString()}
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tax Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead className="text-right">Count</TableHead>
                    <TableHead className="text-right">Total Withheld</TableHead>
                    <TableHead className="text-right">Remitted</TableHead>
                    <TableHead className="text-right">Pending</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.summary_by_type.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        No tax data found for the selected period
                      </TableCell>
                    </TableRow>
                  ) : (
                    report.summary_by_type.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {item.tax_type_name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {TAX_CATEGORIES.find(c => c.value === item.tax_category)?.label || item.tax_category}
                          </Badge>
                        </TableCell>
                        <TableCell>{Number(item.tax_rate).toFixed(2)}%</TableCell>
                        <TableCell className="text-right">{item.count}</TableCell>
                        <TableCell className="text-right font-medium">
                          ₦{Number(item.total_withheld).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-green-600">
                          ₦{Number(item.total_remitted).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-orange-600">
                          ₦{Number(item.total_pending).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3} className="font-bold">
                      Grand Total
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {report.grand_totals.count}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      ₦{Number(report.grand_totals.total_withheld).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-bold text-green-600">
                      ₦{Number(report.grand_totals.total_remitted).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-bold text-orange-600">
                      ₦{Number(report.grand_totals.total_pending).toLocaleString()}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      {!report && !isLoading && (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-muted-foreground">
              Select a period and category above to generate a tax summary report
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
