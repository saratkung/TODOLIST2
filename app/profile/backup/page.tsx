import { PageHeader } from "@/components/shared/page-header";
import { BackupCard } from "@/features/profile/components/backup-card";

export default function BackupPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Backup & Restore" description="สำรองและกู้คืนข้อมูลของคุณ" />
      <BackupCard />
    </div>
  );
}
