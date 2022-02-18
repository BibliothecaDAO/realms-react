import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import ShieldGame from "~/components/minigame/ShieldGame";
import { getLatestGameIndex, getTotalElementsMinted } from "~/util/minigameApi";
import Game from "./index";

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const latestIndex = await getLatestGameIndex();
    const { light, dark } = await getTotalElementsMinted(parseInt(latestIndex));
    return {
      props: {
        light,
        dark,
        primary: light > dark ? "light" : "dark",
        url: context.resolvedUrl,
      }, // will be passed to the page component as props
    };
  } catch (e) {
    return { props: {} };
  }
};

export default (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => (
  <Game
    title={`The ${props.primary} Elements are strong`}
    openGraphUrl={props.url}
    openGraphDescription={`${props.light} light and ${props.dark} have been distilled for the next Desiege`}
  >
    <ShieldGame />
  </Game>
);
