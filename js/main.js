(function ($) {
    "use strict";

    // Initialize spinner
    setTimeout(function () {
        if ($('#spinner').length > 0) {
            $('#spinner').removeClass('show');
        }
    }, 1);
    
    // Initialize WOW animations
    new WOW().init();
    
    // Back to top functionality
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 600, 'easeInOutExpo');
        return false;
    });

    // Optimized carousel configurations
    const carouselConfig = {
        autoplay: true,
        smartSpeed: 1000,
        dots: false,
        loop: true,
        nav: true,
        navText: ['<i class="bi bi-arrow-left"></i>', '<i class="bi bi-arrow-right"></i>'],
        responsive: {
            0: {items: 1},
            768: {items: 2},
            992: {items: 3}
        }
    };

    // Team carousel
    $(".team-carousel").owlCarousel({
        ...carouselConfig,
        center: false,
        margin: 50
    });

    // Testimonial carousel
    $(".testimonial-carousel").owlCarousel({
        ...carouselConfig,
        center: true,
        margin: 0,
        smartSpeed: 1500,
        navText: false
    });

    // Fact Counter with optimized animation
    $('.counter-value').each(function(){
        $(this).prop('Counter', 0).animate({
            Counter: $(this).text()
        }, {
            duration: 2000,
            easing: 'easeInQuad',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
    });

    // Enhanced responsive right-side hamburger menu - DISABLED to avoid conflicts with app.js
    /*
    $('.hamburger-menu').click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const $hamburger = $(this);
        const $overlay = $('#mobileMenuOverlay');
        const $body = $('body');
        
        // Toggle menu state
        $hamburger.toggleClass('active');
        $overlay.toggleClass('active');
        $body.toggleClass('mobile-menu-open');
    });

    // Close mobile menu
    $('.mobile-menu-close, .mobile-menu-overlay').click(function(e) {
        if (e.target === this) {
            const $hamburger = $('.hamburger-menu');
            const $overlay = $('#mobileMenuOverlay');
            const $body = $('body');
            
            $hamburger.removeClass('active');
            $overlay.removeClass('active');
            $body.removeClass('mobile-menu-open');
        }
    });

    // Mobile dropdown toggle
    $('.dropdown-toggle').click(function(e) {
        e.preventDefault();
        const $dropdown = $(this).closest('.mobile-dropdown');
        $dropdown.toggleClass('active');
    });

    // Close menu on nav link click
    $('.mobile-nav-link:not(.dropdown-toggle)').click(function() {
        const $hamburger = $('.hamburger-menu');
        const $overlay = $('#mobileMenuOverlay');
        const $body = $('body');
        
        $hamburger.removeClass('active');
        $overlay.removeClass('active');
        $body.removeClass('mobile-menu-open');
    });

    // Close menu on escape key
    $(document).keydown(function(e) {
        if (e.keyCode === 27 && $('#mobileMenuOverlay').hasClass('active')) {
            const $hamburger = $('.hamburger-menu');
            const $overlay = $('#mobileMenuOverlay');
            const $body = $('body');
            
            $hamburger.removeClass('active');
            $overlay.removeClass('active');
            $body.removeClass('mobile-menu-open');
        }
    });

    // Handle window resize
    $(window).resize(function() {
        if ($(window).width() > 992) {
            const $hamburger = $('.hamburger-menu');
            const $overlay = $('#mobileMenuOverlay');
            const $body = $('body');
            
            $hamburger.removeClass('active');
            $overlay.removeClass('active');
            $body.removeClass('mobile-menu-open');
        }
    });
    */

    // ===== ENHANCED UX IMPROVEMENTS =====
    
    // Navbar scroll effect
    let lastScroll = 0;
    $(window).scroll(function() {
        const currentScroll = $(this).scrollTop();
        
        // Add scrolled class for styling
        if (currentScroll > 50) {
            $('.navbar').addClass('scrolled');
        } else {
            $('.navbar').removeClass('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // Smooth scroll for anchor links
    $('a[href^="#"]').on('click', function(e) {
        const target = $(this.hash);
        if (target.length) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: target.offset().top - 80
            }, 800, 'easeInOutExpo');
        }
    });

    // Add entrance animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                }
            });
        }, observerOptions);

        // Observe elements with wow class
        $('.wow').each(function() {
            observer.observe(this);
        });
    }

    // Form input focus effects
    $('.form-group input, .form-group textarea').on('focus', function() {
        $(this).parent().addClass('focused');
    }).on('blur', function() {
        if (!$(this).val()) {
            $(this).parent().removeClass('focused');
        }
    });

    // Add ripple effect to buttons
    $('.btn, .mobile-nav-link, .nav-link').on('click', function(e) {
        const $button = $(this);
        const $ripple = $('<span class="ripple"></span>');
        
        const diameter = Math.max($button.outerWidth(), $button.outerHeight());
        const radius = diameter / 2;
        
        $ripple.css({
            width: diameter,
            height: diameter,
            left: e.pageX - $button.offset().left - radius,
            top: e.pageY - $button.offset().top - radius
        });
        
        $button.append($ripple);
        
        setTimeout(function() {
            $ripple.remove();
        }, 600);
    });

    // Card hover tilt effect
    $('.card, .services-item').on('mousemove', function(e) {
        const $card = $(this);
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        $card.css({
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`
        });
    }).on('mouseleave', function() {
        $(this).css({
            transform: 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)'
        });
    });

    // Loading animation for images
    $('img').each(function() {
        // If image is already loaded (cached), add loaded class immediately
        if (this.complete) {
            $(this).addClass('loaded');
        } else {
            // Otherwise wait for load event
            $(this).on('load', function() {
                $(this).addClass('loaded');
            });
        }
    });

    // Parallax effect for hero sections
    $(window).scroll(function() {
        const scrolled = $(window).scrollTop();
        $('.hero-section, .page-header').css({
            transform: 'translateY(' + (scrolled * 0.5) + 'px)'
        });
    });

    // Enhanced dropdown menu handling with animations
    function setupDropdownWithAnimation(dropdownSelector, menuSelector, useGrid = false) {
        const dropdown = $(dropdownSelector);
        const menu = $(menuSelector);
        
        if (!dropdown.length || !menu.length) return;
        
        let showTimeout, hideTimeout;
        
        dropdown.on('mouseenter', function() {
            clearTimeout(hideTimeout);
            showTimeout = setTimeout(() => {
                menu.addClass('show');
                if (useGrid) menu.css('display', 'grid');
                else menu.css('display', 'block');
            }, 100);
        });
        
        dropdown.add(menu).on('mouseleave', function() {
            clearTimeout(showTimeout);
            hideTimeout = setTimeout(() => {
                menu.removeClass('show');
                setTimeout(() => {
                    if (!menu.hasClass('show')) {
                        menu.css('display', 'none');
                    }
                }, 300); // Match CSS transition duration
            }, 100);
        });
    }

    // Initialize enhanced dropdowns
    // DISABLED: Now using click-only from app.js instead of hover
    // setupDropdownWithAnimation('.product-dropdown', '.product-menu');
    // setupDropdownWithAnimation('.solutions-dropdown', '.solutions-menu', true);

    // Close mobile menu on window resize
    $(window).resize(function() {
        if ($(window).width() > 768) {
            $('.nav-links').removeClass('open');
        }
    });

})(jQuery);

