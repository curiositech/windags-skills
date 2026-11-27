import "./example-chart.css";

const weeks = ["Apr 6", "Apr 13", "Apr 20", "Apr 27", "May 4", "May 11"] as const;
const series = [
  { name: "Search", values: [34, 41, 39, 46, 50, 58] },
  { name: "Referral", values: [25, 22, null, 29, 27, 34] },
  { name: "Email", values: [14, 19, 28, 25, 34, 41] },
] as const;

const plot = { left: 32, right: 262, top: 12, bottom: 107, max: 60 };
const ticks = [0, 30, 60] as const;

/** Return the same position for a date or value in every panel. */
const xFor = (index: number) => plot.left + index * (plot.right - plot.left) / (weeks.length - 1);
const yFor = (value: number) => plot.bottom - value * (plot.bottom - plot.top) / plot.max;

/** Use a new move command after a missing value so the line never implies an observation. */
function lineFor(values: readonly (number | null)[]) {
  return values.map((value, index) => {
    if (value === null) return "";
    const command = index === 0 || values[index - 1] === null ? "M" : "L";
    return `${command}${xFor(index)} ${yFor(value)}`;
  }).join(" ");
}

/** A responsive editorial chart with small multiples and a table from the same data. */
export function EditorialSignupReport() {
  return (
    <figure className="signup-report" aria-label="Weekly signup report">
      <figcaption className="signup-report__caption">
        <span className="signup-report__date">April 6–May 11</span>
        <h2>Search led signups all six weeks</h2>
        <p>Email gained 27 weekly signups, the largest increase of the three channels shown.</p>
      </figcaption>

      <div className="signup-report__facets">
        {series.map(({ name, values }) => (
          <div className="signup-report__panel" key={name}>
            <h3>{name}</h3>
            <svg viewBox="0 0 280 142" role="img" aria-label={`${name}, weekly signups, shared scale from 0 to 60. Values are in the data table.`}>
              {ticks.map((value) => (
                <g key={value}>
                  <line x1={plot.left} x2={plot.right} y1={yFor(value)} y2={yFor(value)} className="signup-report__rule" />
                  <text x={24} y={yFor(value) + 4} textAnchor="end">{value}</text>
                </g>
              ))}
              <path d={lineFor(values)} className="signup-report__line" />
              {values.map((value, index) => value === null ? null : (
                <circle key={weeks[index]} cx={xFor(index)} cy={yFor(value)} r={3} className="signup-report__point" />
              ))}
              <text x={plot.left} y="129">{weeks[0]}</text>
              <text x={plot.right} y="129" textAnchor="end">{weeks.at(-1)}</text>
            </svg>
            {name === "Referral" && <p className="signup-report__note">April 20 is missing.</p>}
          </div>
        ))}
      </div>
      <p className="signup-report__source">Illustrative data. Counts are signups per week. All panels use the same scale.</p>
      <details className="signup-report__data">
        <summary>View all values</summary>
        <table>
          <caption>Weekly signups by channel</caption>
          <thead>
            <tr><th scope="col">Week</th>{series.map(({ name }) => <th key={name} scope="col">{name}</th>)}</tr>
          </thead>
          <tbody>
            {weeks.map((week, index) => (
              <tr key={week}>
                <th scope="row">{week}</th>
                {series.map(({ name, values }) => <td key={name}>{values[index] ?? "Missing"}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
