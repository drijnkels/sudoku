const Page = () => {
  return (
    <div className='p-12 w-full h-full flex-1 flex flex-col'>
      <div className='w-full mb-4 text-slate-400'><a href='/'>{'<-- Return to menu'}</a></div>

      <div className='w-fit flex flex-col gap-4 max-w-lg min-w-32 mx-auto'>
        <div className='text-center font-semibold text-lg'>About</div>
        <div>
          <div>Work in Progress</div>
        </div>
      </div>
    </div>
  )
}

export default Page