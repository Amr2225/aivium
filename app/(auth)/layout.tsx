import { requireNoAuth } from "@/lib/auth-utils";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  await requireNoAuth();

  return <>{children}</>;
}
