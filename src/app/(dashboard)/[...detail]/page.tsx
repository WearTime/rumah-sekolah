import DashboardDetailView from "@/components/views/DesktopMode/DashboardDetail";

const DashboardDetailPage = async ({
  params,
}: {
  params: Promise<{ detail: string[] }>;
}) => {
  const paramsValue = await params;
  return (
    <div>
      <DashboardDetailView params={paramsValue} />
    </div>
  );
};
export default DashboardDetailPage;
