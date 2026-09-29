import AuthGuard from "@/auth/auth-guard";
import ProfileCard from "@/components/module/profile/profile-card";

export default function DashboardProfilePage() {
  return (
    <AuthGuard>
      <ProfileCard />
    </AuthGuard>
  );
}
