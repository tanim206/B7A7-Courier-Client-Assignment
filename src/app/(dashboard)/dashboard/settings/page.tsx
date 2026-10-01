import AuthGuard from "@/auth/auth-guard";
import ProfileSettingsForm from "@/components/module/profile/profile-settings-form";

export default function DashboardSettingsPage() {
  return (
    <AuthGuard>
      <ProfileSettingsForm />
    </AuthGuard>
  );
}
