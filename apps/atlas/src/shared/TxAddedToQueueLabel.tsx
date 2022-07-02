import { CheckCircle } from '@/shared/Icons';

const TxAddedToQueueLabel = () => {
  return (
    <div className="flex ml-2 text-xs text-white">
      {' '}
      <CheckCircle className="inline-block w-4 mr-2 text-green-300" /> Added to
      <br /> Transaction Cart
    </div>
  );
};

export default TxAddedToQueueLabel;
