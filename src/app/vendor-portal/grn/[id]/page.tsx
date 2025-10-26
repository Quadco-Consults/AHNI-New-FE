'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ArrowLeft, Download, Eye, AlertTriangle, CheckCircle, XCircle, Upload, Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

import { useGRNDetails, useRespondToGRN, POGRNUtils } from '@/features/vendor-portal/controllers/purchaseOrderController';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const GRNResponseSchema = z.object({
  response_type: z.enum(['ACKNOWLEDGE', 'DISPUTE', 'PROVIDE_INFO']),
  response_message: z.string().min(10, 'Response message must be at least 10 characters'),
  dispute_details: z.object({
    disputed_items: z.array(z.string()).optional(),
    dispute_reason: z.string().optional(),
    supporting_documents: z.array(z.any()).optional(),
  }).optional(),
});

type GRNResponseForm = z.infer<typeof GRNResponseSchema>;

export default function GRNDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const grnId = Array.isArray(params?.id) ? params.id[0] : params?.id || '';

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const { data: grn, isLoading, error } = useGRNDetails(grnId);
  const respondToGRNMutation = useRespondToGRN();

  const form = useForm<GRNResponseForm>({
    resolver: zodResolver(GRNResponseSchema),
    defaultValues: {
      response_type: 'ACKNOWLEDGE',
      response_message: '',
      dispute_details: {
        disputed_items: [],
        dispute_reason: '',
        supporting_documents: [],
      },
    },
  });

  const watchResponseType = form.watch('response_type');

  const onSubmit = async (data: GRNResponseForm) => {
    try {
      await respondToGRNMutation.mutateAsync({
        grn_id: grnId,
        response_type: data.response_type,
        response_message: data.response_message,
        dispute_details: data.response_type === 'DISPUTE' ? {
          disputed_items: selectedItems,
          dispute_reason: data.dispute_details?.dispute_reason || '',
          supporting_documents: uploadedFiles,
        } : undefined,
      });

      toast({
        title: 'Response Submitted',
        description: 'Your response to the GRN has been submitted successfully.',
      });

      router.push('/vendor-portal/grn');
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: 'Failed to submit your response. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !grn) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="text-center py-12">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">GRN Not Found</h3>
            <p className="text-gray-600 mb-4">
              The requested Goods Received Note could not be found.
            </p>
            <Button onClick={() => router.push('/vendor-portal/grn')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to GRN List
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const acceptanceRate = POGRNUtils.calculateGRNAcceptanceRate(grn);
  const hasRejectedItems = grn.received_items.some(item => item.quantity_rejected > 0);
  const requiresResponse = ['RECEIVED', 'INSPECTED'].includes(grn.status);

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/vendor-portal/grn')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to GRN List
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{grn.grn_number}</h1>
            <p className="text-gray-600">PO: {grn.po_number}</p>
          </div>
        </div>
        <Badge variant={POGRNUtils.getGRNStatusBadgeVariant(grn.status)}>
          {POGRNUtils.getGRNStatusDisplayName(grn.status)}
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {acceptanceRate}%
            </div>
            <p className="text-sm text-gray-600">Acceptance Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {POGRNUtils.formatCurrency(grn.value_received)}
            </div>
            <p className="text-sm text-gray-600">Value Received</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {POGRNUtils.formatCurrency(grn.value_accepted)}
            </div>
            <p className="text-sm text-gray-600">Value Accepted</p>
          </CardContent>
        </Card>
        {grn.value_rejected > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">
                {POGRNUtils.formatCurrency(grn.value_rejected)}
              </div>
              <p className="text-sm text-gray-600">Value Rejected</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Alert for Action Required */}
      {requiresResponse && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div>
                <h4 className="font-semibold text-orange-800">Response Required</h4>
                <p className="text-sm text-orange-700">
                  This GRN requires your response. Please review the items and provide your acknowledgment or dispute any discrepancies.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="items">Items Received</TabsTrigger>
          <TabsTrigger value="inspection">Inspection Details</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          {requiresResponse && (
            <TabsTrigger value="response">Respond</TabsTrigger>
          )}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>GRN Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">GRN Number:</span>
                    <p className="text-gray-600">{grn.grn_number}</p>
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>
                    <Badge variant={POGRNUtils.getGRNStatusBadgeVariant(grn.status)} className="ml-2">
                      {POGRNUtils.getGRNStatusDisplayName(grn.status)}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Received Date:</span>
                    <p className="text-gray-600">{new Date(grn.received_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="font-medium">Received By:</span>
                    <p className="text-gray-600">{grn.received_by.name}</p>
                    <p className="text-xs text-gray-500">{grn.received_by.department}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{grn.delivery_location.name}</p>
                  <p className="text-sm text-gray-600">{grn.delivery_location.address}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {grn.inspection_date && (
            <Card>
              <CardHeader>
                <CardTitle>Inspection Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Inspection Date:</span>
                    <p className="text-gray-600">{new Date(grn.inspection_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="font-medium">Inspector:</span>
                    <p className="text-gray-600">{grn.inspector_name}</p>
                  </div>
                  {grn.quality_rating && (
                    <div>
                      <span className="font-medium">Quality Rating:</span>
                      <p className="text-gray-600">{grn.quality_rating}/5</p>
                    </div>
                  )}
                </div>
                {grn.inspection_notes && (
                  <div>
                    <span className="font-medium">Inspection Notes:</span>
                    <p className="text-gray-600 mt-1">{grn.inspection_notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Items Tab */}
        <TabsContent value="items" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Items Received</CardTitle>
              <CardDescription>
                Details of all items received and their condition
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {grn.received_items.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{item.item_name}</h4>
                        <p className="text-sm text-gray-600">Code: {item.item_code}</p>
                      </div>
                      <Badge
                        variant={item.condition_on_receipt === 'GOOD' ? 'default' : 'destructive'}
                      >
                        {item.condition_on_receipt}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Ordered:</span>
                        <p className="text-gray-600">{item.quantity_ordered}</p>
                      </div>
                      <div>
                        <span className="font-medium">Received:</span>
                        <p className="text-gray-600">{item.quantity_received}</p>
                      </div>
                      <div>
                        <span className="font-medium">Accepted:</span>
                        <p className="text-green-600">{item.quantity_accepted}</p>
                      </div>
                      {item.quantity_rejected > 0 && (
                        <div>
                          <span className="font-medium">Rejected:</span>
                          <p className="text-red-600">{item.quantity_rejected}</p>
                        </div>
                      )}
                    </div>

                    {item.inspection_notes && (
                      <div>
                        <span className="font-medium text-sm">Inspection Notes:</span>
                        <p className="text-sm text-gray-600 mt-1">{item.inspection_notes}</p>
                      </div>
                    )}

                    {(item.batch_number || item.expiry_date || item.serial_numbers) && (
                      <Separator />
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      {item.batch_number && (
                        <div>
                          <span className="font-medium">Batch Number:</span>
                          <p className="text-gray-600">{item.batch_number}</p>
                        </div>
                      )}
                      {item.expiry_date && (
                        <div>
                          <span className="font-medium">Expiry Date:</span>
                          <p className="text-gray-600">{new Date(item.expiry_date).toLocaleDateString()}</p>
                        </div>
                      )}
                      {item.serial_numbers && item.serial_numbers.length > 0 && (
                        <div>
                          <span className="font-medium">Serial Numbers:</span>
                          <p className="text-gray-600">{item.serial_numbers.join(', ')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inspection Tab */}
        <TabsContent value="inspection" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inspection Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {grn.inspection_date ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <span className="font-medium">Inspection Date:</span>
                        <p className="text-gray-600">{new Date(grn.inspection_date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="font-medium">Inspector:</span>
                        <p className="text-gray-600">{grn.inspector_name}</p>
                      </div>
                      {grn.quality_rating && (
                        <div>
                          <span className="font-medium">Overall Quality Rating:</span>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-lg font-bold">{grn.quality_rating}/5</span>
                            <div className="flex space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <div
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= grn.quality_rating! ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                                >
                                  ★
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <span className="font-medium">Acceptance Rate:</span>
                        <p className="text-gray-600">{acceptanceRate}%</p>
                      </div>
                      {hasRejectedItems && (
                        <>
                          <div>
                            <span className="font-medium">Return Required:</span>
                            <p className="text-gray-600">{grn.return_required ? 'Yes' : 'No'}</p>
                          </div>
                          <div>
                            <span className="font-medium">Replacement Required:</span>
                            <p className="text-gray-600">{grn.replacement_required ? 'Yes' : 'No'}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {grn.inspection_notes && (
                    <div>
                      <span className="font-medium">Inspection Notes:</span>
                      <div className="mt-2 p-3 bg-gray-50 rounded-md">
                        <p className="text-gray-700">{grn.inspection_notes}</p>
                      </div>
                    </div>
                  )}

                  {grn.return_reason && (
                    <div>
                      <span className="font-medium">Return Reason:</span>
                      <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-700">{grn.return_reason}</p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Inspection has not been completed yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Related Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {grn.delivery_note_reference && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Delivery Note</p>
                      <p className="text-sm text-gray-600">{grn.delivery_note_reference}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                )}

                {grn.invoice_reference && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Invoice</p>
                      <p className="text-sm text-gray-600">{grn.invoice_reference}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                )}

                {grn.photos && grn.photos.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">Inspection Photos</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {grn.photos.map((photo, index) => (
                        <div key={index} className="border rounded-lg overflow-hidden">
                          <img
                            src={photo}
                            alt={`Inspection photo ${index + 1}`}
                            className="w-full h-32 object-cover"
                          />
                          <div className="p-2">
                            <Button variant="outline" size="sm" className="w-full">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {grn.certificates && grn.certificates.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">Certificates</h4>
                    <div className="space-y-2">
                      {grn.certificates.map((cert, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Certificate {index + 1}</p>
                            <p className="text-sm text-gray-600">Quality/Compliance Certificate</p>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!grn.delivery_note_reference && !grn.invoice_reference &&
                 (!grn.photos || grn.photos.length === 0) &&
                 (!grn.certificates || grn.certificates.length === 0) && (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No documents available for this GRN.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Response Tab */}
        {requiresResponse && (
          <TabsContent value="response" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Respond to GRN</CardTitle>
                <CardDescription>
                  Acknowledge receipt or dispute any discrepancies in the goods received note.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="response_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Response Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select response type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ACKNOWLEDGE">
                                <div className="flex items-center space-x-2">
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                  <span>Acknowledge - Accept the GRN as accurate</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="DISPUTE">
                                <div className="flex items-center space-x-2">
                                  <XCircle className="h-4 w-4 text-red-600" />
                                  <span>Dispute - Contest certain items or quantities</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="PROVIDE_INFO">
                                <div className="flex items-center space-x-2">
                                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                                  <span>Provide Info - Request clarification or provide additional details</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Item Selection for Disputes */}
                    {watchResponseType === 'DISPUTE' && (
                      <div className="space-y-4">
                        <div>
                          <FormLabel>Select Items to Dispute</FormLabel>
                          <div className="mt-2 space-y-2 max-h-60 overflow-y-auto border rounded-md p-3">
                            {grn.received_items.map((item, index) => (
                              <div key={index} className="flex items-center space-x-3">
                                <Checkbox
                                  checked={selectedItems.includes(item.po_line_item_id)}
                                  onCheckedChange={() => toggleItemSelection(item.po_line_item_id)}
                                />
                                <div className="flex-1">
                                  <p className="font-medium">{item.item_name}</p>
                                  <p className="text-sm text-gray-600">
                                    Ordered: {item.quantity_ordered}, Received: {item.quantity_received}, Accepted: {item.quantity_accepted}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <FormField
                          control={form.control}
                          name="dispute_details.dispute_reason"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Dispute Reason</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Explain the reason for disputing the selected items..."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="space-y-4">
                          <FormLabel>Supporting Documents (Optional)</FormLabel>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600 mb-2">
                              Upload photos, certificates, or other supporting documents
                            </p>
                            <Input
                              type="file"
                              multiple
                              accept="image/*,application/pdf,.doc,.docx"
                              onChange={handleFileUpload}
                              className="max-w-xs mx-auto"
                            />
                          </div>

                          {uploadedFiles.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-sm font-medium">Uploaded Files:</p>
                              {uploadedFiles.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                  <span className="text-sm">{file.name}</span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFile(index)}
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <FormField
                      control={form.control}
                      name="response_message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Response Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={
                                watchResponseType === 'ACKNOWLEDGE'
                                  ? "Acknowledge receipt and acceptance of the goods..."
                                  : watchResponseType === 'DISPUTE'
                                  ? "Provide detailed explanation of your dispute..."
                                  : "Provide additional information or ask for clarification..."
                              }
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/vendor-portal/grn')}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={respondToGRNMutation.isPending}
                      >
                        {respondToGRNMutation.isPending ? (
                          <>
                            <LoadingSpinner className="h-4 w-4 mr-2" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Submit Response
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}