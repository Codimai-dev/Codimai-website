// Admin Blog Builder Logic
import BlogService from './blog-service.js';
import GeminiService from './gemini-service.js';
import MarkdownParser from './markdown-parser.js';
import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

class AdminBlogBuilder {
  constructor() {
    this.currentBlog = null;
    this.posts = [];
    this.init();
  }

  init() {
    this.checkAuth();
    this.setupEventListeners();
    this.setupTabs();
  }

  checkAuth() {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        window.location.href = 'admin-login.html';
      } else {
        document.getElementById('userEmail').textContent = user.email;
      }
    });
  }

  setupTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        const tabId = btn.dataset.tab + 'Tab';
        document.getElementById(tabId).classList.add('active');
      });
    });
  }

  setupEventListeners() {
    // Auto-generate slug
    document.getElementById('blogTitle').addEventListener('input', (e) => {
      document.getElementById('blogSlug').value = MarkdownParser.generateSlug(e.target.value);
    });

    // Meta description character count
    document.getElementById('blogMetaDesc').addEventListener('input', (e) => {
      document.getElementById('metaCharCount').textContent = e.target.value.length;
    });

    // AI Content Generation
    document.getElementById('generateContentBtn').addEventListener('click', () => this.generateAIContent());


    // Publish actions
    document.getElementById('publishBtn').addEventListener('click', () => this.publishBlog());
    document.getElementById('saveDraftBtn').addEventListener('click', () => this.saveDraft());
    document.getElementById('previewBtn').addEventListener('click', () => this.previewBlog());

    // Markdown upload
    document.getElementById('selectMarkdownBtn').addEventListener('click', () => {
      document.getElementById('markdownFile').click();
    });
    document.getElementById('markdownFile').addEventListener('change', (e) => this.handleMarkdownUpload(e));
    document.getElementById('publishMarkdownBtn').addEventListener('click', () => this.publishMarkdown());

    // Toolbar buttons
    document.querySelectorAll('.toolbar-btn').forEach(btn => {
      btn.addEventListener('click', () => this.insertMarkdown(btn.dataset.action));
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
      signOut(auth);
    });

    // Refresh button
    const refreshBtn = document.getElementById('refreshPostsBtn');
    if (refreshBtn) refreshBtn.addEventListener('click', () => this.loadPosts());

    // Search and filter
    const searchInput = document.getElementById('searchPosts');
    const filterSelect = document.getElementById('filterStatus');
    if (searchInput) {
      let t;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(t);
        t = setTimeout(() => this.applyFilters(), 250);
      });
    }
    document.getElementById('previewBtn').addEventListener('click', () => this.previewBlog());
        // Close preview modal button
        const closePreviewBtn = document.getElementById('closePreviewBtn');
        if (closePreviewBtn) {
          closePreviewBtn.addEventListener('click', () => {
            const modal = document.getElementById('previewModal');
            if (modal) modal.style.display = 'none';
          });
        }

        // Close modal when clicking outside modal content
        const previewModal = document.getElementById('previewModal');
        if (previewModal) {
          previewModal.addEventListener('click', (e) => {
            if (e.target === previewModal) previewModal.style.display = 'none';
          });
        }

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            const modal = document.getElementById('previewModal');
            if (modal && modal.style.display === 'block') modal.style.display = 'none';
          }
        });
    if (filterSelect) {
      filterSelect.addEventListener('change', () => this.applyFilters());
    }

    // Load posts
    this.loadPosts();
  }



  async generateAIContent() {
  const topic = document.getElementById('aiTopic').value.trim();
  if (!topic) {
    alert('Please enter a topic');
    return;
  }

  this.showLoading('Generating content with AI...');
  const keywords = document.getElementById('aiKeywords').value.split(',').map(k => k.trim()).filter(k => k);
  
  const result = await GeminiService.generateBlogContent(topic, keywords);
  this.hideLoading();

  if (result.success) {
    // Successfully got JSON
    document.getElementById('blogTitle').value = result.data.title;
    document.getElementById('blogSlug').value = result.data.slug;
    document.getElementById('blogContent').value = result.data.content;
    document.getElementById('blogExcerpt').value = result.data.excerpt;
    document.getElementById('blogMetaDesc').value = result.data.metaDescription || result.data.excerpt;
    document.getElementById('blogTags').value = result.data.tags.join(', ');
    alert('Content generated successfully! ✅');
  } else {
    // JSON parsing failed - offer alternatives
    const retry = confirm(`AI generation failed: ${result.error}\n\nWould you like to:\n- Click OK to try again\n- Click Cancel to use a template`);
    
    if (retry) {
      // Try again
      setTimeout(() => this.generateAIContent(), 1000);
    } else {
      // Use template as fallback
      this.useTemplateContent(topic, keywords);
    }
  }
}

