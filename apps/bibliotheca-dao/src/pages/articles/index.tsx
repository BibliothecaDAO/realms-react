import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';

export interface PostMetadata {
  title: string;
  date: string;
  subtitle: string;
  slug: string;
  image: string;
  tags: string[];
  author: string;
}

const PostPage = () => {
  const [post, setPosts] = useState<any[]>();

  useEffect(() => {
    const getAllPosts = async () => {
      const response = await fetch('/api/getAllPosts');
      const data = await response.json();
      setPosts(data);
    };
    getAllPosts();
  });

  return (
    <MainLayout>
      <div className="max-w-2xl px-6 mx-auto my-20 md:my-40">
        <h3 className="mb-8">Building Autonmous Worlds</h3>
        <div className="flex flex-col w-full space-y-3">
          {post?.map((a, index) => {
            return <PostPreview key={index} {...a} />;
          })}
        </div>
      </div>
    </MainLayout>
  );
};

export default PostPage;

const PostPreview = (props: PostMetadata) => {
  return (
    <Link
      href={`/articles/${props.slug}`}
      className="flex capitalize transition-all duration-300 border border-dashed rounded border-white/20 hover:bg-gray-900 hover:border-solid "
    >
      {/* <img
        className="object-fill w-32 h-32 rounded-l"
        src={props.image}
        alt=""
      /> */}
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
