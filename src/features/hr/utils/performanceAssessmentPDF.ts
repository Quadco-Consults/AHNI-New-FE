import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PDFData {
  assessment: any;
  evaluatorRatings?: any[];
}

// Helper function to convert image to base64
const getImageAsBase64 = (imagePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;

      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const base64 = canvas.toDataURL('image/png');
        resolve(base64);
      } else {
        reject('Could not get canvas context');
      }
    };
    img.onerror = reject;
    img.src = imagePath;
  });
};

export const generatePerformanceAssessmentPDF = async (data: PDFData) => {
  try {
    const { assessment, evaluatorRatings = [] } = data;

    // Debug PDF input data
    console.log("📄 PDF Generation Input:");
    console.log("  - Assessment:", assessment);
    console.log("  - Evaluator Ratings:", evaluatorRatings);
    console.log("  - Goals:", assessment?.employee_goals || assessment?.goals);

    const doc = new jsPDF();

  // Helper function to add the AHNI logo and header
  const addHeader = async (doc: jsPDF, yPosition: number) => {
    // AHNI Logo (left side)
    try {
      // Try to load and add the actual AHNI logo
      const logoBase64 = await getImageAsBase64('/imgs/logo.png');
      doc.addImage(logoBase64, 'PNG', 14, yPosition, 35, 12);
    } catch (error) {
      console.warn('Could not load logo image, using text placeholder:', error);
      // Fallback to text logo
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('AHNI', 14, yPosition + 5);
      doc.setFontSize(6);
      doc.setFont('helvetica', 'normal');
      doc.text('ACHIEVING HEALTH NIGERIA INITIATIVE', 14, yPosition + 10);

      // Logo placeholder box
      doc.setDrawColor(200, 200, 200);
      doc.rect(14, yPosition, 35, 12);
    }

    // Title (center)
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Performance Evaluation', 105, yPosition + 5, { align: 'center' });

    // Subtitle
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('INTRODUCTORY PERFORMANCE ASSESSMENT', 105, yPosition + 15, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('To be completed within the first 90 days of employment', 105, yPosition + 22, { align: 'center' });

    // Date (right side)
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const currentDate = new Date().toLocaleDateString();
    doc.text(`Generated: ${currentDate}`, 190, yPosition + 5, { align: 'right' });

    return yPosition + 30;
  };

  let yPos = 20;
  yPos = await addHeader(doc, yPos);

  // Appraisal Information Section
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Appraisal Information', 14, yPos);
  yPos += 7;

  // Build reviews table based on goals and evaluator ratings
  const goals = assessment.employee_goals || assessment.goals || [];
  const evaluators = assessment.evaluators || [];

  // Calculate final rating from completed evaluators
  const calculateFinalRating = () => {
    const completedEvaluators = evaluators.filter((ev: any) => ev.status === 'completed' && ev.final_rating);
    if (completedEvaluators.length > 0) {
      const totalRating = completedEvaluators.reduce((sum: number, ev: any) => sum + parseFloat(ev.final_rating.toString()), 0);
      const avgRating = totalRating / completedEvaluators.length;
      return avgRating.toFixed(2);
    }
    return assessment.final_rating ? parseFloat(assessment.final_rating.toString()).toFixed(2) : 'Pending';
  };

  autoTable(doc, {
    startY: yPos,
    head: [],
    body: [
      ['Description', assessment.description || 'N/A', 'End Date', assessment.end_date || 'N/A'],
      ['Start Date', assessment.start_date || 'N/A', 'Cycle Name', assessment.cycle_name || 'N/A'],
      ['Final Rating', calculateFinalRating(), 'Time Stamp', new Date().toISOString().slice(0, 19).replace('T', ' ')],
      ['Appraisal Status', (assessment.status || 'draft').toUpperCase(), '', ''],
    ],
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 45 },
      1: { cellWidth: 50 },
      2: { fontStyle: 'bold', cellWidth: 45 },
      3: { cellWidth: 50 },
    },
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Reviewed Employee Information
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Reviewed Employee Information', 14, yPos);
  yPos += 7;

  // Extract employee information with debug logging
  console.log("👤 Employee Info Debug:");
  console.log("  - assessment.employee_name:", assessment.employee_name);
  console.log("  - assessment.employee:", assessment.employee);
  console.log("  - assessment.employee_job_title:", assessment.employee_job_title);

  const employeeName = assessment.employee_name ||
    (typeof assessment.employee === 'object' && assessment.employee
      ? `${assessment.employee.legal_firstname || assessment.employee.first_name || ''} ${assessment.employee.legal_lastname || assessment.employee.last_name || ''}`.trim()
      : '') || 'Unknown Employee';

  const jobTitle = assessment.employee_job_title ||
    (typeof assessment.employee === 'object' && assessment.employee
      ? assessment.employee.job_title || assessment.employee.job_id || ''
      : '') || 'N/A';

  const location = (typeof assessment.employee === 'object' && assessment.employee)
    ? assessment.employee.location || 'N/A'
    : 'N/A';
  const country = (typeof assessment.employee === 'object' && assessment.employee)
    ? assessment.employee.country || 'NIGERIA'
    : 'NIGERIA';

  console.log("👤 Extracted Info:");
  console.log("  - Employee Name:", employeeName);
  console.log("  - Job Title:", jobTitle);
  console.log("  - Location:", location);
  console.log("  - Country:", country);

  autoTable(doc, {
    startY: yPos,
    head: [],
    body: [
      ['Reviewed Employee', employeeName, 'Location', location],
      ['Job Title', jobTitle, 'Country', country],
    ],
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 45 },
      1: { cellWidth: 50 },
      2: { fontStyle: 'bold', cellWidth: 45 },
      3: { cellWidth: 50 },
    },
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Summary Section
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary', 105, yPos, { align: 'center' });
  yPos += 7;

  // Evaluators
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Evaluators', 14, yPos);
  yPos += 5;

  const evaluatorsData = (assessment.evaluators || []).map((ev: any, index: number) => {
    // Use evaluator_name field first, then fallback to user object
    const evaluatorName = ev.evaluator_name ||
      (typeof ev.evaluator === 'object' && ev.evaluator
        ? `${ev.evaluator.first_name} ${ev.evaluator.last_name}`
        : 'Unknown');

    return [
      `${ev.evaluator_type === 'self' ? 'S' : 'M'}-EV-${index + 1}`,
      ev.evaluator_type === 'self' ? 'Self' : 'Main Evaluator',
      evaluatorName,
    ];
  });

  autoTable(doc, {
    startY: yPos,
    head: [['Code', 'Evaluator Type', 'Evaluator Name']],
    body: evaluatorsData,
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0], fontStyle: 'bold' },
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Reviews Section
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Reviews', 14, yPos);
  yPos += 5;

  console.log("📊 PDF Table Data:");
  console.log("  - Goals found:", goals.length);
  console.log("  - Evaluators found:", evaluators.length);
  console.log("  - Evaluator ratings provided:", evaluatorRatings.length);

  // Validation checks
  if (!goals || goals.length === 0) {
    console.warn("⚠️ No goals found for PDF generation");
  }
  if (!evaluators || evaluators.length === 0) {
    console.warn("⚠️ No evaluators found for PDF generation");
  }

  // Debug: log each evaluator's data in detail
  evaluators.forEach((ev: any, idx: number) => {
    console.log(`  - Evaluator ${idx} detailed data:`, {
      id: ev.id,
      status: ev.status,
      final_rating: ev.final_rating,
      goal_ratings: ev.goal_ratings,
      competency_ratings: ev.competency_ratings,
      evaluator_type: ev.evaluator_type
    });
  });

  // Header row with evaluator codes
  const headerRow = ['', 'Weight'];

  const completedEvaluators = evaluators.filter((ev: any) => ev.status === 'completed');

  if (evaluators.length > 0) {
    evaluators.forEach((ev: any, idx: number) => {
      const statusIcon = ev.status === 'completed' ? '✓' : '○';
      headerRow.push(`${statusIcon}${ev.evaluator_type === 'self' ? 'S' : 'M'}-EV-${idx + 1}`);
    });
  } else {
    // If no evaluators, add placeholder
    headerRow.push('Status');
  }

  // Build rows for each goal and its narratives
  const reviewRows: any[] = [];

  // Add a note if no evaluations are completed
  if (completedEvaluators.length === 0) {
    reviewRows.push([
      { content: `📝 Note: No evaluations have been completed yet. Ratings will appear here once evaluators submit their assessments.`, colSpan: headerRow.length, styles: { fontStyle: 'italic', fillColor: [255, 248, 220], textColor: [180, 120, 0] } }
    ]);
  }

  goals.forEach((goal: any) => {
    const goalTitle = goal.title || 'Untitled Goal';
    const goalWeightRaw = goal.total_weight ||
      (goal.narratives?.reduce((sum: number, n: any) => sum + parseFloat(n.weight?.toString() || '0'), 0) || 0);
    const goalWeight = parseFloat(goalWeightRaw?.toString() || '0');

    // Goal header row
    reviewRows.push([
      { content: `${goalTitle.toUpperCase()} (Weight: ${goalWeight ? goalWeight.toFixed(1) : '0'})`, colSpan: headerRow.length, styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } }
    ]);

    // Narrative rows (if any)
    if (goal.narratives && goal.narratives.length > 0) {
      goal.narratives.forEach((narrative: any) => {
        const narrativeWeight = parseFloat(narrative.weight?.toString() || '0');
        const row = [
          narrative.description || 'No description',
          narrativeWeight ? narrativeWeight.toFixed(1) : '0',
        ];

        // Add ratings from each evaluator (if available)
        if (evaluators.length > 0) {
          evaluators.forEach((ev: any, evIdx: number) => {
            // Get rating from evaluator's goal_ratings (this contains the real data)
            let narrativeRating = null;

            console.log(`🔍 Looking for narrative rating:`, {
              evaluator: ev.evaluator_name,
              evaluatorId: ev.id,
              goalId: goal.id,
              goalTitle: goal.title,
              narrativeDesc: narrative.description,
              narrativeId: narrative.id,
              evaluatorGoalRatings: ev.goal_ratings
            });

            if (ev.goal_ratings && ev.goal_ratings.length > 0) {
              const goalRating = ev.goal_ratings.find((gr: any) => gr.goal_id === goal.id);
              console.log(`  Found goal rating:`, goalRating);

              if (goalRating && goalRating.narratives) {
                narrativeRating = goalRating.narratives.find((nr: any) =>
                  nr.description === narrative.description || nr.narrative_id === narrative.id
                );
                console.log(`  Found narrative rating:`, narrativeRating);
              }
            }

            const rating = narrativeRating?.rating?.toString() || '-';
            console.log(`  Final rating for evaluator ${evIdx}:`, rating);
            row.push(rating);
          });
        } else {
          // If no evaluators, show pending status
          row.push('Pending Evaluation');
        }

        reviewRows.push(row);
      });
    } else {
      // If no narratives, just show the goal
      const row = [goalTitle, goalWeight ? goalWeight.toFixed(1) : '0'];
      if (evaluators.length > 0) {
        evaluators.forEach((ev: any) => {
          const evaluatorRating = evaluatorRatings.find((er: any) => er.evaluator_id === ev.id);
          const goalRating = evaluatorRating?.goal_ratings?.find((gr: any) => gr.goal_id === goal.id);
          row.push(goalRating?.rating?.toString() || '-');
        });
      } else {
        row.push('Pending Evaluation');
      }
      reviewRows.push(row);
    }
  });

  // Overall Rating row
  const overallRatingRow = ['Overall Rating', ''];
  if (evaluators.length > 0) {
    evaluators.forEach((ev: any) => {
      // Use final_rating directly from evaluator (this contains the real data)
      const finalRating = ev.final_rating;
      overallRatingRow.push(finalRating ? parseFloat(finalRating.toString()).toFixed(2) : '-');
    });
  } else {
    overallRatingRow.push('Pending');
  }
  reviewRows.push(overallRatingRow);

  autoTable(doc, {
    startY: yPos,
    head: [headerRow],
    body: reviewRows,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0], fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 20, halign: 'center' },
    },
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Add new page for detailed evaluator reviews - use data from evaluators directly
  if (evaluators && evaluators.length > 0) {
    evaluators.forEach((evaluator: any) => {
      // Only add detailed pages for completed evaluations
      if (evaluator.status !== 'completed') return;

      doc.addPage();
      yPos = 20;

      // Get evaluator name - use evaluator_name field which contains the correct name
      const evaluatorName = evaluator.evaluator_name || 'Unknown Evaluator';

      const evaluatorUser = typeof evaluator.evaluator === 'object' ? evaluator.evaluator : null;

      // Evaluator Header
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`Evaluator Name: ${evaluatorName}`, 14, yPos);
      yPos += 7;

      autoTable(doc, {
        startY: yPos,
        head: [],
        body: [
          ['Evaluator Type', evaluator?.evaluator_type === 'self' ? 'Self' : 'Main Evaluator', 'Job Title', evaluatorUser?.job_title || 'N/A'],
          ['Overall Rating', evaluator.final_rating ? parseFloat(evaluator.final_rating.toString()).toFixed(2) : 'N/A', 'Country', evaluatorUser?.country || 'Nigeria'],
        ],
        theme: 'grid',
        styles: { fontSize: 9, cellPadding: 2 },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 45 },
          1: { cellWidth: 50 },
          2: { fontStyle: 'bold', cellWidth: 45 },
          3: { cellWidth: 50 },
        },
      });

      yPos = (doc as any).lastAutoTable.finalY + 10;

      // Goal ratings with narratives
      if (evaluator.goal_ratings && evaluator.goal_ratings.length > 0) {
        evaluator.goal_ratings.forEach((goalRating: any) => {
          const goal = goals.find((g: any) => g.id === goalRating.goal_id);
          if (!goal) return;

          const goalWeightRaw = goal.total_weight ||
            (goal.narratives?.reduce((sum: number, n: any) => sum + parseFloat(n.weight?.toString() || '0'), 0) || 0);
          const goalWeight = parseFloat(goalWeightRaw?.toString() || '0');

          // Goal section title
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.text(`${goal.title?.toUpperCase() || 'UNTITLED GOAL'}: ${goalWeight ? goalWeight.toFixed(2) : '0'} (Weight: ${goalWeight ? goalWeight.toFixed(1) : '0'})`, 14, yPos);
          yPos += 5;

          // Narrative ratings table
          if (goalRating.narratives && goalRating.narratives.length > 0) {
            const narrativeRows = goalRating.narratives.map((narrative: any) => [
              goal.title || 'Untitled Goal',
              narrative.description || 'No description',
              narrative.rating?.toString() || '-',
              narrative.comment || '',
            ]);

            autoTable(doc, {
              startY: yPos,
              head: [['Group', 'Competencies', 'Weight | Rating', 'Comment']],
              body: narrativeRows,
              theme: 'grid',
              styles: { fontSize: 8, cellPadding: 2 },
              headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0], fontStyle: 'bold' },
              columnStyles: {
                0: { cellWidth: 40 },
                1: { cellWidth: 60 },
                2: { cellWidth: 30, halign: 'center' },
                3: { cellWidth: 60 },
              },
            });

            yPos = (doc as any).lastAutoTable.finalY + 5;
          }

          // Manager Comments
          if (goalRating.manager_comment) {
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.text('Manager Comments:', 14, yPos);
            yPos += 5;

            doc.setFont('helvetica', 'normal');
            const commentLines = doc.splitTextToSize(goalRating.manager_comment, 180);
            doc.text(commentLines, 14, yPos);
            yPos += commentLines.length * 5 + 5;
          }

          // Check if we need a new page
          if (yPos > 250) {
            doc.addPage();
            yPos = 20;
          }
        });
      }
    });
  }

  // Generate filename
  const employeeNameForFile = employeeName.replace(/\s+/g, '_');
  const timestamp = new Date().toISOString().slice(0, 10);
  const filename = `${assessment.id || 'performance'}_${employeeNameForFile}_${timestamp}.pdf`;

    // Save the PDF
    doc.save(filename);

    console.log("✅ PDF generated successfully:", filename);
    return filename;

  } catch (error) {
    console.error("❌ PDF Generation Error:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      assessmentData: data.assessment ? {
        id: data.assessment.id,
        employee_name: data.assessment.employee_name,
        evaluators_count: data.assessment.evaluators?.length || 0,
        goals_count: data.assessment.goals?.length || data.assessment.employee_goals?.length || 0
      } : 'No assessment data'
    });

    // Re-throw the error so the calling function can handle it
    throw new Error(`PDF Generation Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Generate PDF for a single evaluator's assessment
export const generateIndividualEvaluatorPDF = async (data: {
  assessment: any;
  evaluator: any;
  goals: any[];
}) => {
  try {
    const { assessment, evaluator, goals } = data;

    console.log("📄 Individual Evaluator PDF Generation:");
    console.log("  - Assessment:", assessment.id);
    console.log("  - Evaluator:", evaluator.evaluator_name);
    console.log("  - Goals:", goals.length);
    console.log("  - Evaluator goal_ratings:", evaluator.goal_ratings);
    console.log("  - Evaluator competency_ratings:", evaluator.competency_ratings);
    console.log("  - Evaluator final_rating:", evaluator.final_rating);

    const doc = new jsPDF();

    // Helper function to add the AHNI logo and header for individual evaluator
    const addEvaluatorHeader = async (doc: jsPDF, yPosition: number) => {
      // AHNI Logo (left side)
      try {
        const logoBase64 = await getImageAsBase64('/imgs/logo.png');
        doc.addImage(logoBase64, 'PNG', 14, yPosition, 35, 12);
      } catch (error) {
        console.warn('Could not load logo image, using text placeholder:', error);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('AHNI', 14, yPosition + 5);
        doc.setFontSize(6);
        doc.setFont('helvetica', 'normal');
        doc.text('ACHIEVING HEALTH NIGERIA INITIATIVE', 14, yPosition + 10);
        doc.setDrawColor(200, 200, 200);
        doc.rect(14, yPosition, 35, 12);
      }

      // Title (center)
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Individual Performance Evaluation', 105, yPosition + 5, { align: 'center' });

      // Evaluator name
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      const evaluatorName = evaluator.evaluator_name || 'Unknown Evaluator';
      doc.text(`Evaluator: ${evaluatorName}`, 105, yPosition + 15, { align: 'center' });

      // Date (right side)
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      const currentDate = new Date().toLocaleDateString();
      doc.text(`Generated: ${currentDate}`, 190, yPosition + 5, { align: 'right' });

      return yPosition + 25;
    };

    let yPos = 20;
    yPos = await addEvaluatorHeader(doc, yPos);

    // Assessment Information
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Assessment Information', 14, yPos);
    yPos += 7;

    autoTable(doc, {
      startY: yPos,
      head: [],
      body: [
        ['Assessment ID', assessment.assessment_number || assessment.id, 'Cycle', assessment.cycle_name || 'N/A'],
        ['Employee', assessment.employee_name || 'N/A', 'Status', evaluator.status?.toUpperCase() || 'PENDING'],
        ['Evaluator Type', evaluator.evaluator_type === 'self' ? 'Self Evaluation' : 'Manager Evaluation', 'Final Rating', evaluator.final_rating ? parseFloat(evaluator.final_rating.toString()).toFixed(2) + '/5' : 'N/A'],
      ],
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 2 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 45 },
        1: { cellWidth: 50 },
        2: { fontStyle: 'bold', cellWidth: 45 },
        3: { cellWidth: 50 },
      },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;

    // Goal Evaluations
    if (evaluator.goal_ratings && evaluator.goal_ratings.length > 0) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Goal Evaluations', 14, yPos);
      yPos += 7;

      evaluator.goal_ratings.forEach((goalRating: any, index: number) => {
        const goal = goals.find((g: any) => g.id === goalRating.goal_id);
        if (!goal) return;

        const goalWeightRaw = goal.total_weight ||
          (goal.narratives?.reduce((sum: number, n: any) => sum + parseFloat(n.weight?.toString() || '0'), 0) || 0);
        const goalWeight = parseFloat(goalWeightRaw?.toString() || '0');

        // Goal title
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`${index + 1}. ${goal.title?.toUpperCase() || 'UNTITLED GOAL'} (Weight: ${goalWeight ? goalWeight.toFixed(1) : '0'}%)`, 14, yPos);
        yPos += 7;

        // Narrative ratings table
        if (goalRating.narratives && goalRating.narratives.length > 0) {
          const narrativeRows = goalRating.narratives.map((narrative: any) => [
            narrative.description || 'No description',
            narrative.rating?.toString() || 'N/A',
            narrative.comment || 'No comment',
          ]);

          autoTable(doc, {
            startY: yPos,
            head: [['Task/Narrative', 'Rating', 'Comment']],
            body: narrativeRows,
            theme: 'grid',
            styles: { fontSize: 8, cellPadding: 3 },
            headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0], fontStyle: 'bold' },
            columnStyles: {
              0: { cellWidth: 80 },
              1: { cellWidth: 25, halign: 'center' },
              2: { cellWidth: 85 },
            },
          });

          yPos = (doc as any).lastAutoTable.finalY + 5;
        }

        // Manager comments
        if (goalRating.manager_comment) {
          doc.setFontSize(9);
          doc.setFont('helvetica', 'bold');
          doc.text('Manager Comments:', 14, yPos);
          yPos += 5;

          doc.setFont('helvetica', 'normal');
          const commentLines = doc.splitTextToSize(goalRating.manager_comment, 180);
          doc.text(commentLines, 14, yPos);
          yPos += commentLines.length * 4 + 10;
        }

        // Check if we need a new page
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
      });
    }

    // Competency Ratings
    if (evaluator.competency_ratings && evaluator.competency_ratings.length > 0) {
      if (yPos > 200) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Competency Evaluations', 14, yPos);
      yPos += 7;

      const competencyRows = evaluator.competency_ratings.map((comp: any, index: number) => [
        (index + 1).toString(),
        comp.competency || 'Unknown Competency',
        comp.rating?.toString() || 'N/A',
        comp.comments || 'No comments',
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [['#', 'Competency', 'Rating', 'Comments']],
        body: competencyRows,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0], fontStyle: 'bold' },
        columnStyles: {
          0: { cellWidth: 15, halign: 'center' },
          1: { cellWidth: 60 },
          2: { cellWidth: 25, halign: 'center' },
          3: { cellWidth: 90 },
        },
      });

      yPos = (doc as any).lastAutoTable.finalY + 10;
    }

    // Overall Comments
    if (evaluator.overall_comments) {
      if (yPos > 230) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Overall Comments', 14, yPos);
      yPos += 7;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      const commentLines = doc.splitTextToSize(evaluator.overall_comments, 180);
      doc.text(commentLines, 14, yPos);
    }

    // Generate filename
    const evaluatorNameForFile = (evaluator.evaluator_name || 'Unknown').replace(/\s+/g, '_');
    const employeeNameForFile = (assessment.employee_name || 'Employee').replace(/\s+/g, '_');
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `${assessment.id}_${evaluatorNameForFile}_${employeeNameForFile}_${timestamp}.pdf`;

    // Save the PDF
    doc.save(filename);

    console.log("✅ Individual evaluator PDF generated successfully:", filename);
    return filename;

  } catch (error) {
    console.error("❌ Individual Evaluator PDF Generation Error:", error);
    throw new Error(`Individual PDF Generation Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
