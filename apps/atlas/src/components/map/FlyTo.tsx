import type { AssetFilter } from '@/hooks/useUIContext';
import { AssetFilters, useUIContext } from '@/hooks/useUIContext';

export const FlyTo = () => {
  const {
    selectedAssetFilter,
    setSelectedAssetFilter,
    selectedId,
    setSelectedId,
    gotoAssetId,
  } = useUIContext();

  function onChangeId(event: any) {
    let tokenId = parseInt(event.target.value);
    if (tokenId < 1) {
      tokenId = 1;
    } else {
      tokenId = Math.min(selectedAssetFilter.maxId, tokenId);
    }
    setSelectedId(tokenId + '');
  }

  return (
    <div className="absolute z-10 flex w-full h-10 px-4 text-xl bottom-16 sm:top-10 sm:right-36 sm:z-30 sm:w-96">
      <input
        placeholder="Type Id"
        type={'number'}
        className="w-3/12 px-4 py-4 text-black rounded-l-xl bg-white/80"
        value={selectedId}
        onChange={onChangeId}
        min="1"
        max={selectedAssetFilter.maxId}
      />
      <button
        className="w-4/12 p-1 px-4 uppercase transition-all duration-300 text-off-100 bg-off-200/20 hover:bg-off-200/60"
        onClick={() => gotoAssetId(selectedId, selectedAssetFilter.value)}
      >
        Fly to
      </button>

      <select
        className="w-5/12 p-1 px-4 mr-2 uppercase transition-all duration-300 cursor-pointer text-off-100 bg-off-200/50 rounded-r-xl font-display"
        value={selectedAssetFilter.value}
        onChange={(event) =>
          setSelectedAssetFilter(
            AssetFilters.find(
              (assetFilter: AssetFilter) =>
                assetFilter.value === event.target.value
            ) as AssetFilter
          )
        }
      >
        {AssetFilters.map((assetFilter) => (
          <option key={assetFilter.value} value={assetFilter.value}>
            {assetFilter.name}
          </option>
        ))}
      </select>
    </div>
  );
};
