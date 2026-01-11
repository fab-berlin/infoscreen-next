'use client';

import {useWindowsStore} from "@/stores";
import {useEffect} from "react";

const Windows = () => {
  const {windowsList, loadWindowsList} = useWindowsStore();

  const loadData = async () => {
    await loadWindowsList();
  }
  useEffect(() => {
    loadData();

    setInterval(() => {
      loadData();
    }, 5000); // Refresh data every 5 seconds
  }, []);



  return (<section className="p-4 border border-white filter backdrop-blur-lg text-white mb-4">
    <h2 className="text-xl">Sensorübersicht Fenster & Türen</h2>
    {windowsList && windowsList.length > 0 && (
      <ul>
        {windowsList.map(item => <li key={item.uid}>
          <p className={'flex flex-row gap-2 items-center'}>
            <span className={`size-4 rounded-full inline-block  ${item.status === "0" ? 'bg-green-500': 'bg-red-500'}`}></span>
            {item.uid}
          </p>
        </li>)}
      </ul>
    )}
  </section>)
}
export default Windows;
