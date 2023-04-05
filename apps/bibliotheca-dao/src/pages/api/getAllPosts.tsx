import fs from 'fs';
import matter from 'gray-matter';

export default (req: any, res: any) => {
  const folder = '/';
  const files = fs.readdirSync(folder);
  const markdownPosts = files.filter((file) => file.endsWith('.md'));

  // Get gray-matter data from each file.
  const posts = markdownPosts.map((fileName) => {
    const fileContents = fs.readFileSync(`${folder}${fileName}`, 'utf8');
    const matterResult = matter(fileContents);
    return {
      title: matterResult.data.title,
      date: matterResult.data.date,
      subtitle: matterResult.data.subtitle,
      slug: fileName.replace('.md', ''),
      image: matterResult.data.image,
      tags: matterResult.data.tags,
      author: matterResult.data.author,
    };
  });

  res.statusCode = 200;
  res.json(posts);
};
