type OutsideWeatherDetailProps = {
  value: string|number;
  label: string;
  lastItem?: boolean;
}

const OutsideWeatherDetail = ({value, label, lastItem}: OutsideWeatherDetailProps) => {
  return (<div className={`flex flex-col pr-4 mr-4 ${!lastItem && 'border-r'}`}>
    <span className="text-lg">{value}</span>
    <span className="text-xs font-bold">{label}</span>
  </div>)
}

export default OutsideWeatherDetail;
