import Link from 'next/link';
import type { PostMetadata } from '@/types/index';

export const ArticlePreview = (props: PostMetadata) => {
  return (
    <Link
      href={`/articles/${props.id}`}
      className="flex capitalize transition-all duration-300 border border-dashed rounded border-white/20 hover:bg-gray-900 hover:border-solid "
    >
      <div className="p-4 align-center">
        <p className="text-sm text-gray-500">{props.date}</p>

        <h2>{props.title}</h2>
        <h5>{props.author}</h5>
        <div className="flex mt-3 space-x-2">
          {props.tags.map((tag, index) => {
            return (
              <span
                key={index}
                className="p-1 px-3 text-sm uppercase border rounded-full border-white/20"
              >
                {tag}
              </span>
            );
          })}
        </div>
      </div>
    </Link>
  );
};
