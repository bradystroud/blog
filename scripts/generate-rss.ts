const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const siteUrl = 'https://bradystroud.dev';
const blogsDir = path.resolve(process.cwd(), 'content', 'blogs');
const outFile = path.resolve(process.cwd(), 'public', 'rss.xml');

const xmlEscape = (s: string) =>
    s.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

interface RssItem {
    title: string;
    date: string;
    description: string;
    url: string;
}

const files = fs.readdirSync(blogsDir)
    .filter(f => /\.mdx?$/.test(f));

const items: RssItem[] = files.flatMap(file => {
    const { data, content } = matter.read(path.join(blogsDir, file));
    if (!data.date) return [];                                // skip drafts

    const slug = file.replace(/\.mdx?$/, '');

    // description: front‑matter excerpt → description → first paragraph
    const desc = (data.excerpt ?? data.description ?? '') ||
        content.split(/\r?\n\r?\n/)            // paragraphs
            .find(p => p.trim())!                // first non‑empty
            .replace(/\n+/g, ' ')
            .replace(/\.([A-Za-z])/g, '. $1')    // '.I' → '. I'
            .replace(/[#*_`>\[\]\(\)!]/g, '')    // strip md
            .replace(/\s+/g, ' ')
            .trim();

    return [{
        title: data.title as string,
        date: data.date as string,
        description: desc,
        url: `${siteUrl}/blogs/${slug}`,
    }];
});

const rss = `<?xml version="1.0" encoding="UTF-8"?>
   <rss version="2.0">
   <channel>
   <title>Brady Stroud Blog</title>
   <link>${siteUrl}</link>
   <description>Latest posts from Brady Stroud</description>
   ${items
        .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
        .map(i => `
   <item>
   <title>${xmlEscape(i.title)}</title>
   <link>${i.url}</link>
   <guid>${i.url}</guid>
   <pubDate>${new Date(i.date).toUTCString()}</pubDate>
   <description>${xmlEscape(i.description)}</description>
   </item>`).join('')}
   </channel>
   </rss>`;

fs.writeFileSync(outFile, rss);
console.log('RSS feed generated →', outFile);
