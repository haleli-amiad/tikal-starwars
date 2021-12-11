export default function Chart({ data }) {
  return (
    <div>
      <ul>
        {data.chart.map((planet) => (
          <li key={planet.name}>
            {planet.population}
            <div style={{ height: `${planet.population / 10000000}px` }} />
            {planet.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
