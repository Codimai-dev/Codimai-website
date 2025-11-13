document.addEventListener("DOMContentLoaded", function () {

    const form = document.querySelector('.contact-form');
    const submitButton = form ? form.querySelector('.btn-submit') : null;

        const SVG_SUCCESS = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="72" height="72" aria-hidden="true" focusable="false">
                <path fill="#43A047" d="M40.6 12.1L17 35.7 7.4 26.1 4.6 29 17 41.3 43.4 14.9z"></path>
            </svg>`;
        const SVG_ERROR = `<svg width="72" height="72" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

    function showFormPopup(type, message, timeout = 0) {

            const existing = document.querySelector('.codimai-modal-overlay');
            if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.className = 'codimai-modal-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');

        const modal = document.createElement('div');
        modal.className = 'codimai-modal';

        const title = document.createElement('h2');
        title.className = 'codimai-modal-title';
        title.textContent = type === 'success' ? 'Success!' : (type === 'error' ? 'Error' : 'Notice');

        const body = document.createElement('p');
        body.className = 'codimai-modal-body';
        body.textContent = message;

        const okBtn = document.createElement('button');
        okBtn.className = 'codimai-modal-ok';
        okBtn.type = 'button';
        okBtn.textContent = 'OK';

        // Close handlers
        okBtn.addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

        // Assemble
        modal.appendChild(title);
        modal.appendChild(body);
        modal.appendChild(okBtn);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

            // optional auto-close only when timeout is explicitly > 0
            if (typeof timeout === 'number' && timeout > 0) {
                setTimeout(() => overlay.remove(), timeout);
            }

            if (type === 'success') {
                try { sessionStorage.setItem('codimai_form_submitted', String(Date.now())); } catch (e) { /* ignore */ }
            }
    }

    function sendContactForm(targetForm) {
        if (!targetForm) return;
        const scriptURL = 'https://script.google.com/macros/s/AKfycbyHFRhYi5BpzC0IamnmJbBmAaLGRVzFMgD_q4cjXydIvs0JURIjozPYs0nQKvOsfVs/exec';
        const formData = new FormData(targetForm);
        const btn = targetForm.querySelector('.btn-submit, button[type="submit"]');

        if (btn) {
            btn.disabled = true;
            btn.textContent = 'Sending...';
        }

        return fetch(scriptURL, { method: 'POST', body: formData })
            .then(response => {
                showFormPopup('success', 'Your form has been submitted.');
                targetForm.reset();
                if (btn) {
                    btn.disabled = false;
                    btn.textContent = 'Send Message';
                }
                return response;
            })
            .catch(error => {
                console.error('Error!', error && error.message ? error.message : error);
                showFormPopup('error', 'An error occurred while sending your message. Please try again.');
                if (btn) {
                    btn.disabled = false;
                    btn.textContent = 'Send Message';
                }
                throw error;
            });
    }
    
    // Hamburger menu functionality for mobile
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    
    if (hamburgerMenu && mobileMenuOverlay) {
        // Open mobile menu
        hamburgerMenu.addEventListener('click', function() {
            mobileMenuOverlay.classList.add('active');
            hamburgerMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        // Close mobile menu
        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', function() {
                mobileMenuOverlay.classList.remove('active');
                hamburgerMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
        
        // Close menu when clicking overlay background
        mobileMenuOverlay.addEventListener('click', function(e) {
            if (e.target === mobileMenuOverlay) {
                mobileMenuOverlay.classList.remove('active');
                hamburgerMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking any nav link
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Don't close for dropdown toggles
                if (!this.classList.contains('dropdown-toggle')) {
                    mobileMenuOverlay.classList.remove('active');
                    hamburgerMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });
        
        // Handle mobile dropdown toggles
        const dropdownToggles = document.querySelectorAll('.mobile-dropdown .dropdown-toggle');
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                const dropdown = this.closest('.mobile-dropdown');
                dropdown.classList.toggle('active');
            });
        });
    }
    
    // Mobile menu functionality (legacy support)
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navbarRight = document.querySelector('.navbar-left');
    
    if (mobileMenuToggle && navbarRight) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navbarRight.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navbarRight.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close mobile menu when clicking on links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 575) {
                    mobileMenuToggle.classList.remove('active');
                    navbarRight.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });
        
        // Close mobile menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 575) {
                mobileMenuToggle.classList.remove('active');
                navbarRight.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Initialize AOS animations with responsive settings
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: window.innerWidth < 768 ? 30 : 50,
            disable: window.innerWidth < 576 ? 'mobile' : false
        });
    }

    // Active navigation link highlighting
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links .nav-link").forEach(link => {
        const linkPage = link.getAttribute("href");
        if (linkPage === currentPage) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

    // Step cards animation with responsive detection
    const stepCards = document.querySelectorAll('[data-step]');
    if (stepCards.length > 0) {
        const showStepsOnScroll = () => {
            stepCards.forEach((card, index) => {
                const cardTop = card.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                const offset = window.innerWidth < 768 ? 100 : 50;
                
                if (cardTop < windowHeight - offset) {
                    const delay = window.innerWidth < 576 ? index * 100 : index * 150;
                    setTimeout(() => card.classList.add('show'), delay);
                }
            });
        };
        
        // Throttle scroll events for performance
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(showStepsOnScroll, 10);
        });
        showStepsOnScroll();
    }

    // Liquid gradient mouse tracking (disable on touch devices)
    const gradient = document.querySelector('.liquid-gradient');
    if (gradient && !('ontouchstart' in window)) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            gradient.style.setProperty('--x', `${x}%`);
            gradient.style.setProperty('--y', `${y}%`);
        });
    }

    // Enhanced dropdown menu functionality with touch support
    const setupDropdownHover = (dropdown, menu, displayStyle = 'block') => {
        if (!dropdown || !menu) return;
        
        const isTouchDevice = 'ontouchstart' in window;
        let touchStarted = false;
        
        const showMenu = () => menu.style.display = displayStyle;
        const hideMenu = () => {
            setTimeout(() => {
                if (!dropdown.matches(':hover') && !menu.matches(':hover') && !touchStarted) {
                    menu.style.display = "none";
                }
            }, isTouchDevice ? 100 : 50);
        };

        if (isTouchDevice) {
            // Touch device handling
            dropdown.addEventListener('touchstart', (e) => {
                e.preventDefault();
                touchStarted = true;
                if (menu.style.display === displayStyle) {
                    menu.style.display = "none";
                    touchStarted = false;
                } else {
                    // Close other dropdowns
                    document.querySelectorAll('.product-menu, .solutions-menu').forEach(m => {
                        if (m !== menu) m.style.display = "none";
                    });
                    showMenu();
                }
            });
            
            // Close dropdown when touching outside
            document.addEventListener('touchstart', (e) => {
                if (!dropdown.contains(e.target) && !menu.contains(e.target)) {
                    menu.style.display = "none";
                    touchStarted = false;
                }
            });
        } else {
            // Desktop hover handling
            dropdown.addEventListener("mouseenter", showMenu);
            dropdown.addEventListener("mouseleave", hideMenu);
            menu.addEventListener("mouseenter", showMenu);
            menu.addEventListener("mouseleave", hideMenu);
        }
    };

    // Setup dropdown menus
    const productDropdown = document.querySelector(".product-dropdown");
    const productMenu = document.querySelector(".product-menu");
    const solutionsDropdown = document.querySelector(".solutions-dropdown");
    const solutionsMenu = document.querySelector(".solutions-menu");

    // Add click functionality for dropdowns - CLICK TO OPEN/CLOSE
    if (productDropdown && productMenu) {
        const productLink = productDropdown.querySelector('.nav-link');
        if (productLink) {
            productLink.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const isVisible = productMenu.classList.contains('show');
                
                // Close all dropdowns first
                document.querySelectorAll('.product-menu, .solutions-menu').forEach(menu => {
                    menu.classList.remove('show');
                });
                
                // Toggle current dropdown
                if (!isVisible) {
                    productMenu.classList.add('show');
                }
            });
        }
    }
    
    if (solutionsDropdown && solutionsMenu) {
        const solutionsLink = solutionsDropdown.querySelector('.nav-link');
        if (solutionsLink) {
            solutionsLink.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const isVisible = solutionsMenu.classList.contains('show');
                
                // Close all dropdowns first
                document.querySelectorAll('.product-menu, .solutions-menu').forEach(menu => {
                    menu.classList.remove('show');
                });
                
                // Toggle current dropdown
                if (!isVisible) {
                    solutionsMenu.classList.add('show');
                }
            });
        }
    }
    
    // Ensure dropdowns start hidden (remove show class if present)
    if (productMenu) productMenu.classList.remove('show');
    if (solutionsMenu) solutionsMenu.classList.remove('show');
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!productDropdown?.contains(e.target) && !solutionsDropdown?.contains(e.target)) {
            document.querySelectorAll('.product-menu, .solutions-menu').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });

    // ===== Desktop: ensure dropdowns open on click as expected =====
    // Add a robust fallback for desktop users who click the nav items.
    const DESKTOP_BREAKPOINT = 993;
    const setupDesktopDropdownClicks = () => {
        // Use event delegation: a single listener on document handles clicks on any
        // desktop nav dropdown link. This is more robust across pages and
        // prevents issues when nav markup is slightly different or re-rendered.
        if (document.__desktopDropdownDelegationBound) return;
        document.__desktopDropdownDelegationBound = true;

        document.addEventListener('click', (e) => {
            // Only handle for desktop widths (prevent conflict with mobile)
            if (window.innerWidth < DESKTOP_BREAKPOINT) return;

            const link = e.target.closest('.nav-item.dropdown > .nav-link');
            if (!link) return; // not a desktop dropdown click

            e.preventDefault();
            e.stopPropagation();

            const parent = link.closest('.nav-item.dropdown');
            if (!parent) return;

            // Find the corresponding menu inside this dropdown
            const menu = parent.querySelector('.product-menu, .solutions-menu');
            if (!menu) return;

            const isVisible = menu.classList.contains('show');

            // Close any open menus first
            document.querySelectorAll('.product-menu.show, .solutions-menu.show').forEach(m => m.classList.remove('show'));

            if (!isVisible) {
                menu.classList.add('show');
            }
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.product-menu.show, .solutions-menu.show').forEach(m => m.classList.remove('show'));
            }
        });
    };

    // Initialize and re-run on resize (so dynamically loaded navs also get handlers)
    setupDesktopDropdownClicks();
    window.addEventListener('resize', () => {
        // re-run to bind any new elements if needed
        setupDesktopDropdownClicks();
    });

    // Enable hover functionality for desktop (non-touch) users while keeping
    // touch devices using the touch handlers inside setupDropdownHover.
    if (!('ontouchstart' in window)) {
        // Only bind hover behavior on pointer-based devices to avoid conflicts
        // with touch interactions. The function already handles enter/leave and
        // delay behaviour for smooth UX.
        setupDropdownHover(productDropdown, productMenu);
        setupDropdownHover(solutionsDropdown, solutionsMenu, 'grid');
    }

    // Integration grid rendering with performance optimization
    const integrationGrid = document.getElementById('integrationGrid');
    if (integrationGrid) {
        const icons = [
            { name: 'Slack', slug: 'slack', color: '#4A154B' },
            { name: 'Google Cloud', slug: 'googlecloud', color: '#4285F4' },
            { name: 'OpenSearch', slug: 'opensearch', color: '#005EB8' },
            { name: 'Splunk', slug: 'splunk', color: '#000000' },
            { name: 'Datadog', slug: 'datadog', color: '#632CA6' },
            { name: 'Grafana', slug: 'grafana', color: '#F46800' },
            { name: 'Prometheus', slug: 'prometheus', color: '#E6522C' },
            { name: 'Jira', slug: 'jira', color: '#0052CC' },
            { name: 'PagerDuty', slug: 'pagerduty', color: '#36B37E' },
            { name: 'Microsoft Teams', src: 'https://img.icons8.com/fluency/48/microsoft-teams-2019.png' },
            { name: 'AWS', src: 'https://img.icons8.com/color/48/amazon-web-services.png' },
            { name: 'Azure', src: 'https://img.icons8.com/fluency/48/azure-1.png' },
            { name: 'ServiceNow', src: 'https://cdn.brandfetch.io/idgONjBNKe/w/400/h/400/theme/dark/icon.jpeg' },
            { name: 'Loki', slug: 'grafana', color: '#F46800' }
        ];

        const createIntegrationTile = (icon) => {
            const tile = document.createElement('div');
            tile.className = 'integration-tile';
            tile.setAttribute('role', 'listitem');

            const card = document.createElement('a');
            card.href = 'contact.html';
            card.className = 'integration-card';
            card.setAttribute('aria-label', `Contact us about ${icon.name} integration`);

            const media = document.createElement('div');
            media.className = 'integration-media';

            const img = document.createElement('img');
            if (icon.slug) {
                const colorSuffix = icon.color ? `/${icon.color.replace('#', '')}` : '';
                img.src = `https://cdn.simpleicons.org/${icon.slug}${colorSuffix}`;
                img.onerror = () => {
                    img.onerror = null;
                    img.src = `https://cdn.simpleicons.org/${icon.slug}`;
                };
            } else {
                img.src = icon.src;
                img.onerror = () => {
                    media.innerHTML = `<span class="fallback-icon">${icon.name[0] || '?'}</span>`;
                    img.remove();
                };
            }
            img.alt = `${icon.name} logo`;
            img.loading = 'lazy';
            img.width = 64;
            img.height = 64;
            media.appendChild(img);

            const label = document.createElement('div');
            label.className = 'integration-label';
            label.textContent = icon.name;

            card.appendChild(media);
            card.appendChild(label);
            tile.appendChild(card);
            return tile;
        };

        // Render integration tiles with document fragment for performance
        const fragment = document.createDocumentFragment();
        icons.forEach(icon => fragment.appendChild(createIntegrationTile(icon)));
        integrationGrid.appendChild(fragment);
    }

    // Enhanced form validation with accessibility
    const contactForms = document.querySelectorAll('.contact-form');
    contactForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset previous validation states
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.classList.remove('error');
                const errorMsg = input.parentNode.querySelector('.error-message');
                if (errorMsg) errorMsg.remove();
            });
            
            // Validation
            let isValid = true;
            const requiredInputs = form.querySelectorAll('input[required], textarea[required]');
            
            requiredInputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                    input.style.borderColor = '#dc3545';
                    
                    // Add error message
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message';
                    errorMsg.style.color = '#dc3545';
                    errorMsg.style.fontSize = '0.875rem';
                    errorMsg.style.marginTop = '0.25rem';
                    errorMsg.textContent = `${input.placeholder || 'This field'} is required`;
                    input.parentNode.appendChild(errorMsg);
                    
                    // Set focus to first error field
                    if (isValid === false && !document.querySelector('.error:focus')) {
                        input.focus();
                    }
                } else {
                    input.style.borderColor = '#28a745';
                }
            });
            
            // Email validation
            const emailInputs = form.querySelectorAll('input[type="email"]');
            emailInputs.forEach(input => {
                if (input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
                    isValid = false;
                    input.classList.add('error');
                    input.style.borderColor = '#dc3545';
                    
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message';
                    errorMsg.style.color = '#dc3545';
                    errorMsg.style.fontSize = '0.875rem';
                    errorMsg.style.marginTop = '0.25rem';
                    errorMsg.textContent = 'Please enter a valid email address';
                    input.parentNode.appendChild(errorMsg);
                }
            });
            
            if (isValid) {
                // After validation, perform the actual send (centralized) so there's a single,
                // consistent success/error popup message across pages.
                const submitBtn = form.querySelector('.btn-submit, button[type="submit"]');
                if (submitBtn) {
                    submitBtn.classList.add('btn-temp-success');
                    setTimeout(() => submitBtn.classList.remove('btn-temp-success'), 1200);
                }
                // sendContactForm returns a promise; we don't need to await here but could.
                sendContactForm(form).catch(() => {/* already handled in sendContactForm */});
            }
        });
    });

    // Performance optimization: Lazy load images with IntersectionObserver
    const lazyImages = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window && lazyImages.length > 0) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        lazyImages.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.classList.add('loaded');
        });
    }
    
    // Responsive font size adjustment
    const adjustFontSizes = () => {
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const root = document.documentElement;
        
        if (vw < 400) {
            root.style.setProperty('--base-font-size', '14px');
        } else if (vw < 576) {
            root.style.setProperty('--base-font-size', '15px');
        } else {
            root.style.setProperty('--base-font-size', '16px');
        }
    };
    
    adjustFontSizes();
    window.addEventListener('resize', adjustFontSizes);
});
