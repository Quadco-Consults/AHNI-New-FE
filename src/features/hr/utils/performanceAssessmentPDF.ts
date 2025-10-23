import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PDFData {
  assessment: any;
  evaluatorRatings?: any[];
}

export const generatePerformanceAssessmentPDF = (data: PDFData) => {
  const { assessment, evaluatorRatings = [] } = data;

  // Debug PDF input data
  console.log("📄 PDF Generation Input:");
  console.log("  - Assessment:", assessment);
  console.log("  - Evaluator Ratings:", evaluatorRatings);
  console.log("  - Goals:", assessment?.employee_goals || assessment?.goals);

  const doc = new jsPDF();

  // Helper function to add the AHNI logo placeholder
  const addHeader = (doc: jsPDF, yPosition: number) => {
    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Performance Evaluation', 105, yPosition, { align: 'center' });

    // Subtitle
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('INTRODUCTORY PERFORMANCE ASSESSMENT', 105, yPosition + 10, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('To be completed within the first 90 days of employment', 105, yPosition + 17, { align: 'center' });

    return yPosition + 25;
  };

  let yPos = 20;
  yPos = addHeader(doc, yPos);

  // Appraisal Information Section
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Appraisal Information', 14, yPos);
  yPos += 7;

  autoTable(doc, {
    startY: yPos,
    head: [],
    body: [
      ['Description', assessment.description || 'N/A', 'End Date', assessment.end_date || 'N/A'],
      ['Start Date', assessment.start_date || 'N/A', 'Cycle Name', assessment.cycle_name || 'N/A'],
      ['Final Rating', assessment.final_rating ? assessment.final_rating.toFixed(2) : 'Pending', 'Time Stamp', new Date().toISOString().slice(0, 19).replace('T', ' ')],
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
    const evaluatorUser = typeof ev.evaluator === 'object' ? ev.evaluator : null;
    const evaluatorName = evaluatorUser
      ? `${evaluatorUser.first_name} ${evaluatorUser.last_name}`
      : 'Unknown';

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

  // Build reviews table based on goals and evaluator ratings
  const goals = assessment.employee_goals || assessment.goals || [];
  const evaluators = assessment.evaluators || [];

  console.log("📊 PDF Table Data:");
  console.log("  - Goals found:", goals.length);
  console.log("  - Evaluators found:", evaluators.length);
  console.log("  - Evaluator ratings provided:", evaluatorRatings.length);

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
      headerRow.push(`${statusIcon} ${ev.evaluator_type === 'self' ? 'S' : 'M'}-EV-${idx + 1}`);
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
      { content: `${goalTitle.toUpperCase()} (Weight: ${goalWeight.toFixed(1)})`, colSpan: headerRow.length, styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } }
    ]);

    // Narrative rows (if any)
    if (goal.narratives && goal.narratives.length > 0) {
      goal.narratives.forEach((narrative: any) => {
        const narrativeWeight = parseFloat(narrative.weight?.toString() || '0');
        const row = [
          narrative.description || 'No description',
          narrativeWeight.toFixed(1),
        ];

        // Add ratings from each evaluator (if available)
        if (evaluators.length > 0) {
          evaluators.forEach((ev: any) => {
            // Try to find rating data from either evaluator directly or evaluatorRatings array
            let narrativeRating = null;

            // First, try to get from the evaluator's goal_ratings (most direct)
            if (ev.goal_ratings && ev.goal_ratings.length > 0) {
              const goalRating = ev.goal_ratings.find((gr: any) => gr.goal_id === goal.id);
              if (goalRating && goalRating.narratives) {
                narrativeRating = goalRating.narratives.find((nr: any) =>
                  nr.description === narrative.description || nr.narrative_id === narrative.id
                );
              }
            }

            // If not found, try the evaluatorRatings array (fallback)
            if (!narrativeRating) {
              const evaluatorRating = evaluatorRatings.find((er: any) => er.evaluator_id === ev.id);
              if (evaluatorRating) {
                const goalRating = evaluatorRating.goal_ratings?.find((gr: any) => gr.goal_id === goal.id);
                if (goalRating) {
                  narrativeRating = goalRating.narratives?.find((nr: any) =>
                    nr.description === narrative.description || nr.narrative_id === narrative.id
                  );
                }
              }
            }

            row.push(narrativeRating?.rating?.toString() || '-');
          });
        } else {
          // If no evaluators, show pending status
          row.push('Pending Evaluation');
        }

        reviewRows.push(row);
      });
    } else {
      // If no narratives, just show the goal
      const row = [goalTitle, goalWeight.toFixed(1)];
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
      // Try to get final rating from evaluator directly first
      let finalRating = ev.final_rating;

      // If not available, try from evaluatorRatings array
      if (!finalRating) {
        const evaluatorRating = evaluatorRatings.find((er: any) => er.evaluator_id === ev.id);
        finalRating = evaluatorRating?.overall_rating;
      }

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
    evaluators.forEach((evaluator: any, evalIndex: number) => {
      // Only add detailed pages for completed evaluations
      if (evaluator.status !== 'completed') return;

      doc.addPage();
      yPos = 20;

      // Get evaluator name
      const evaluatorName = evaluator.evaluator_name ||
        (typeof evaluator.evaluator === 'object'
          ? `${evaluator.evaluator.first_name} ${evaluator.evaluator.last_name}`
          : 'Unknown Evaluator');

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
          ['Overall Rating', evaluator.final_rating?.toFixed(2) || 'N/A', 'Country', evaluatorUser?.country || 'Nigeria'],
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
          doc.text(`${goal.title?.toUpperCase() || 'UNTITLED GOAL'}: ${goalWeight.toFixed(2)} (Weight: ${goalWeight.toFixed(1)})`, 14, yPos);
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

  return filename;
};
