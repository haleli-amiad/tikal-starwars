import { swapiService } from './services/swapi-service';
import { useEffect, useState } from 'react';
import Table from './components/Table';
import Chart from './components/Chart';
import Lottie from "lottie-react";
import Yoda from "./assets/lottie/yoda.json";

export default function App() {

  const [data, setData] = useState(null);

  useEffect(() => {
    getData();
    return () => {
    }
  }, [])

  const getData = async () => {
    try {
      var res = await swapiService.initSwapi();
    } catch (error) {
      console.log('error retrieving data:', error);
    } finally {
      setData(res);
    }
  }

  return (data &&
    <div className="App main-layout">
      <h1>Swapi Challenge</h1>
      <Table data={data} />
      <div className="flex space mobile-wrap">
        <Chart data={data} />
        <Lottie animationData={Yoda} className="lottie" />
      </div>
    </div>
  );
}