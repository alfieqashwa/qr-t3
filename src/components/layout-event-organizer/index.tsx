export const LayoutEventOrganizer = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="min-h-screen bg-slate-950 p-2 sm:p-4 lg:p-6">
      <main className="mt-4">{children}</main>
    </div>
  )
}
