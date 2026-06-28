import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log('API Route - Received ID:', id);

    // If the ID is literally ":id", return an error
    if (id === ':id') {
      return NextResponse.json({
        status: false,
        message: "Invalid ID parameter. Please replace ':id' with actual consultant ID",
        error: "URL should be: /api/v1/contract-grants/consultancy-applications_details/ACTUAL_ID_HERE"
      }, { status: 400 });
    }

    // You can add your logic here to fetch consultancy application details
    // For now, returning a basic response

    return NextResponse.json({
      status: true,
      message: "Consultancy application details retrieved successfully",
      data: {
        id: id,
        title: `Consultancy Application - ${id}`,
        status: "APPLIED",
        created_at: new Date().toISOString(),
        applicant_count: 1,
        consultant_id: id,
        // Add more fields as needed
      }
    });

  } catch (error) {
    console.error('Error fetching consultancy application details:', error);

    return NextResponse.json(
      {
        status: false,
        message: "Failed to fetch consultancy application details",
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Add your POST logic here

    return NextResponse.json({
      status: true,
      message: "Consultancy application details updated successfully",
      data: {
        id: id,
        ...body,
        updated_at: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error updating consultancy application details:', error);

    return NextResponse.json(
      {
        status: false,
        message: "Failed to update consultancy application details",
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}