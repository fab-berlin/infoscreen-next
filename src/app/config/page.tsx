import ConfigSensorsList from "@/components/widgets/ConfigSensorsList/ConfigSensorsList";

export default function Config() {

  return (<main>
    <section className="container content-container grid grid-cols-2 mx-auto relative z-0 py-8 gap-4">
      <section className="col-start-1 col-span-1">
        <ConfigSensorsList />
      </section>
    </section>
  </main>)
}
