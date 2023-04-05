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

  //   console.log(req);
  const folder = 'public/';
  const file = `${folder}${req.query.slug}.md`;
  const content = fs.readFileSync(file, 'utf8');

  // const json = fs.readFileSync(filePath);

  res.statusCode = 200;
  res.json(content);
};
