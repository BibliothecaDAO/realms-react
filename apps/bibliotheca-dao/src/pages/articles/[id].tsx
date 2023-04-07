import { Button } from '@bibliotheca-dao/ui-lib/base';
import { MainLayout } from '@/components/layout/MainLayout';
import { getAllArticleIds, getArticleData } from '@/hooks/articles';

export async function getStaticPaths() {
  const paths = getAllArticleIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: any) {
  const post = await getArticleData(params.id);
  return {
    props: {
      post,
    },
  };
}

const PostPage = ({ post }: any) => {
  return (
    <MainLayout>
      <div className="py-10 text-center sm:mt-6">
        {post && <h1 className="py-8 sm:py-20">{post.title}</h1>}
        {post && <p className="mt-2">{post.date}</p>}
        {post && <p className="mt-2">{post.author}</p>}

        {post && post.tags && (
          <div className="container mx-auto">
            <div className="flex justify-center mt-3 space-x-2">
              {post.tags.map((tag: any, index: any) => {
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
        <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
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
