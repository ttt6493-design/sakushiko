interface ValuePropsProps {
  t: {
    prop1Title: string;
    prop1Desc: string;
    prop2Title: string;
    prop2Desc: string;
    prop3Title: string;
    prop3Desc: string;
  };
}

export default function ValueProps({ t }: ValuePropsProps) {
  const props = [
    { icon: '🚫', title: t.prop1Title, desc: t.prop1Desc },
    { icon: '🎬', title: t.prop2Title, desc: t.prop2Desc },
    { icon: '⚡', title: t.prop3Title, desc: t.prop3Desc },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
      {props.map((prop) => (
        <div
          key={prop.title}
          className="bg-card rounded-lg p-3 sm:p-4 text-center"
        >
          <div className="text-2xl mb-1.5">{prop.icon}</div>
          <h3 className="text-xs sm:text-sm font-bold text-foreground mb-0.5">
            {prop.title}
          </h3>
          <p className="text-[10px] sm:text-xs text-muted leading-tight">
            {prop.desc}
          </p>
        </div>
      ))}
    </div>
  );
}
