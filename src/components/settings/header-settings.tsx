type HeaderSettingsProps = {
  title: string;
  subTitle: string;
};

export function HeaderSettings({ title, subTitle }: HeaderSettingsProps) {
  return (
    <header>
      <h1 className="text-lg font-semibold capitalize leading-none tracking-tight lg:text-xl">
        {title}
      </h1>
      <h4 className="mt-2 text-xs font-semibold text-slate-400">{subTitle}</h4>
    </header>
  );
}
