export const experimental_ppr = true;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Since the sidebar is now in the root layout, we just need to return the children
  return <>{children}</>;
}
