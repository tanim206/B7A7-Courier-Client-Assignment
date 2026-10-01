import AuthGuard from "@/auth/auth-guard";
import ProfileImageForm from "@/components/module/profile/profile-image-form";

export default function DashboardProfileImagePage() {
  return (
    <AuthGuard>
      <ProfileImageForm />
    </AuthGuard>
  );
}
