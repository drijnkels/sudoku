'use client'

import {clearAppData} from "@/scripts/persistence";
import Button from "@/components/Form/Button";

const SettingsList = () => {
  const handleClearAppData = () => {
    clearAppData();
  }

  return (
    <div className='w-fit flex flex-col gap-4 max-w-lg min-w-32 mx-auto'>
      <div className='text-center font-semibold text-lg'>Settings</div>
      <div className='text-sm text-center'>
        <Button variant={'delete_secondary'} onClick={() => handleClearAppData()}>
          Clear app data
        </Button>
      </div>
    </div>
  );
};

export default SettingsList;