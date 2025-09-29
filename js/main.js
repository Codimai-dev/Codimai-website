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
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
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

    // Enhanced responsive right-side hamburger menu
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
    setupDropdownWithAnimation('.product-dropdown', '.product-menu');
    setupDropdownWithAnimation('.solutions-dropdown', '.solutions-menu', true);

    // Close mobile menu on window resize
    $(window).resize(function() {
        if ($(window).width() > 768) {
            $('.nav-links').removeClass('open');
        }
    });

})(jQuery);