// Add this new method to provide fallback content
useTemplateContent(topic, keywords) {
  const slug = topic.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');

  const keywordText = keywords.length > 0 ? keywords.join(', ') : 'technology, innovation';

  document.getElementById('blogTitle').value = topic;
  document.getElementById('blogSlug').value = slug;
  document.getElementById('blogContent').value = `## Introduction

${topic} is an important topic in today's world. This article explores the key aspects and implications.

## Understanding ${topic}

[Write your content here about the main concepts and ideas]

## Key Benefits and Applications

- Benefit 1: [Describe benefit]
- Benefit 2: [Describe benefit]
- Benefit 3: [Describe benefit]

## Challenges and Considerations

[Discuss challenges and how to address them]

## Future Outlook

[Share predictions and future trends]

## Conclusion

In summary, ${topic} represents an important development. [Add your concluding thoughts]`;

  document.getElementById('blogExcerpt').value = `An in-depth look at ${topic} and its impact on modern technology.`;
  document.getElementById('blogMetaDesc').value = `Explore ${topic} - comprehensive guide covering key concepts, benefits, and future trends.`;
  document.getElementById('blogTags').value = keywordText;
  
  alert('Template loaded! Edit the content to customize your blog post. 📝');
}




  async publishBlog() {
    const blogData = this.collectBlogData();
    if (!this.validateBlogData(blogData)) return;

    blogData.published = document.getElementById('publishNow').checked;

    // If we're editing an existing post, update it. Otherwise create new.
    if (this.currentBlog) {
      this.showLoading('Updating blog...');
      const result = await BlogService.updateBlog(this.currentBlog, blogData);
      this.hideLoading();

      if (result.success) {
        alert('Blog updated successfully!');
        this.currentBlog = null;
        document.getElementById('publishBtn').innerHTML = '<i class="fas fa-paper-plane"></i> Publish Post';
        this.resetForm();
        this.loadPosts();
      } else {
        alert('Error updating blog: ' + result.error);
      }
    } else {
      this.showLoading('Publishing blog...');
      const result = await BlogService.createBlog(blogData);
      this.hideLoading();

      if (result.success) {
        alert('Blog published successfully!');
        this.resetForm();
        this.loadPosts();
      } else {
        alert('Error: ' + result.error);
      }
    }
  }

  async saveDraft() {
    const blogData = this.collectBlogData();
    blogData.published = false;
    
    this.showLoading('Saving draft...');
    const result = await BlogService.createBlog(blogData);
    this.hideLoading();

    if (result.success) {
      alert('Draft saved!');
      this.resetForm();
    }
  }

  collectBlogData() {
    const content = document.getElementById('blogContent').value;
    const htmlContent = MarkdownParser.parse(content);

    return {
      title: document.getElementById('blogTitle').value.trim(),
      slug: document.getElementById('blogSlug').value.trim(),
      author: document.getElementById('blogAuthor').value.trim() || 'Admin',
      category: document.getElementById('blogCategory').value,
      excerpt: document.getElementById('blogExcerpt').value.trim(),
      content: htmlContent,
      markdown: content,
      metaDescription: document.getElementById('blogMetaDesc').value.trim(),
      tags: document.getElementById('blogTags').value.split(',').map(t => t.trim()),
      published: false
    };
  }

  validateBlogData(data) {
    if (!data.title) {
      alert('Title is required');
      return false;
    }
    if (!data.slug) {
      alert('Slug is required');
      return false;
    }
    if (!data.content) {
      alert('Content is required');
      return false;
    }
    return true;
  }

  async handleMarkdownUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    this.showLoading('Processing markdown...');
    const parsed = await MarkdownParser.parseMarkdownFile(file);
    this.hideLoading();

    this.currentMarkdown = parsed;
    document.getElementById('markdownContent').innerHTML = parsed.content;
    document.getElementById('markdownPreview').style.display = 'block';
  }

  async publishMarkdown() {
    if (!this.currentMarkdown) return;

    const blogData = {
      title: this.currentMarkdown.title,
      slug: this.currentMarkdown.slug,
      author: document.getElementById('mdAuthor').value.trim() || 'Admin',
      category: document.getElementById('mdCategory').value,
      excerpt: this.currentMarkdown.excerpt,
      content: this.currentMarkdown.content,
      markdown: this.currentMarkdown.markdown,
      metaDescription: this.currentMarkdown.excerpt,
      tags: [],
      published: true
    };

    this.showLoading('Publishing...');
    const result = await BlogService.createBlog(blogData);
    this.hideLoading();

    if (result.success) {
      alert('Published successfully!');
      document.getElementById('markdownPreview').style.display = 'none';
    }
  }

  async loadPosts() {
    const posts = await BlogService.getAllBlogs(false);
    this.posts = posts || [];
    this.renderPosts(this.posts);
  }

  renderPosts(posts) {
    const tbody = document.getElementById('postsTableBody');
    tbody.innerHTML = '';
    if (!posts || posts.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="6" class="loading-cell"><p>No posts found.</p></td>`;
      tbody.appendChild(tr);
      return;
    }

    posts.forEach(post => {
      const row = tbody.insertRow();
      row.innerHTML = `
        <td class="title-cell">${post.title}</td>
        <td class="author-cell">${post.author || '—'}</td>
        <td class="category-cell">${post.category || 'Uncategorized'}</td>
        <td class="status-cell"><span class="badge ${post.published ? 'badge-success' : 'badge-draft'}">${post.published ? 'Published' : 'Draft'}</span></td>
        <td class="date-cell">${post.createdAt ? post.createdAt.toLocaleDateString() : 'N/A'}</td>
        <td class="actions-cell">
          <button class="btn-edit action-btn" data-id="${post.id}">Edit</button>
          <button class="btn-delete action-btn" data-id="${post.id}">Delete</button>
        </td>
      `;
    });

    // Attach event listeners for edit/delete buttons after rows are rendered
    this.attachRowListeners();
  }

  applyFilters() {
    const searchInput = document.getElementById('searchPosts');
    const filterSelect = document.getElementById('filterStatus');
    const q = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const status = filterSelect ? filterSelect.value : 'all';

    let filtered = this.posts.slice();
    if (status && status !== 'all') {
      filtered = filtered.filter(p => (status === 'published') === !!p.published);
    }
    if (q) {
      filtered = filtered.filter(p => {
        const inTitle = (p.title || '').toLowerCase().includes(q);
        const inAuthor = (p.author || '').toLowerCase().includes(q);
        const inTags = (p.tags || []).join(' ').toLowerCase().includes(q);
        return inTitle || inAuthor || inTags;
      });
    }

    this.renderPosts(filtered);
  }

  attachRowListeners() {
    const self = this;
    // Edit buttons
    document.querySelectorAll('.btn-edit').forEach(btn => {
      btn.removeEventListener('click', btn._adminEditHandler);
      const handler = async (e) => {
        const id = btn.dataset.id;
        await self.editPost(id);
      };
      btn.addEventListener('click', handler);
      btn._adminEditHandler = handler;
    });

    // Delete buttons
    document.querySelectorAll('.btn-delete').forEach(btn => {
      btn.removeEventListener('click', btn._adminDeleteHandler);
      const handler = async (e) => {
        const id = btn.dataset.id;
        if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;
        self.showLoading('Deleting post...');
        const res = await BlogService.deleteBlog(id);
        self.hideLoading();
        if (res.success) {
          alert('Post deleted');
          self.loadPosts();
        } else {
          alert('Delete failed: ' + res.error);
        }
      };
      btn.addEventListener('click', handler);
      btn._adminDeleteHandler = handler;
    });
  }

  async editPost(id) {
    try {
      const all = await BlogService.getAllBlogs(false);
      const post = all.find(p => p.id === id);
      if (!post) {
        alert('Post not found');
        return;
      }

      // Populate form fields
      document.getElementById('blogTitle').value = post.title || '';
      document.getElementById('blogSlug').value = post.slug || '';
      document.getElementById('blogAuthor').value = post.author || '';
      document.getElementById('blogCategory').value = post.category || '';
      document.getElementById('blogExcerpt').value = post.excerpt || '';
      // If markdown exists, prefer it; otherwise strip HTML back to text (best-effort)
      if (post.markdown) document.getElementById('blogContent').value = post.markdown;
      else if (post.content) document.getElementById('blogContent').value = post.content;
      document.getElementById('blogMetaDesc').value = post.metaDescription || '';
      document.getElementById('blogTags').value = (post.tags || []).join(', ');
      document.getElementById('publishNow').checked = !!post.published;

      // Set currentBlog so publish will update
      this.currentBlog = post.id;
      document.querySelector('.tab-btn.active')?.classList.remove('active');
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      const createBtn = document.querySelector('.tab-btn[data-tab="create"]');
      if (createBtn) createBtn.classList.add('active');
      const createTab = document.getElementById('createTab');
      if (createTab) createTab.classList.add('active');

      // Update publish button label
      const publishBtn = document.getElementById('publishBtn');
      if (publishBtn) publishBtn.innerHTML = '<i class="fas fa-save"></i> Update Post';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Edit post failed:', err);
      alert('Could not load post for editing');
    }
  }

  insertMarkdown(action) {
    const textarea = document.getElementById('blogContent');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    let replacement = '';

    switch(action) {
      case 'bold': replacement = `**${selectedText || 'bold text'}**`; break;
      case 'italic': replacement = `*${selectedText || 'italic text'}*`; break;
      case 'heading': replacement = `## ${selectedText || 'Heading'}`; break;
      case 'link': replacement = `[${selectedText || 'link text'}](url)`; break;
      case 'image': replacement = `![alt text](image-url)`; break;
      case 'video': replacement = `![video](video-url)`; break;
      case 'embed': replacement = `![youtube](video-id) or ![twitter](tweet-url)`; break;
    }

    textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
  }

  previewBlog() {
    const content = MarkdownParser.parse(document.getElementById('blogContent').value);
    document.getElementById('previewContent').innerHTML = `
      <h1>${document.getElementById('blogTitle').value}</h1>
      ${content}
    `;
    document.getElementById('previewModal').style.display = 'block';
  }

  resetForm() {
    document.querySelectorAll('input[type="text"], textarea').forEach(el => el.value = '');
    this.removeThumbnail();
  }

  showLoading(text) {
    document.getElementById('loadingText').textContent = text;
    document.getElementById('loadingOverlay').style.display = 'flex';
  }

  hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  new AdminBlogBuilder();
});
