type ViewTabsProps = {
  activeTab: "history" | "analytics";
  onChange: (tab: "history" | "analytics") => void;
};

const ViewTabs = ({ activeTab, onChange }: ViewTabsProps) => {
  const tabs: Array<{
    key: "history" | "analytics";
    label: string;
    icon: string;
  }> = [
    { key: "history", label: "History", icon: "📋" },
    { key: "analytics", label: "Analytics", icon: "📊" },
  ];

  return (
    <div className="flex rounded-2xl border border-slate-800/70 bg-slate-900/80 p-1">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={`flex-1 rounded-xl cursor-pointer px-3 py-2 text-sm font-medium transition ${
            activeTab === tab.key
              ? "bg-emerald-500 text-slate-950"
              : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          }`}
        >
          <span className="mr-2">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default ViewTabs;
