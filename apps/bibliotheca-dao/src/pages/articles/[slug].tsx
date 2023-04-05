import { Button } from '@bibliotheca-dao/ui-lib/base';
import matter from 'gray-matter';
import Markdown from 'markdown-to-jsx';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';

const PostPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState<any>();

  useEffect(() => {
    const getPost = async () => {
      const response = await fetch(`/api/getPosts?slug=${slug}`);
      const data = await response.json();
      setPost(matter(data));
    };
    getPost();
  }, [slug]);

  return (
    <MainLayout>
      <div className="py-10 text-center sm:mt-6">
        {post && <h1 className="py-8 sm:py-20">{post.data.title}</h1>}
        {post && <p className="mt-2">{post.data.date}</p>}
        {post && <p className="mt-2">{post.data.author}</p>}

        {post && post.data.tags && (
          <div className="container mx-auto">
            <div className="flex justify-center mt-3 space-x-2">
              {post.data.tags.map((tag: any, index: any) => {
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
        )}
      </div>

      <article className="container px-6 pb-6 mx-auto prose bg-gray-900 border border-dashed border-white/5">
        {post && <Markdown>{post.content}</Markdown>}
      </article>
      <div className="container p-3 mx-auto w-72">
        <Button href="/articles" variant="dao">
          Back To Articles
        </Button>
      </div>
    </MainLayout>
  );
};

export default PostPage;
