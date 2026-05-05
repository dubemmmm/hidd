import { redirect } from "next/navigation";

type ReportsPageProps = {
  searchParams?: Promise<{ asset?: string }> | { asset?: string };
};

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams ?? {});
  const destination = resolvedSearchParams.asset
    ? `/insights?asset=${encodeURIComponent(resolvedSearchParams.asset)}`
    : "/insights";

  redirect(destination);
}
