import { AssignmentView } from "@/features/assignments/components/assignment-view";

const AssignmentPage = async ({
  params,
}: {
  params: Promise<{ assignmentId: string }>;
}) => {
  const { assignmentId } = await params;
  return <AssignmentView assignmentId={assignmentId} />;
};

export default AssignmentPage;
