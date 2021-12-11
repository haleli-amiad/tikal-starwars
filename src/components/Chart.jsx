export default function Chart({ data }) {
  return (
    <div className="chart">
      <ul className="flex center">
        {data.chart.map((planet) => (
          <li key={planet.name}>
            <h5>{planet.population}</h5>
            <div style={{ height: `${planet.population / 10000000}px` }} />
            <p>
              {planet.name}
              </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
