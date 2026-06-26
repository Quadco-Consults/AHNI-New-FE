"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  useGetBankAccounts,
  useGetBankStatements,
  useImportBankStatementTransactions,
} from "@/features/finance/controllers/bankReconciliationController";

interface UploadStatementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UploadStatementDialog({
  open,
  onOpenChange,
}: UploadStatementDialogProps) {
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [selectedStatement, setSelectedStatement] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [importResults, setImportResults] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch bank accounts
  const { data: accountsData, isLoading: accountsLoading } =
    useGetBankAccounts();
  const accounts = accountsData?.data || [];

  // Fetch bank statements for selected account
  const { data: statementsData, isLoading: statementsLoading } =
    useGetBankStatements(
      selectedAccount ? { bank_account_id: selectedAccount } : undefined
    );
  const statements = statementsData?.data || [];

  // Import transactions mutation
  const {
    importTransactions,
    isLoading: importing,
    isSuccess: importSuccess,
    error: importError,
    data: importData,
  } = useImportBankStatementTransactions();

  const handleFileSelect = (file: File) => {
    // Validate file type
    const allowedExtensions = [".csv", ".xlsx", ".xls"];
    const fileName = file.name.toLowerCase();
    const isValidType = allowedExtensions.some((ext) =>
      fileName.endsWith(ext)
    );

    if (!isValidType) {
      toast.error(
        "Invalid file type. Please upload a CSV or Excel file (.csv, .xlsx, .xls)"
      );
      return;
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error("File is too large. Maximum size is 10MB");
      return;
    }

    setSelectedFile(file);
    toast.success(`Selected: ${file.name}`);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedStatement) {
      toast.error("Please select a bank statement");
      return;
    }

    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    try {
      await importTransactions(selectedStatement, selectedFile);

      // Show results
      if (importData?.data) {
        setImportResults(importData.data);
        toast.success(`Successfully imported ${importData.data.total_transactions} transactions`);
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to import transactions");
    }
  };

  const handleClose = () => {
    setSelectedAccount("");
    setSelectedStatement("");
    setSelectedFile(null);
    setImportResults(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Bank Statement</DialogTitle>
          <DialogDescription>
            Import transactions from your bank statement (CSV or Excel format)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step 1: Select Account */}
          <div className="space-y-2">
            <Label htmlFor="account">1. Select Bank Account *</Label>
            <Select value={selectedAccount} onValueChange={setSelectedAccount}>
              <SelectTrigger>
                <SelectValue placeholder="Select bank account" />
              </SelectTrigger>
              <SelectContent>
                {accountsLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading accounts...
                  </SelectItem>
                ) : accounts.length === 0 ? (
                  <SelectItem value="empty" disabled>
                    No accounts found
                  </SelectItem>
                ) : (
                  accounts.map((account: any) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.account_name} - {account.bank_name} (
                      {account.account_number})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Step 2: Select Statement */}
          {selectedAccount && (
            <div className="space-y-2">
              <Label htmlFor="statement">
                2. Select Bank Statement Period *
              </Label>
              <Select
                value={selectedStatement}
                onValueChange={setSelectedStatement}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select statement period" />
                </SelectTrigger>
                <SelectContent>
                  {statementsLoading ? (
                    <SelectItem value="loading" disabled>
                      Loading statements...
                    </SelectItem>
                  ) : statements.length === 0 ? (
                    <SelectItem value="empty" disabled>
                      No statements found for this account
                    </SelectItem>
                  ) : (
                    statements.map((statement: any) => (
                      <SelectItem key={statement.id} value={statement.id}>
                        {statement.statement_date} ({statement.statement_period_start}{" "}
                        to {statement.statement_period_end})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                If you don't see your statement period, create a new statement first
              </p>
            </div>
          )}

          {/* Step 3: Upload File */}
          {selectedStatement && (
            <div className="space-y-2">
              <Label>3. Upload Bank Statement File *</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-gray-300"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileInputChange}
                />

                {selectedFile ? (
                  <div className="space-y-2">
                    <FileSpreadsheet className="h-12 w-12 mx-auto text-green-600" />
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Change File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-12 w-12 mx-auto text-gray-400" />
                    <p className="text-sm text-muted-foreground">
                      Drag and drop your bank statement file here, or
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Browse Files
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Supported formats: CSV, Excel (.xlsx, .xls) - Max 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Import Results */}
          {importResults && (
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-semibold">Import Results</h4>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {importResults.total_transactions}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Total Imported
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <CheckCircle2 className="h-6 w-6 mx-auto text-green-600 mb-1" />
                      <div className="text-2xl font-bold text-green-600">
                        {importResults.auto_matched}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Auto-matched
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <AlertCircle className="h-6 w-6 mx-auto text-yellow-600 mb-1" />
                      <div className="text-2xl font-bold text-yellow-600">
                        {importResults.suggested_matches}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Suggested
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <XCircle className="h-6 w-6 mx-auto text-red-600 mb-1" />
                      <div className="text-2xl font-bold text-red-600">
                        {importResults.unmatched}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Unmatched
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {importResults.metadata && (
                <div className="text-sm">
                  <p className="font-medium mb-1">Statement Metadata:</p>
                  <div className="space-y-1 text-muted-foreground">
                    {importResults.metadata.bank_name && (
                      <p>Bank: {importResults.metadata.bank_name}</p>
                    )}
                    {importResults.metadata.account_number && (
                      <p>Account: {importResults.metadata.account_number}</p>
                    )}
                    {importResults.metadata.period && (
                      <p>Period: {importResults.metadata.period}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {importResults ? "Close" : "Cancel"}
          </Button>
          {!importResults && (
            <Button
              onClick={handleUpload}
              disabled={!selectedStatement || !selectedFile || importing}
            >
              {importing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {importing ? "Importing..." : "Upload & Import"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
