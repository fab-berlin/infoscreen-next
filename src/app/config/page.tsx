import ConfigSensorsList from '@/components/widgets/ConfigSensorsList/ConfigSensorsList';

export default function Config() {
  return (
    <main>
      <section className="content-container relative z-0 container mx-auto grid grid-cols-2 gap-4 py-8">
        <section className="col-span-2 col-start-1 lg:col-span-1">
          <ConfigSensorsList />
        </section>
      </section>
    </main>
  );
}
