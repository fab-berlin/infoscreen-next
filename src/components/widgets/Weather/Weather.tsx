'use client';

import {useWeatherStore} from "@/stores";
import {useEffect} from "react";
import OutsideWeatherDetail from "@/components/molecules/OutsideWeatherDetail/OutsideWeatherDetail";
import RoomDetail from "@/components/molecules/RoomDetail/RoomDetail";

const Weather = () => {
  const {loadSensorData, loadOwmWeather, sensorData, owmData, outsideSensorData} = useWeatherStore();

  const loadData = async () => {
    await loadOwmWeather();
    await loadSensorData();

  }
  useEffect(() => {
    loadData();

    setInterval(() => {
      loadData();
    }, 60000); // Refresh data every 60 seconds
  }, []);

  return (<>
    <section className="p-4 border border-white filter backdrop-blur-lg text-white mb-4">
      <div className="flex flex-col mb-4">
        <span className="text-xl">{owmData.description}</span>
        <span className="text-4xl">{outsideSensorData.temperature}°C</span>
      </div>
      <section className="grid grid-cols-3">
        <OutsideWeatherDetail value={outsideSensorData.humidity} label={"Luftfeuchtigkeit"} lastItem={false} />
        <OutsideWeatherDetail value={owmData.temp_min} label={"min"} lastItem={false} />
        <OutsideWeatherDetail value={owmData.temp_max} label={"max"} lastItem={true} />
      </section>
    </section>
    <section className="grid grid-cols-2 gap-4">
      <ul className="contents">
        {sensorData.map((item, index) => <li key={index}><RoomDetail name={item.name} humidity={item.humidity} temperature={item.temperature} /></li>)}
      </ul>
    </section>
  </>)
}

export default Weather;
