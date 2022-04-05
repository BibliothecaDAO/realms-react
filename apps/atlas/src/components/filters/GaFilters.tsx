import { BagRatingFilter } from '@/components/filters/BagRatingFilter';
import { useGaContext } from '@/context/GaContext';

export function GaFilters() {
  const gaCtx = useGaContext();

  return (
    <div className="flex justify-between">
      <div>Search</div>
      <div className="flex mb-4">
        <BagRatingFilter
          rating={gaCtx.state.ratingFilter}
          onChange={gaCtx.actions.updateRatingFilter}
        />
      </div>
    </div>
  );
}
