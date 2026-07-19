import { PageHeader } from "@/components/shared/page-header";
import { ProfileHeader } from "@/features/profile/components/profile-header";
import { PersonalInfoCard } from "@/features/profile/components/personal-info-card";
import { AccountCard } from "@/features/profile/components/account-card";
import { SettingsCard } from "@/features/profile/components/settings-card";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="โปรไฟล์และการตั้งค่า" />
      <ProfileHeader />
      <PersonalInfoCard />
      <AccountCard />
      <SettingsCard />
      <p className="pb-2 text-center text-[11px] text-muted-foreground/60">
        Investigator · เวอร์ชัน 0.1.0 (Core Workspace)
      </p>
    </div>
  );
}
