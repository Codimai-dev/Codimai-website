import BlogService from './blog-service.js';

class BlogDisplay {
  async loadBlogs() {
    console.log('🔍 BlogDisplay: Starting to load blogs...');
    
    const container = document.getElementById('blogContainer');
    if (!container) {
      console.error('❌ BlogDisplay: Container #blogContainer not found!');
      return;
    }
    
    try {
      const blogs = await BlogService.getAllBlogs();
      
      console.log('📊 BlogDisplay: Fetched blogs:', blogs);
      console.log('📊 BlogDisplay: Number of blogs:', blogs ? blogs.length : 0);
      
      container.innerHTML = '';
      
      if (!blogs || blogs.length === 0) {
        console.warn('⚠️ BlogDisplay: No blogs to display');
        container.innerHTML = '<p class="no-blogs">No blog posts available yet.</p>';
        return;
      }

      console.log('✅ BlogDisplay: Rendering', blogs.length, 'blog cards...');
      blogs.forEach((blog, index) => {
        console.log(`  - Blog ${index + 1}:`, blog.title, '| Published:', blog.published, '| Slug:', blog.slug);
        const card = this.createBlogCard(blog);
        container.appendChild(card);
      });
      
      console.log('✅ BlogDisplay: All blogs rendered successfully!');
    } catch (error) {
      console.error('❌ BlogDisplay: Error loading blogs:', error);
      container.innerHTML = '<p class="no-blogs error">Error loading blog posts. Please check console.</p>';
    }
  }

  createBlogCard(blog) {
    console.log('Creating card for blog:', blog.title, 'Slug:', blog.slug);
    const col = document.createElement('div');
    col.className = 'col-lg-4 col-md-6';
    col.setAttribute('data-aos', 'fade-up');
    col.setAttribute('data-aos-delay', '100');
    
    const date = blog.createdAt ? blog.createdAt.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) : 'Unknown date';

    const card = document.createElement('div');
    card.className = 'blog-card';
    
    card.innerHTML = `
      <div class="blog-card-image">
        <i class="fas fa-newspaper"></i>
      </div>
      <div class="blog-card-content">
        <div class="blog-card-meta">
          <span><i class="fas fa-calendar-alt"></i> ${date}</span>
        </div>
        <h2 class="blog-card-title">${blog.title}</h2>
        <p class="blog-card-excerpt">${blog.excerpt || 'Read more to discover insights...'}</p>
        <div class="blog-card-footer">
          <span class="blog-card-author"><i class="fas fa-user"></i> ${blog.author || 'CodimAi Team'}</span>
          <a href="blog-post.html?slug=${blog.slug}" class="blog-card-link">Read More</a>
        </div>
      </div>
    `;
    
    col.appendChild(card);
    return col;
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  new BlogDisplay().loadBlogs();
});
