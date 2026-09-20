import { useI18n } from "@/lib/hooks/use-i18n";

type HeaderProps = {
  name: string;
};

const Header = ({ name }: HeaderProps) => {
  const { t } = useI18n();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("GREETING_MORNING");
    if (hour < 18) return t("GREETING_AFTERNOON");
    return t("GREETING_EVENING");
  };

  return (
    <div className="border-b border-slate-800/80 pb-3">
      <p className="text-base font-medium text-slate-300">
        {getGreeting()},{" "}
        <span className="text-emerald-400 font-bold">{name || "User"}</span> 👋
      </p>
    </div>
  );
};

export default Header;
