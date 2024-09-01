import Modal from "@/components/Overlay/Modal";
import Button from "@/components/Form/Button";
import TextArea from "@/components/Form/TextArea";

type DialogProps = {
  title: string;
  content: string;
  showReason?: boolean;
  setReason: (reason: string) => void;
  action: () => void;
  onClose: () => void;
}

const Dialog = ({title, content, showReason = false, setReason, action, onClose}: DialogProps) => {
  return (
    <Modal title={title} size={'md'} onClose={onClose}>
      <div className='flex flex-col gap-4'>
        <div>{content}</div>
        {
          showReason &&
          <div>
            <TextArea
              name={'reason'}
              onChange={(value) => setReason(value)}
              defaultValue={''}
              placeholder={'Optionally your reason, will be shared if given'}
            />
          </div>
        }
        <div className='flex gap-2'>
          <Button onClick={() => action()}>Confirm</Button>
          <Button onClick={() => onClose()}>Cancel</Button>
        </div>
      </div>
    </Modal>
  );
};

export default Dialog;