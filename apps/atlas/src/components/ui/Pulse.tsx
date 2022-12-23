export const Pulse = ({ pulse = false, active = false }) => {
  return (
    <span
      className={`self-center w-3 h-3 ml-2  border rounded-full ${
        active ? 'border-green-500 bg-green-900' : 'border-red-500 bg-red-900'
      } rounded-full ${pulse && 'animate-pulse'}`}
    />
  );
};
