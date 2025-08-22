import PencilIcon from "components/icons/PencilIcon";
import Card from "components/Card";
import { Button } from "components/ui/button";
import { DialogType } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";

const Feedback = () => {
  const dispatch = useAppDispatch();

  return (
    <div className="space-y-8">
      <div className="flex-items">
        <h4 className="font-semibold text-xl">ISAAC OLUGBENLE</h4>
        <Button
          onClick={() =>
            dispatch(
              openDialog({
                type: DialogType.FeedbackModal,
                dialogProps: {
                  width: "max-w-md",
                },
              })
            )
          }
          variant="custom"
        >
          <PencilIcon /> Write Feedback
        </Button>
      </div>

      <Card className="space-y-6">
        <div className="flex-items">
          <p className="font-semibold">Amos Jeniffer</p>
          <p className="font-light">2:00.pm, 20-10-2024 </p>
        </div>
        <p className="text-sm">
          Alex Johnson has consistently demonstrated exceptional performance as
          a team member at our organization. With a keen eye for detail and a
          proactive approach, Alex excels in managing tasks efficiently and
          effectively. Their positive attitude and willingness to go the extra
          mile have greatly contributed to the success of our projects.
          Alex&apos;s ability to communicate clearly and collaborate with
          colleagues has fostered a supportive and productive work environment.
          They are reliable, dedicated, and always ready to take on new
          challenges. We are fortunate to have Alex as part of our team and look
          forward to their continued contributions to our success.
        </p>
      </Card>
      <Card className="space-y-6">
        <div className="flex-items">
          <p className="font-semibold">Gabriel Mary</p>
          <p className="font-light">2:00.pm, 20-10-2024 </p>
        </div>
        <p className="text-sm">
          Sarah Thompson has been an invaluable asset to our team. Her
          exceptional organizational skills and attention to detail have
          significantly improved our workflow and project management. Sarah
          consistently meets deadlines and delivers high-quality work,
          showcasing her dedication and professionalism. Her strong
          communication abilities and collaborative spirit make her a pleasure
          to work with. Sarah is always eager to assist colleagues and takes
          initiative to solve problems efficiently. We are grateful for her
          contributions and are confident she will continue to excel and drive
          our team’s success
        </p>
      </Card>
    </div>
  );
};

export default Feedback;
