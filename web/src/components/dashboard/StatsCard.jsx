export default function StatsCard({ title, value, helper }) {
  return (
    <div className="stats-card">
      <h3>{title}</h3>
      <p>{value}</p>
      {helper ? <span className="stats-card__helper">{helper}</span> : null}
    </div>
  );
}
