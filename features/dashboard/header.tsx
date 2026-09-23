import { useI18n } from "@/lib/hooks/use-i18n";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  return (
    <div className="border-b border-slate-800/80 pb-3 flex items-center justify-between gap-3">
      <p className="text-base font-medium text-slate-300 min-w-0 truncate">
        {getGreeting()},{" "}
        <span className="text-emerald-400 font-bold">{name || "User"}</span> 👋
      </p>
      <Select value={lang} onValueChange={(v) => setLanguage(v as "en" | "mm")}>
        <SelectTrigger
          size="sm"
          className="shrink-0 bg-slate-900/80 border-slate-700 text-slate-300 text-xs rounded-lg h-7"
          aria-label={t("LANGUAGE_PROMPT")}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-slate-900 border-slate-800 text-slate-100 rounded-xl">
          <SelectItem
            value="mm"
            className="text-xs text-slate-200 cursor-pointer rounded-lg hover:bg-slate-800 focus:bg-slate-800"
          >
            🇲🇲 မြန်မာ
          </SelectItem>
          <SelectItem
            value="en"
            className="text-xs text-slate-200 cursor-pointer rounded-lg hover:bg-slate-800 focus:bg-slate-800"
          >
            🇬🇧 English
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Header;
