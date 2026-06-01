import AppHeader from "@/components/app-header";
import { requireAuth } from "@/lib/auth-utils";

export default async function ViewLayout({ children }: { children: React.ReactNode }) {
  await requireAuth();

  return (
    <>
      <AppHeader />
      <main>{children}</main>
    </>
  );
}
