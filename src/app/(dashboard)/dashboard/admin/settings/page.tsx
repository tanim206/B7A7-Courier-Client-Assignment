import AuthGuard from "@/auth/auth-guard";
import ProfileSettingsForm from "@/components/module/profile/profile-settings-form";

export default function DashboardAdminSettingsPage() {
  return (
    <AuthGuard>
      <ProfileSettingsForm />
    </AuthGuard>
  );
}
