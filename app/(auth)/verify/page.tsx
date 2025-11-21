import { requireNoAuth } from "@/lib/auth-utils";
import VerifyStatus from "@/features/auth/components/verify-status";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { error } = await searchParams;

  await requireNoAuth();

  const hasError = error === "invalid_token";

  return <VerifyStatus success={!hasError} />;
}
