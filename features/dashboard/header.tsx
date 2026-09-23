import { useI18n } from "@/lib/hooks/use-i18n";

type HeaderProps = {
  name: string;
};

const Header = ({ name }: HeaderProps) => {
  const { lang, t, setLanguage } = useI18n();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("GREETING_MORNING");
    if (hour < 18) return t("GREETING_AFTERNOON");
    return t("GREETING_EVENING");
  };

  const toggleLanguage = () => {
    setLanguage(lang === "mm" ? "en" : "mm");
  };

  return (
    <div className="border-b border-slate-800/80 pb-3 flex items-center justify-between">
      <p className="text-base font-medium text-slate-300">
        {getGreeting()},{" "}
        <span className="text-emerald-400 font-bold">{name || "User"}</span> 👋
      </p>
      <button
        type="button"
        onClick={toggleLanguage}
        className="cursor-pointer rounded-lg border border-slate-700 bg-slate-900/80 px-2.5 py-1 text-xs font-medium text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
        aria-label={t("LANGUAGE_PROMPT")}
      >
        {lang === "mm" ? "🇲🇲 မြန်မာ" : "🇬🇧 EN"}
      </button>
    </div>
  );
};

export default Header;
