'use client';

import { useWindowsStore } from '@/stores';
import { useEffect } from 'react';

const Windows = () => {
  const { windowsList, loadWindowsList } = useWindowsStore();

  const loadData = async () => {
    await loadWindowsList();
  };
  useEffect(() => {
    loadData();

    setInterval(() => {
      loadData();
    }, 5000); // Refresh data every 5 seconds
  }, []);

  return (
    <section className="mb-4 border border-white p-4 text-white filter backdrop-blur-lg">
      <h2 className="mb-4 text-xl">Sensorübersicht Fenster & Türen</h2>
      <hr className={'mb-4'}></hr>
      {windowsList && windowsList.length > 0 && (
        <ul>
          {windowsList.map((item) => (
            <li key={item.uid}>
              <p className={'flex flex-row items-center gap-2'}>
                <span
                  className={`inline-block size-4 rounded-full ${item.status === '0' ? 'bg-green-500' : 'bg-red-500'}`}
                ></span>
                {item.uid}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
export default Windows;
