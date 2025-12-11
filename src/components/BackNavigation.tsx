"use client";

import RoundBack from "assets/svgs/RoundBack";
import { FC } from "react";
import { useRouter, usePathname } from "next/navigation";

type PagepProps = {
  extraText?: string;
  customBackPath?: string;
};

const BackNavigation: FC<PagepProps> = ({ extraText, customBackPath }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleBackClick = () => {
    // If custom back path is provided, use it
    if (customBackPath) {
      router.push(customBackPath);
      return;
    }

    // Smart back navigation based on current path
    const pathSegments = pathname.split('/').filter(Boolean);

    // Debug logging
    console.log("🔍 BackNavigation Debug:", {
      currentPath: pathname,
      pathSegments,
      hasSubmission: pathSegments.includes('submission'),
      hasAssessment: pathSegments.includes('assessment'),
      hasAwards: pathSegments.includes('awards'),
      hasSubGrant: pathSegments.includes('sub-grant')
    });

    // Handle assessment pages: go back to submission details
    if (pathSegments.includes('assessment') && pathSegments.includes('submission')) {
      // Remove assessment and assessmentId segments to go back to submission
      const submissionIndex = pathSegments.indexOf('submission');
      const backPath = '/' + pathSegments.slice(0, submissionIndex + 2).join('/');
      console.log("🎯 Assessment back navigation:", {
        submissionIndex,
        backPath,
        pathSegmentsSlice: pathSegments.slice(0, submissionIndex + 2)
      });
      router.push(backPath);
      return;
    }

    // Handle award-selection pages: go back to submission details
    if (pathSegments.includes('award-selection') && pathSegments.includes('submission')) {
      // Remove award-selection and submissionId segments
      const submissionIndex = pathSegments.indexOf('submission');
      if (submissionIndex >= 0 && submissionIndex + 1 < pathSegments.length) {
        // Go back to submission details page
        const backPath = '/' + pathSegments.slice(0, submissionIndex + 2).join('/');
        router.push(backPath);
        return;
      }
    }

    // Handle submission details pages: go back to submissions list
    if (pathSegments.includes('submission') && pathSegments.includes('awards') && pathSegments.includes('sub-grant')) {
      // URL pattern: /dashboard/c-and-g/sub-grant/awards/submission/{id}
      // Should go back to: /dashboard/c-and-g/sub-grant/awards/submission
      const submissionIndex = pathSegments.indexOf('submission');

      // Check if we're at submission details level (submission/{id} with no deeper paths)
      if (submissionIndex >= 0 && submissionIndex === pathSegments.length - 2) {
        // Go back to the submissions list (up to 'submission' level, without the ID)
        const backPath = '/' + pathSegments.slice(0, submissionIndex + 1).join('/');
        console.log("🎯 Submission back navigation:", {
          submissionIndex,
          pathLength: pathSegments.length,
          condition: submissionIndex === pathSegments.length - 2,
          backPath,
          pathSegmentsSlice: pathSegments.slice(0, submissionIndex + 1)
        });
        router.push(backPath);
        return;
      }
    }

    // Handle sub-grant details nested pages: go back to sub-grant details
    if (pathSegments.includes('sub-grant') && pathSegments.includes('awards')) {
      const subGrantIndex = pathSegments.indexOf('sub-grant');
      const awardsIndex = pathSegments.indexOf('awards');

      // If we're deeper than awards/{id}, go back to awards/{id}
      if (awardsIndex >= 0 && awardsIndex + 2 < pathSegments.length) {
        const backPath = '/' + pathSegments.slice(0, awardsIndex + 2).join('/');
        router.push(backPath);
        return;
      }
    }

    // Default fallback: try browser back, but with error handling
    try {
      router.back();
    } catch (error) {
      // If back fails, navigate to a safe fallback
      router.push('/dashboard/c-and-g/sub-grant');
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <div onClick={handleBackClick} className="cursor-pointer">
        <RoundBack />
      </div>
      {extraText && <h4 className="text-xl font-bold">{extraText}</h4>}
    </div>
  );
};

export default BackNavigation;
