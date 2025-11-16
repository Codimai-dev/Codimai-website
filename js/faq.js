/* Pure JS toggle (add this tiny script at bottom or in your JS file) */

  document.querySelectorAll('.faq-question').forEach(item => {
    item.addEventListener('click', () => {
      const parent = item.parentElement;
      parent.classList.toggle('active');
      
      // Close others (optional)
      document.querySelectorAll('.faq-item').forEach(other => {
        if (other !== parent) other.classList.remove('active');
      });
    });
  });
