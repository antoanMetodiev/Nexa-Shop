import { getStoreSettings } from "@/lib/settings";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getStoreSettings();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight text-navy-950">
        Настройки
      </h1>
      <SettingsForm settings={settings} />
    </div>
  );
}
