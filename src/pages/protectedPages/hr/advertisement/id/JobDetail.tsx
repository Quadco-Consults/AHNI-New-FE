import PdfContent from "components/shared/PdfContent";
import { Badge } from "components/ui/badge";
import {
  Briefcase,
  CalendarDays,
  Clock,
  MapPin,
  PersonStanding,
  Users,
} from "lucide-react";

const JobDetail = () => {
  return (
    <div className="space-y-6">
      <h4 className="font-semibold text-lg">Technical Associates</h4>

      <div className="flex flex-wrap gap-2 max-w-2xl">
        <Badge variant="md">
          <Users size={15} />({BADGES.position} positions)
        </Badge>
        <Badge variant="md">
          <Clock size={15} /> {BADGES.month} months with possibility of
          extension
        </Badge>
        <Badge variant="md">
          <CalendarDays size={15} /> {BADGES.date}
        </Badge>
        <Badge variant="md">
          <MapPin size={15} /> Various LGAs of {BADGES.lga}
        </Badge>
        <Badge variant="md">
          <Briefcase size={15} /> {BADGES.type}
        </Badge>
        <Badge variant="md">
          <PersonStanding size={15} /> {BADGES.lead}
        </Badge>
      </div>

      <h4 className="font-medium">Background</h4>
      <p className="text-sm line-clamp-4">
        Achieving Health Nigeria Initiative (AHNi) is a non-profit organization
        that promotes socio-economic development by supporting global health and
        economic initiatives in Nigeria. It was established as an indigenous
        organization, registered in 2009 with its headquarters in Abuja, and
        presence in the four geopolitical regions of Nigeria. It aims to provide
        technical assistance to the government and people of Nigeria in the
        implementation of public health and development programs. The Global
        Fund Grant Cycle (GC7) is to ensure a coordinated and intensive effort
        to scale up the prevention, identification, and treatment of HIV in both
        general and key populations in Anambra state. The focus will be on
        facility and community-based approaches to reach epidemic control, and
        in addition, ensure improvement in the coverage of pregnant women on ART
        as well as target KP and AGYW programs. Hence, the consultant will
        support the implementation of the GC7 grant at Local Government levels
        in the state.
      </p>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <PdfContent />
      </div>
    </div>
  );
};

export default JobDetail;

const BADGES = {
  position: 15,
  month: 9,
  date: "22nd January 2024",
  lga: "Anambra state",
  type: "Internal",
  lead: "Cluster Leads",
};
