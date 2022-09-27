import { SearchFilter } from '@/components/filters/SearchFilter';

interface Props {
  heading: string;
  action: (value) => void;
  searchFilterValue: string;
}

export const PanelHeading = (props: Props) => {
  return (
    <div className="flex flex-wrap justify-between px-3 pt-20 sm:px-6">
      {/* <Link href="/">
      <button className="z-50 transition-all rounded top-4">
        <Close />
      </button>
    </Link> */}
      <h1>{props.heading}</h1>
      <div className="w-full my-1 sm:w-auto">
        <SearchFilter
          placeholder="SEARCH BY ID"
          onSubmit={(value) => {
            props.action(parseInt(value) ? value : '');
          }}
          defaultValue={props.searchFilterValue + ''}
        />
      </div>
    </div>
  );
};
