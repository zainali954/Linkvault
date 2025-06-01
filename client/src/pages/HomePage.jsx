import { RocketIcon, CheckmarkBadge02Icon, StarIcon } from "hugeicons-react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 text-slate-800 dark:text-neutral-100">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-neutral-700">
        <h1 className="text-2xl font-bold text-blue-600">LinkVault</h1>
        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
          <a href="#get-started" className="hover:text-blue-600 transition-colors">Get Started</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="text-center px-6 py-24 bg-gradient-to-b from-white to-slate-50 dark:from-neutral-900 dark:to-neutral-800">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight tracking-tight">
          Save, Organize & Access Links Effortlessly
        </h2>
        <p className="text-lg max-w-2xl mx-auto mb-8 text-slate-600 dark:text-slate-300">
          LinkVault helps you manage your favorite resources with powerful tagging and categorization.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-base font-medium shadow-md transition-all"
        >
          Get Started
        </button>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20 bg-white dark:bg-neutral-900">
        <h3 className="text-3xl font-bold text-center mb-12 tracking-tight">Features</h3>
        <div className="grid gap-10 md:grid-cols-3 max-w-6xl mx-auto">
          <FeatureCard
            icon={<RocketIcon size={28} />}
            title="Quick Access"
            desc="All your links at your fingertips, always ready when you are."
          />
          <FeatureCard
            icon={<CheckmarkBadge02Icon size={28} />}
            title="Private & Secure"
            desc="Only you have access to your saved data — your vault is yours."
          />
          <FeatureCard
            icon={<StarIcon size={28} />}
            title="Smart Organization"
            desc="Use favorites, tags, and categories to keep things neat and searchable."
          />
        </div>
      </section>

      {/* Footer */}
      <footer id="get-started" className="px-6 py-10 border-t border-slate-200 dark:border-neutral-800 text-center text-sm text-slate-500 dark:text-slate-400">
        © {new Date().getFullYear()} LinkVault. All rights reserved.
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-slate-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all">
    <div className="mb-4 text-blue-600 dark:text-blue-400">{icon}</div>
    <h4 className="text-lg font-semibold mb-2">{title}</h4>
    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

export default HomePage;
