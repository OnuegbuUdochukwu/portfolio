const languages = [
  { name: "Java", percentage: 36, color: "#b07219" },
  { name: "Python", percentage: 24, color: "#3572A5" },
  { name: "TypeScript", percentage: 15, color: "#3178C6" },
  { name: "JavaScript", percentage: 12, color: "#F7DF1E" },
  { name: "HTML", percentage: 6, color: "#E34F26" },
  { name: "Other", percentage: 7, color: "#7C7B79" },
];

export default function LanguageBar() {
  return (
    <div className="w-full">
      <div className="flex h-1.5 rounded-full overflow-hidden">
        {languages.map((lang) => (
          <div
            key={lang.name}
            style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
            className="first:rounded-l-full last:rounded-r-full opacity-70"
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
        {languages.map((lang) => (
          <span key={lang.name} className="font-mono text-[10px] text-fg-muted flex items-center gap-1">
            <span
              className="inline-block w-1.5 h-1.5 rounded-sm"
              style={{ backgroundColor: lang.color }}
            />
            {lang.name} {lang.percentage}%
          </span>
        ))}
      </div>
    </div>
  );
}
