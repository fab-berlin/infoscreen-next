import Weather from '@/components/widgets/Weather/Weather';
import Windows from '@/components/widgets/Windows/Windows';
import Configuration from '@/components/widgets/Configuration/Configuration';

export default function Home() {
  return (
    <main>
      <section className="content-container relative z-0 container mx-auto py-8">
        <section className={'grid grid-cols-3 gap-x-4'}>
          <section className={'col-span-1 col-start-1'}>
            <Configuration />
          </section>
          <section className={'col-span-1 col-start-2'}>
            <Windows />
          </section>
          <section className={'col-span-1 col-start-3'}>
            <Weather />
          </section>
        </section>
      </section>
    </main>
  );
}
