// pages/api/compile-mdx.js
import { serialize } from 'next-mdx-remote/serialize';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  try {
    const { mdx } = req.body;
    if (!mdx) {
      res.status(400).json({ error: 'No MDX provided' });
      return;
    }
    // Compile the MDX content.
    const mdxSource = await serialize(mdx, {
      // Optionally, pass MDX options (remark/rehype plugins, etc.)
      // mdxOptions: { ... },
    });
    res.status(200).json({ mdxSource });
  } catch (error) {
    console.error('Error compiling MDX:', error);
    res.status(500).json({ error: error.message });
  }
}
