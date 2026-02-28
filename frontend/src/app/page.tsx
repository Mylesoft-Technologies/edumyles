export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-cream flex items-center justify-center p-8">
      <div className="text-center animate-slide-up">
        <p className="text-amber-500 font-bold text-2xl tracking-tight mb-2">EduMyles</p>
        <h1 className="text-xl font-semibold text-charcoal">Dashboard</h1>
        <p className="mt-2 text-charcoal-300 text-sm">Loading your school portal&hellip;</p>
        <div className="mt-6 flex justify-center gap-3">
          <div className="w-2 h-2 bg-forest-500 rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-forest-500 rounded-full animate-pulse [animation-delay:200ms]" />
          <div className="w-2 h-2 bg-forest-500 rounded-full animate-pulse [animation-delay:400ms]" />
        </div>
      </div>
    </main>
  );
}
