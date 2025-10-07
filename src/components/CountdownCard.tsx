type Props = { label?: string; time: string };
export default function CountdownCard({ label = "De bidding", time }: Props) {
  return (
    <div className="rounded-xl bg-slate-100 px-4 py-3 text-center">
      <div className="text-xl font-semibold">{time}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}
