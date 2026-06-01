interface CredentialDetailPageProps {
  params: Promise<{
    credentialId: string;
  }>;
}

export default async function CredentialDetailPage({ params }: CredentialDetailPageProps) {
  const { credentialId } = await params;
  return <div>CredentialDetailPage {credentialId}</div>;
}
