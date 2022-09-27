import { CheckCircle, Scroll } from '@/shared/Icons';

const TxAddedToQueueLabel = () => {
  return (
    <div className="flex ml-2 text-xs ">
      {' '}
      <Scroll className="inline-block w-8 mr-2 animate-pulse fill-green-300" />{' '}
      Commanded by
      <br /> Royal Decree
    </div>
  );
};

export default TxAddedToQueueLabel;
