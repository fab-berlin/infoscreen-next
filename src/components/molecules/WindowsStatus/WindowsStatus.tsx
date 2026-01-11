const WindowsStatus = ({uid, status}: {uid: string, status: string}) => {

  return <p className={'flex flex-row gap-2'}>
    <span className={`size-4 rounded-full inline-block  ${status === "0" ? 'bg-green-500': 'bg-red-500'}`}></span>
    {uid}</p>
}

export default WindowsStatus;
