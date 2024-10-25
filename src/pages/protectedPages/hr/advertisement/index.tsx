import AddSquareIcon from "components/icons/AddSquareIcon";
import Card from "components/shared/Card";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { HrRoutes } from "constants/RouterConstants";
import {
  Briefcase,
  CalendarDays,
  Clock,
  MapPin,
  PersonStanding,
  Users,
} from "lucide-react";
import { generatePath, Link } from "react-router-dom";

const Advertisement = () => {
  return (
    <Card className="space-y-10">
      <div className="flex justify-end">
        <Link to={HrRoutes.ADVERTISEMENT_ADD}>
          <Button>
            <AddSquareIcon /> Create New
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Card className="space-y-4">
          <Badge variant="darkYellow">Date Posted: 2, Apr, 2023</Badge>
          <h4 className="font-semibold text-lg">Technical Associates</h4>

          <div className="flex flex-wrap gap-2">
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
          <p className="text-sm line-clamp-4">
            Achieving Health Nigeria Initiative (AHNi) is an indigenous
            non-governmental organization that promotes socio-economic
            development by supporting a broad range of global health
            interventions, education, and economic initiatives in Nigeria.
          </p>
          <div className="flex justify-center">
            <Link to={generatePath(HrRoutes.ADVERTISEMENT_DETAIL, { id: 1 })}>
              <Button variant="outline" className="text-red-600">
                Tap to View
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </Card>
  );
};

export default Advertisement;

const BADGES = {
  icon: <Users size={15} />,
  position: 15,
  month: 9,
  date: "22nd January 2024",
  lga: "Anambra state",
  type: "Internal",
  lead: "Cluster Leads",
};
