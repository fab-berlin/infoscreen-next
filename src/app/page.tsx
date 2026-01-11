import Image from "next/image";
import Weather from "@/components/widgets/Weather/Weather";
import Windows from "@/components/widgets/Windows/Windows";

export default function Home() {
  return (
    <main>
      <section className={''}>
        <Image src={"/assets/backgrounds/Flow 2.jpg"} alt={'Background Image'} width={1920} height={1080} className={'absolute object-cover size-full'}/>
      </section>
      <section className="container content-container mx-auto relative z-0 py-8">
        <section className={'grid grid-cols-3 gap-x-4'}>
          <h1 className={'col-start-1 col-span-1 bg-red-50'}>Willkommen bei SchulApp</h1>
          <section className={'col-start-2 col-span-1 '}>
            <Windows />
          </section>
          <section className={'col-start-3 col-span-1'}>
            <Weather />
          </section>
        </section>
      </section>
    </main>
  );
}
