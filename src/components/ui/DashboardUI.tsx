import { type UserData } from "../../types/UserData";

const DashboardUI = ({ userData }: { userData: UserData }) => {
  const { user, plainAcSubmissions, plainTotalSubmissions } = userData;
  return (
    <div className="h-screen rounded-md m-4 bg-gradient-to-tr from-indigo-900 to-slate-900 text-white p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{user.username}</h1>
          <p className="text-sm text-gray-300">
            {user.realName} • {user.countryName || "🌍"}{" "}
            {user.school && `• 🎓 ${user.school}`}
          </p>
        </div>
        <div className="bg-yellow-400 text-black px-4 py-2 rounded-xl text-sm font-bold shadow-md">
          #{user.ranking.toLocaleString()} Global Rank
        </div>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Reputation */}
        <StatCard title="Reputation" value={user.reputation} emoji="🔥" />

        {plainAcSubmissions.map((item) => (
          <StatCard
            key={item.difficulty}
            title={`Solved - ${item.difficulty}`}
            value={item.count}
            subtitle={`${item.submissions} submissions`}
            emoji={getEmojiByDifficulty(item.difficulty)}
          />
        ))}

        {plainTotalSubmissions.map((item) => (
          <StatCard
            key={item.difficulty}
            title={`Total - ${item.difficulty}`}
            value={item.count}
            subtitle={`${item.submissions} submissions`}
            emoji="📤"
          />
        ))}
      </section>

      {user.aboutMe && (
        <section className="mt-10 bg-white/10 p-6 rounded-xl shadow-inner">
          <h2 className="text-xl font-semibold mb-2">About Me</h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            {user.aboutMe}
          </p>
        </section>
      )}
    </div>
  );
};

export default DashboardUI;

const StatCard = ({
  title,
  value,
  subtitle,
  emoji,
}: {
  title: string;
  value: number;
  subtitle?: string;
  emoji?: string;
}) => {
  return (
    <div className="bg-white/10 p-4 rounded-xl shadow-lg backdrop-blur-md hover:scale-[1.02] transition-all duration-200">
      <div className="text-lg font-semibold mb-1 flex items-center gap-2">
        {emoji} {title}
      </div>
      <div className="text-3xl font-bold">{value}</div>
      {subtitle && <div className="text-sm text-gray-300">{subtitle}</div>}
    </div>
  );
};

const getEmojiByDifficulty = (difficulty: string): string => {
  switch (difficulty) {
    case "Easy":
      return "🟢";
    case "Medium":
      return "🟠";
    case "Hard":
      return "🔴";
    case "All":
      return "📊";
    default:
      return "❓";
  }
};
