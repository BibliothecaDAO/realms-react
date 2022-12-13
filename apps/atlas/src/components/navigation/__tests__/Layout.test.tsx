import Layout from '@/components/Layout';
import { render, screen } from '@/test-utils';

describe('main layout tests', () => {
  it('should render children', async () => {
    render(
      <Layout>
        <div role="article">Hello</div>
      </Layout>
    );
    const appContent = screen.getByRole('article');
    expect(appContent).toHaveTextContent('Hello');
  });
});
