"use client";

import React from "react";
import { useParams } from "next/navigation";
import LeaveDetailView from "./LeaveDetailView";

interface LeaveDetailsProps {
  id?: string;
}

const LeaveDetails: React.FC<LeaveDetailsProps> = ({ id: propId }) => {
  const params = useParams();
  const leaveRequestId = (propId || params?.id) as string;

  return <LeaveDetailView id={leaveRequestId} />;
};

export default LeaveDetails;
