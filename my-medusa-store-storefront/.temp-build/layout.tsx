"use client";

export default function AccountPageLayout({
  dashboard,
  login,
}: {
  dashboard?: React.ReactNode
  login?: React.ReactNode
}) {
  return (
    <div className="py-6 min-h-[calc(100vh-64px)]">
      {dashboard || login}
    </div>
  );
}