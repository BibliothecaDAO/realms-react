import { Button } from '@bibliotheca-dao/ui-lib';

interface Props {
  id: number;
}

export const DownloadAssets = (props: Props) => {
  return (
    <div className="flex mt-4 space-x-2 rounded">
      <Button
        className="w-full text-xs"
        target={'_blank'}
        size="xs"
        variant="outline"
        href={`https://realms-assets.s3.eu-west-3.amazonaws.com/${props.id}.zip`}
        rel="noreferrer"
      >
        Download cc0 assets
      </Button>
    </div>
  );
};
