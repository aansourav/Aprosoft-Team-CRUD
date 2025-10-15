interface IconProps {
  name: string;
  className?: string;
}

export function Icon({ name, className = "" }: IconProps) {
  return <img src={`/icons/${name}.svg`} alt={name} className={className} />;
}
