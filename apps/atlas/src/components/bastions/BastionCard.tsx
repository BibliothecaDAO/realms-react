export const BastionCard = ({ event }) => {
  return (
    <div className="flex max-h-[70px] hover:scale-105 transition-all duration-450 p-1 mx-2 my-1 border-[1px] border-white rounded-xl bg-[#3d3d37] items-center">
      <div className="p-1 border-[1px] border-white rounded-xl h-fit">
        {event.icon}
      </div>
      <div className="p-1 w-4/4 text-xs">{event.event}</div>
    </div>
  );
};
