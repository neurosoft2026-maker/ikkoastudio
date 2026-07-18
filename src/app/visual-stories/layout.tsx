import MaintenanceView from "@/components/MaintenanceView";
import { getHomeEnabled } from "@/lib/site-settings";

export default async function VisualStoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const homeEnabled = await getHomeEnabled();

  if (!homeEnabled) {
    return <MaintenanceView />;
  }

  return children;
}
