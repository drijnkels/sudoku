import {XMarkIcon} from "@heroicons/react/16/solid";
import Blanket from "@/components/Overlay/Blanket";
import Typography from "../Text/Typography";

export const Drawer = ({ title, children, onClose, side = 'right' }: {title?: string, children: React.ReactNode, onClose: () => void, side?: string}) => {
  return (
    <Blanket onClickOutside={onClose}>
      <div className={`absolute top-0 h-full w-full md:w-1/2 lg:w-1/3 ${side}-0 flex flex-col border border-zinc-300 shadow-2xl shadow-black/25 rounded-l-2xl bg-zinc-100 overflow-hidden`}>
        <div className='flex items-center justify-between p-4 bg-white rounded-tl-2xl border-b border-zinc-300'>
          <Typography variant='h3' weight='semibold'>{title}</Typography>
          <div onClick={onClose} className={`group cursor-pointer flex justify-center items-center`}>
            <div className='rounded-md flex items-center gap-1.5 group-hover:bg-zinc-200 px-2 py-2 transition-colors'>
              <Typography variant="p" weight="semibold">Close</Typography>
              <XMarkIcon className='h-6 w-6' />
            </div>
          </div>
        </div>
        <div className='flex-1 p-4 overflow-y-auto'>
          {children}
        </div>
      </div>
    </Blanket>
  );
};