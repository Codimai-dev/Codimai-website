// Single Blog Post Display
import BlogService from './blog-service.js';

class BlogPost {
  async loadPost() {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');
    
    if (!slug) {
      document.getElementById('blogPostContainer').innerHTML = '<p>Blog post not found.</p>';
      return;
    }

    const blog = await BlogService.getBlogBySlug(slug);
    
    if (!blog) {
      document.getElementById('blogPostContainer').innerHTML = '<p>Blog post not found.</p>';
      return;
    }

    this.renderPost(blog);
    this.updateMeta(blog);
  }

  renderPost(blog) {
    const container = document.getElementById('blogPostContainer');
    const date = blog.createdAt ? blog.createdAt.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : 'Unknown date';

    container.innerHTML = `
      <article class="blog-post">
        <header class="blog-post-header">
          <h1 class="blog-post-title">${blog.title}</h1>
          <div class="blog-post-meta">
            <span class="blog-post-meta-item">
              <i class="fas fa-user"></i> ${blog.author || 'CodimAi Team'}
            </span>
            <span class="blog-post-meta-item">
              <i class="fas fa-calendar-alt"></i> ${date}
            </span>
          </div>
        </header>

        <div class="blog-post-content">
          ${blog.content}
        </div>

        ${blog.tags && blog.tags.length > 0 ? `
          <footer class="blog-tags">
            ${blog.tags.map(tag => `<span class="blog-tag"><i class="fas fa-tag"></i> ${tag}</span>`).join('')}
          </footer>
        ` : ''}
      </article>
    `;
  }

  updateMeta(blog) {
    // Update page title
    document.title = `${blog.title} - CodimAi Blog`;
    
    // Update meta description
    const pageDescription = document.getElementById('pageDescription');
    if (pageDescription) {
      pageDescription.content = blog.metaDescription || blog.excerpt || 'Read expert insights on AI and automation from CodimAi.';
    }

    // OG tags for social sharing
    this.setMetaTag('og:title', blog.title);
    this.setMetaTag('og:description', blog.excerpt || blog.metaDescription);
    this.setMetaTag('og:type', 'article');
    
    // Twitter card
    this.setMetaTag('twitter:card', 'summary_large_image', 'name');
    this.setMetaTag('twitter:title', blog.title, 'name');
    this.setMetaTag('twitter:description', blog.excerpt || blog.metaDescription, 'name');
  }

  setMetaTag(property, content, attr = 'property') {
    let tag = document.querySelector(`meta[${attr}="${property}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(attr, property);
      document.head.appendChild(tag);
    }
    tag.content = content;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new BlogPost().loadPost();
});
