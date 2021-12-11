export default function Table({ data }) {
  return (
    <table>
      <tbody>
        <tr>
          <td>Vehicle name with the largest sum:</td>
          <td>{data.vehicle}</td>
        </tr>
        <tr>
          <td>Related home planets and their respective population:</td>
          <td>
            {data.planets.map((planet) => (
              <span key={planet.name}>
                {planet.name}, {planet.population}
              </span>
            ))}
          </td>
        </tr>
        <tr>
          <td>Related pilot names:</td>
          <td>
            {data.pilotNames.map((name) => <span key={name}>{name}</span>)}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
