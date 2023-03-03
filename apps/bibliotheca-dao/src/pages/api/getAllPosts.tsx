import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// export function getPostContent(slug: string) {
//   const folder = 'src/content/';
//   const file = `${folder}${slug}.md`;
//   const content = fs.readFileSync(file, 'utf8');
//   const matterResult = matter(content);
//   return matterResult;
// }

export default (req: any, res: any) => {
  // Let's say your json is in /public/assets/my-json.json

  const folder = 'src/content/';
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

  // const json = fs.readFileSync(filePath);

  res.statusCode = 200;
  res.json(posts);
};
