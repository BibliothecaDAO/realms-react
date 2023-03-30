export const BastionCard = ({ event }) => {
  return (
    <div className="flex max-w-max p-1 m-2 border-[1px] border-white rounded-xl bg-[#3d3d37] items-center">
      <div className="p-1 border-[1px] border-white rounded-xl h-fit">
        {event.icon}
      </div>
      <div className="p-1 w-3/4 text-xs">{event.event}</div>
    </div>
  );
};
