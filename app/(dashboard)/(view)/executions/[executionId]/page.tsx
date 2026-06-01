interface ExecutionDetailPageProps {
  params: Promise<{
    executionId: string;
  }>;
}

export default async function ExecutionDetailPage({ params }: ExecutionDetailPageProps) {
  const { executionId } = await params;
  return <div>ExecutionDetailPage {executionId}</div>;
}
