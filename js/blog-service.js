// Blog Database Service
import { db, storage } from './firebase-config.js';
import { 
  collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc,
  query, orderBy, limit, where, serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { 
  ref, uploadBytes, getDownloadURL, deleteObject 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';

class BlogService {
  constructor() {
    this.collectionName = 'blogs';
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000;
  }

  async createBlog(blogData) {
    try {
      const blogRef = collection(db, this.collectionName);
      const docRef = await addDoc(blogRef, {
        ...blogData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        published: blogData.published || false
      });
      this.clearCache();
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error creating blog:', error);
      return { success: false, error: error.message };
    }
  }

  async updateBlog(blogId, blogData) {
    try {
      const blogRef = doc(db, this.collectionName, blogId);
      await updateDoc(blogRef, {
        ...blogData,
        updatedAt: serverTimestamp()
      });
      this.clearCache();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async deleteBlog(blogId) {
    try {
      const blogRef = doc(db, this.collectionName, blogId);
      const blogDoc = await getDoc(blogRef);
      await deleteDoc(blogRef);
      this.clearCache();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getAllBlogs(useCache = true) {
    const cacheKey = 'all_blogs';
    
    if (useCache && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        console.log('📦 BlogService: Returning cached blogs:', cached.data.length);
        return cached.data;
      }
    }

    try {
      console.log('🔍 BlogService: Querying Firestore for published blogs...');
      const blogsRef = collection(db, this.collectionName);
      const q = query(blogsRef, where('published', '==', true), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      console.log('📊 BlogService: Query returned', querySnapshot.size, 'documents');
      
      const blogs = [];

      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        console.log('  - Document:', docSnap.id, '| Title:', data.title, '| Published:', data.published);
        blogs.push({
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        });
      }

      console.log('✅ BlogService: Processed', blogs.length, 'blogs');
      this.cache.set(cacheKey, { data: blogs, timestamp: Date.now() });
      return blogs;
    } catch (error) {
      console.error('❌ BlogService: Error getting blogs:', error);
      console.error('  Error code:', error.code);
      console.error('  Error message:', error.message);
      return [];
    }
  }

  async getBlogBySlug(slug) {
    try {
      const blogsRef = collection(db, this.collectionName);
      const q = query(blogsRef, where('slug', '==', slug), limit(1));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const blogDoc = querySnapshot.docs[0];
        const data = blogDoc.data();

        return {
          id: blogDoc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        };
      }
      console.warn('BlogService: slug query returned no documents for', slug, '- falling back to client-side search');
      const all = await this.getAllBlogs(false);
      const found = all.find(b => b.slug === slug);
      return found || null;
    } catch (error) {
      console.error('BlogService: getBlogBySlug error:', error);

      try {
        console.warn('BlogService: falling back to getAllBlogs due to error');
        const all = await this.getAllBlogs(false);
        const found = all.find(b => b.slug === slug);
        return found || null;
      } catch (fallbackErr) {
        console.error('BlogService: fallback to getAllBlogs also failed:', fallbackErr);
        return null;
      }
    }
  }

  async uploadImage(file, path = 'blog-images') {
  try {
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const storageRef = ref(storage, `${path}/${fileName}`);
    
    console.log('Uploading to:', `${path}/${fileName}`);
    console.log('Storage bucket:', storage.app.options.storageBucket);
    
    // Include contentType metadata when available (helps correct serving)
    const metadata = {};
    if (file && file.type) metadata.contentType = file.type;

    const snapshot = await uploadBytes(storageRef, file, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return { success: true, url: downloadURL, path: `${path}/${fileName}` };
  } catch (error) {
    console.error('Upload error details:', error);
    return { success: false, error: error.message };
  }
}


  async deleteImage(imageUrl) {
    try {
      let path = imageUrl;
      if (!path) throw new Error('No imageUrl provided');

      // If it's a full http(s) download URL from Firebase Storage, try to extract the object name.
      if (typeof path === 'string' && path.startsWith('http')) {
        try {
          // Look for ?name=<encodedPath> or /o/<encodedPath>
          const url = new URL(path);
          const nameParam = url.searchParams.get('name');
          if (nameParam) {
            path = decodeURIComponent(nameParam);
          } else {
            // fallback: parse path after /o/
            const match = url.pathname.match(/\/o\/(.+)$/);
            if (match && match[1]) {
              path = decodeURIComponent(match[1]);
            } else {
              throw new Error('Could not parse storage path from URL');
            }
          }
        } catch (e) {
          console.warn('Failed to parse imageUrl for deletion:', imageUrl, e);
          // rethrow to let caller know deletion failed
          throw e;
        }
      }

      const imageRef = ref(storage, path);
      await deleteObject(imageRef);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  clearCache() {
    this.cache.clear();
  }
}

export default new BlogService();
