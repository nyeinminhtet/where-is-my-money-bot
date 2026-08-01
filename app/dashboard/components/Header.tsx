type HeaderProps = {
  name: string;
};

export default function Header({ name }: HeaderProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="border-b border-slate-800/80 pb-3">
      <p className="text-base font-medium text-slate-300">
        {getGreeting()},{" "}
        <span className="text-emerald-400 font-bold">{name || "User"}</span> 👋
      </p>
    </div>
  );
}
