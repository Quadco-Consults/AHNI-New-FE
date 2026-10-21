"use client";

import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateAptitudeTest } from "@/features/hr/controllers/aptitudeTestController";
import { CreateAptitudeTestForm } from "@/features/hr/types";

interface CreateTestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  advertisementId: string;
}

const CreateTestDialog = ({
  open,
  onOpenChange,
  advertisementId,
}: CreateTestDialogProps) => {
  const createTest = useCreateAptitudeTest();

  const form = useForm<CreateAptitudeTestForm>({
    defaultValues: {
      advertisement: advertisementId,
      title: "",
      description: "",
      duration_minutes: 60,
      passing_score: 70,
      total_marks: 100,
    },
  });

  const onSubmit = async (data: CreateAptitudeTestForm) => {
    await createTest.mutateAsync(data);
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Aptitude Test</DialogTitle>
          <DialogDescription>
            Create a new aptitude test for this job advertisement. You can add questions after creating the test.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Test Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Test Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Technical Assessment for Software Developer"
              {...form.register("title", { required: true })}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of what this test assesses..."
              rows={3}
              {...form.register("description")}
            />
          </div>

          {/* Duration */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration_minutes">Duration (minutes) *</Label>
              <Input
                id="duration_minutes"
                type="number"
                min="1"
                {...form.register("duration_minutes", {
                  required: true,
                  valueAsNumber: true,
                })}
              />
            </div>

            {/* Passing Score */}
            <div className="space-y-2">
              <Label htmlFor="passing_score">Passing Score (%) *</Label>
              <Input
                id="passing_score"
                type="number"
                min="0"
                max="100"
                {...form.register("passing_score", {
                  required: true,
                  valueAsNumber: true,
                })}
              />
            </div>

            {/* Total Marks */}
            <div className="space-y-2">
              <Label htmlFor="total_marks">Total Marks *</Label>
              <Input
                id="total_marks"
                type="number"
                min="1"
                {...form.register("total_marks", {
                  required: true,
                  valueAsNumber: true,
                })}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                form.reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createTest.isPending}>
              {createTest.isPending ? "Creating..." : "Create Test"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTestDialog;
