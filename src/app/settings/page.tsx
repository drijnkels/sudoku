import SettingsList from "@/components/Settings/SettingsList";

const Page = () => {

  return (
    <div className='p-12 w-full h-full flex-1 flex flex-col'>
      <div className='w-full mb-4 text-slate-200'><a href='/'>{'<-- Return to menu'}</a></div>

      <SettingsList />
    </div>
  )
}

export default Page;