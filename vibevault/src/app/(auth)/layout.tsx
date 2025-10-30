export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative">
      <div className="max-w-md w-full space-y-8 px-4 relative z-10">
        {children}
      </div>
    </div>
  );
}
