import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="bg-slate-900 text-white">
      {/* Hero Section */}
      <section className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-400 text-transparent bg-clip-text">
          Level Up Your LeetCode Journey
        </h1>
        <p className="max-w-2xl mt-4 text-lg text-slate-300">
          Track your progress, challenge your friends, and climb the
          leaderboards. All your stats, gamified.
        </p>
        <Link
          to="/auth"
          className="mt-8 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-full transition duration-300 text-lg"
        >
          Get Started 🚀
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything you need to compete
        </h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <FeatureCard
            emoji="📊"
            title="Visualize Your Stats"
            description="See your solved problems, submission stats, and reputation in beautifully designed dashboards."
          />
          <FeatureCard
            emoji="⚔️"
            title="Challenge Friends"
            description="Go head-to-head with your connections on daily or custom challenges to prove your skills."
          />
          <FeatureCard
            emoji="🏆"
            title="Climb the Ranks"
            description="Compare your stats against friends and see where you stand on the community leaderboards."
          />
        </div>
      </section>
    </div>
  );
};

// A small helper component for the feature cards
const FeatureCard = ({
  emoji,
  title,
  description,
}: {
  emoji: string;
  title: string;
  description: string;
}) => (
  <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
    <div className="text-5xl mb-4">{emoji}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-slate-400">{description}</p>
  </div>
);

export default LandingPage;
