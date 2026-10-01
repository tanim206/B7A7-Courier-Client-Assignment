import AuthGuard from "@/auth/auth-guard";
import ProfileSettingsForm from "@/components/module/profile/profile-settings-form";

export default function DashboardStaffSettingsPage() {
  return (
    <AuthGuard>
      <ProfileSettingsForm />
    </AuthGuard>
  );
}
