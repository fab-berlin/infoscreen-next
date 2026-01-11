type RoomDetailProps = {
  name: string;
  temperature: string;
  humidity: string;
}

const RoomDetail = ({name, temperature, humidity}:RoomDetailProps) => {
  return <div className="p-4 border border-white filter backdrop-blur-lg text-white">
    <p className="text-lg font-bold">{name}</p>
    <p className="text-4xl">{temperature}</p>
    <p className="text-xs mb-4">aktuelle Temperatur</p>
    <p className="text-xl">{humidity}</p>
    <p className="text-xs">relative Luftfeuchtigkeit</p>
  </div>;
}

export default RoomDetail;
