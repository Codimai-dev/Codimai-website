// CodimAI Website - Optimized Application JavaScript
document.addEventListener("DOMContentLoaded", function () {
    
    // Mobile menu functionality
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

    setupDropdownHover(productDropdown, productMenu);
    setupDropdownHover(solutionsDropdown, solutionsMenu, 'grid');

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
                // Show success state
                const submitBtn = form.querySelector('.btn-submit, button[type="submit"]');
                if (submitBtn) {
                    const originalText = submitBtn.textContent;
                    submitBtn.textContent = 'Sent Successfully!';
                    submitBtn.style.backgroundColor = '#28a745';
                    submitBtn.disabled = true;
                    
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.style.backgroundColor = '';
                        submitBtn.disabled = false;
                        form.reset();
                    }, 3000);
                }
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