// Markdown Parser with Media Support
class MarkdownParser {
  parse(markdown) {
    if (!markdown) return '';
    let html = markdown;

    // Process embeds first
    html = this.processEmbeds(html);
    html = this.processVideos(html);

    // Headers
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    
    // Bold and Italic
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    
    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="blog-image" loading="lazy" />');
    
    // Code blocks
    html = html.replace(/``````/g, '<pre><code>$1</code></pre>');
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Lists
    html = html.replace(/^\* (.+)$/gm, '<li>$1</li>');
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    
    // Blockquotes
    html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
    
    // Horizontal rules
    html = html.replace(/^---$/gm, '<hr />');
    
    // Paragraphs
    html = html.replace(/\n\n/g, '</p><p>');
    if (!html.startsWith('<')) html = '<p>' + html + '</p>';
    
    return html;
  }

  processVideos(text) {
    return text.replace(/!\[video\]\(([^)]+)\)/g, 
      '<video controls class="blog-video" preload="metadata"><source src="$1" type="video/mp4"></video>');
  }

  processEmbeds(text) {
    // YouTube
    text = text.replace(/!\[youtube\]\((?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)\)/g,
      '<div class="video-embed"><iframe width="560" height="315" src="https://www.youtube.com/embed/$1" frameborder="0" allowfullscreen loading="lazy"></iframe></div>');
    
    // Twitter
    text = text.replace(/!\[twitter\]\((?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)\)/g,
      '<div class="twitter-embed"><blockquote class="twitter-tweet"><a href="https://twitter.com/x/status/$1"></a></blockquote><script async src="https://platform.twitter.com/widgets.js"></script></div>');
    
    // Instagram
    text = text.replace(/!\[instagram\]\((?:https?:\/\/)?(?:www\.)?instagram\.com\/p\/([a-zA-Z0-9_-]+)\)/g,
      '<div class="instagram-embed"><blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/$1/"></blockquote><script async src="https://www.instagram.com/embed.js"></script></div>');
    
    // Generic embeds
    text = text.replace(/!\[embed\]\(([^)]+)\)/g,
      '<div class="generic-embed"><iframe src="$1" frameborder="0" allowfullscreen loading="lazy"></iframe></div>');
    
    return text;
  }

  async parseMarkdownFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const markdown = e.target.result;
        const html = this.parse(markdown);
        const titleMatch = markdown.match(/^# (.+)$/m);
        const title = titleMatch ? titleMatch[1] : 'Untitled';
        const slug = this.generateSlug(title);
        const excerptMatch = markdown.match(/^(?!#)(.+)$/m);
        const excerpt = excerptMatch ? excerptMatch[1].substring(0, 160) : '';
        
        resolve({ title, slug, content: html, excerpt, markdown });
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }

  generateSlug(text) {
    return text.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}

export default new MarkdownParser();
