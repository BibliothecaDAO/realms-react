import { ArticlePreview } from '@/components/articles/ArticlePreview';
import { MainLayout } from '@/components/layout/MainLayout';
import { getSortedArticlesData } from '@/hooks/articles';

export async function getStaticProps() {
  const allArticlesData = getSortedArticlesData();
  return {
    props: {
      allArticlesData,
    },
  };
}

const ArticlePage = ({ allArticlesData }: any) => {
  return (
    <MainLayout>
      <div className="max-w-2xl px-6 mx-auto my-20 md:my-40">
        <h3 className="mb-8">Building Autonomous Worlds</h3>
        <div className="flex flex-col w-full space-y-3">
          {allArticlesData?.map((a: any, index: any) => {
            return <ArticlePreview key={index} {...a} />;
          })}
        </div>
      </div>
    </MainLayout>
  );
};

export default ArticlePage;
