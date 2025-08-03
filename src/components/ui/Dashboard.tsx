const Dashboard = () => {
  return (
    <div className="bg-slate-900 text-white min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-slate-100">Your Dashboard</h1>
          <p className="text-slate-400 mt-2">
            Welcome back! Here's a snapshot of your progress and challenges.
          </p>
        </header>

        {/* Placeholder Grid for Future Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <PlaceholderCard
            title="📊 Your Stats"
            description="A detailed breakdown of your solved problems and submission accuracy will appear here."
          />
          <PlaceholderCard
            title="⚔️ Active Challenges"
            description="Challenges from your friends and daily problems will be shown in this section."
          />
          <PlaceholderCard
            title="📈 Recent Activity"
            description="A feed of your recent submissions and achievements will be displayed here."
          />
        </div>
      </div>
    </div>
  );
};

const PlaceholderCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 h-full">
    <h3 className="text-xl font-semibold text-emerald-400 mb-3">{title}</h3>
    <p className="text-slate-300">{description}</p>
  </div>
);

export default Dashboard;
