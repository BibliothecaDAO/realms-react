import { useRouter } from 'next/router';

interface Props {
  title: string | 'Title';
  skills: string[];
  location: string;
}

export const JobCard = (props: Props) => {
  const router = useRouter();
  return (
    <div
      aria-hidden="true"
      onClick={() =>
        router.push(`/jobs/${props.title.replace(' ', '-').toLowerCase()}`)
      }
      className=" cursor-pointer p-8 border border-white hover:bg-white hover:text-black transition-all duration-300 bg-gray-1000"
    >
      <h4>Location: {props.location}</h4>
      <h2>{props.title}</h2>
    </div>
  );
};
