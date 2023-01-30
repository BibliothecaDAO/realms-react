export const BuildingUtilisation = ({
  totalSpace,
  buildings,
  storehouse,
  projectedStorehouseSpace,
  projectedBuildingSpace,
}) => {
  const getWidth = (width) => {
    return (width / (totalSpace || 0)) * 100;
  };

  const isOverFlowing =
    buildings + storehouse + projectedBuildingSpace + projectedStorehouseSpace >
    totalSpace;

  const getColor = (color) => {
    return isOverFlowing
      ? 'bg-red-900'
      : color + ' border-frame-primary border-r';
  };

  return (
    <div className="relative w-full h-2 mb-3">
      {isOverFlowing && (
        <span className="absolute left-0 text-red-600 top-3 max-auto">
          {' '}
          Overflow! Remove buildings or Storehouses{' '}
        </span>
      )}
      {!isOverFlowing && <span className="absolute left-0 top-2">0</span>}
      {!isOverFlowing && (
        <span className="absolute right-0 top-2">{totalSpace}</span>
      )}

      <div
        className={`absolute flex w-full border  bg-white/30 ${
          isOverFlowing ? 'bg-red-100' : 'border-frame-primary/50 '
        }`}
      >
        <div
          className={`${getColor('bg-amber-800/50')} relative h-2  `}
          style={{
            width: `${getWidth(buildings)}%`,
          }}
        >
          {!isOverFlowing && (
            <span className="absolute right-0 top-1">{buildings}</span>
          )}
        </div>

        {projectedBuildingSpace > 0 && (
          <div
            className={`${getColor('bg-amber-800')} relative h-2`}
            style={{
              width: `${getWidth(projectedBuildingSpace)}%`,
            }}
          >
            {!isOverFlowing && (
              <span className="absolute right-0 top-1">
                {projectedBuildingSpace.toFixed()} new
              </span>
            )}
          </div>
        )}
        <div
          className={`${getColor('bg-green-800/50')} relative h-2  `}
          style={{
            width: `${getWidth(storehouse)}%`,
          }}
        >
          {!isOverFlowing && (
            <span className="absolute right-0 top-1">
              {storehouse.toFixed()}
            </span>
          )}
        </div>
        {projectedStorehouseSpace > 0 && (
          <div
            className={`${getColor('bg-green-800')} relative h-2   `}
            style={{
              width: `${getWidth(projectedStorehouseSpace)}%`,
            }}
          >
            {!isOverFlowing && (
              <span className="absolute right-0 top-1">
                {projectedStorehouseSpace.toFixed()} new
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
