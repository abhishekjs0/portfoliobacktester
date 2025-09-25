import { roadmapMilestones } from "../../../lib/marketing-content";

const statusToLabel: Record<string, string> = {
  complete: "Complete",
  "in-progress": "In progress",
  "up-next": "Up next",
  planned: "Planned",
};

export default function RoadmapPage() {
  return (
    <div className="marketing-page">
      <header className="marketing-hero">
        <div className="landing-container">
          <span className="landing-badge">Roadmap</span>
          <h1 className="marketing-hero__title">
            Twelve-week MVP plan to deliver multi-symbol backtesting
          </h1>
          <p className="marketing-hero__sub">
            Track our weekly milestones as we move from discovery to beta
            launch. Feedback from power-users continually shapes what ships
            next.
          </p>
        </div>
      </header>

      <section className="marketing-section" aria-labelledby="timeline-heading">
        <div className="landing-container">
          <h2 id="timeline-heading" className="landing-section-title">
            Execution timeline
          </h2>
          <ol className="roadmap-list">
            {roadmapMilestones.map((item: typeof roadmapMilestones[number]) => (
              <li
                key={item.title}
                className={`roadmap-item roadmap-item--${item.status}`}
              >
                <div className="roadmap-item__header">
                  <span className="roadmap-item__badge">{item.quarter}</span>
                  <span className="roadmap-item__status">
                    {statusToLabel[item.status]}
                  </span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
