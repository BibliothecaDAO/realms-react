import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import CheckRewards from '@/components/minigame/CheckRewards';
import { getLatestGameIndex } from '@/util/minigameApi';

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const latestIndex = await getLatestGameIndex();
    return {
      props: {
        latestIndex,
      }, // will be passed to the page component as props
    };
  } catch (e) {
    return { props: {} };
  }
};

const Rewards: NextPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => <CheckRewards initialGameIndex={props.latestIndex} />;

export default Rewards;
