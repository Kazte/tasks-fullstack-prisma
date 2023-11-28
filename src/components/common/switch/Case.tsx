interface Props {
  condition: boolean;
  children: React.ReactNode;
}

export default function Case({ children, condition }: Props) {
  condition;
  return <>{children}</>;
}
