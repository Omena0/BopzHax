// BopzHax Aim Assist UI Functionality

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu handling
    const menuToggle = document.createElement('button');
    menuToggle.className = 'mobile-menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    
    const headerElement = document.querySelector('header');
    headerElement.appendChild(menuToggle);
    
    const overlayMenu = document.querySelector('.overlay-menu');
    const closeMenu = document.querySelector('.close-menu');
    
    menuToggle.addEventListener('click', function() {
        document.body.classList.add('show-menu');
    });
    
    closeMenu.addEventListener('click', function() {
        document.body.classList.remove('show-menu');
    });
    
    // Handle mobile navigation links
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            document.body.classList.remove('show-menu');
        });
    });

    // Configuration tabs functionality
    const configOptions = document.querySelectorAll('.config-option');
    const configPanels = document.querySelectorAll('.config-panel');
    
    configOptions.forEach(option => {
        option.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            
            // Remove active class from all options and panels
            configOptions.forEach(opt => opt.classList.remove('active'));
            configPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked option and corresponding panel
            this.classList.add('active');
            document.getElementById(target).classList.add('active');
        });
    });
      // Slider functionality with specific formatting based on slider ID
    const sliders = document.querySelectorAll('.slider');
    sliders.forEach(slider => {
        const valueDisplay = slider.parentElement.querySelector('.slider-value');
        
        // Set initial value
        updateSliderValue(slider, valueDisplay);
        
        // Update on change
        slider.addEventListener('input', function() {
            updateSliderValue(this, valueDisplay);
            
            // Update related statistics for demo purposes
            if (this.id === 'predict-amount') {
                updatePredictionStats();
            } else if (this.id === 'capture-size') {
                // Simulate performance impact
                const performanceImpact = Math.min(1, this.value / 300);
                document.getElementById('distance-value').textContent = 
                    (1 + performanceImpact * 0.25).toFixed(2) + 'x';
            }
        });
    });
    
    // FAQ accordions
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isOpen = item.classList.contains('open');
            
            // Close all items
            faqItems.forEach(faq => {
                faq.classList.remove('open');
            });
            
            // If clicked item wasn't open, open it
            if (!isOpen) {
                item.classList.add('open');
            }
        });
    });
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('header nav a, .mobile-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Remove active class from all links
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                
                // Add active class to clicked link
                this.classList.add('active');
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Key binding functionality
    const changeKeyButtons = document.querySelectorAll('.change-key');
    changeKeyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const keyInput = this.previousElementSibling;
            keyInput.textContent = 'Press Any Key...';
            keyInput.classList.add('listening');
            
            const keyListener = function(e) {
                e.preventDefault();
                keyInput.textContent = e.key.toUpperCase();
                keyInput.classList.remove('listening');
                document.removeEventListener('keydown', keyListener);
            };
            
            document.addEventListener('keydown', keyListener);
        });
    });

    // Highlight active section on scroll
    window.addEventListener('scroll', highlightNavOnScroll);
    
    // Initial highlight check
    highlightNavOnScroll();
    
    // Add demo aim animation
    animateAimTarget();
});

// Helper functions
function updateSliderValue(slider, display) {
    const value = slider.value;
    
    // Format based on slider ID
    if (slider.id === 'capture-size') {
        display.textContent = value + 'px';
    } else if (slider.id === 'assist-amount' || slider.id === 'predict-amount') {
        // Format with 2 decimal places for float values
        display.textContent = parseFloat(value).toFixed(2);
    } else {
        // Default formatting
        display.textContent = value;
    }
    
    // Visual feedback - update slider color
    const percentage = ((value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.background = `linear-gradient(to right, var(--primary) 0%, var(--primary) ${percentage}%, var(--gray) ${percentage}%, var(--gray) 100%)`;
}

function highlightNavOnScroll() {
    const scrollPosition = window.scrollY;
    
    // Get all sections
    const sections = document.querySelectorAll('section[id]');
    
    // Check which section is in view
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            // Remove active class from all nav links
            document.querySelectorAll('header nav a').forEach(link => {
                link.classList.remove('active');
            });
            
            // Add active class to current section's nav link
            const activeLink = document.querySelector(`header nav a[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}

function animateAimTarget() {
    const targetOverlay = document.querySelector('.targeting-overlay');
    const demoScreen = document.querySelector('.demo-screen');
    
    // Create random positioned targets
    function createTarget() {
        const target = document.createElement('div');
        target.className = 'aim-target';
        
        // Random position within demo screen
        const maxX = demoScreen.offsetWidth - 40;
        const maxY = demoScreen.offsetHeight - 40;
        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);
        
        target.style.cssText = `
            position: absolute;
            width: 30px;
            height: 30px;
            background-color: rgba(255, 61, 0, 0.7);
            border-radius: 50%;
            top: ${randomY}px;
            left: ${randomX}px;
            transform: translate(-50%, -50%);
            z-index: 2;
        `;
        
        demoScreen.appendChild(target);
        
        // Animate targeting overlay toward the target
        setTimeout(() => {
            const targetRect = target.getBoundingClientRect();
            const overlayRect = targetOverlay.getBoundingClientRect();
            
            const diffX = (targetRect.left + targetRect.width/2) - (overlayRect.left + overlayRect.width/2);
            const diffY = (targetRect.top + targetRect.height/2) - (overlayRect.top + overlayRect.height/2);
            
            // Smooth animation to target
            targetOverlay.style.transition = 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
            targetOverlay.style.transform = `translate(calc(-50% + ${diffX}px), calc(-50% + ${diffY}px))`;
            
            // Target hit effect
            setTimeout(() => {
                target.style.transform = 'translate(-50%, -50%) scale(1.5)';
                target.style.opacity = '0';
                
                setTimeout(() => {
                    demoScreen.removeChild(target);
                    // Reset targeting overlay
                    targetOverlay.style.transition = 'transform 0.3s ease';
                    targetOverlay.style.transform = 'translate(-50%, -50%)';
                    
                    // Create next target after a delay
                    setTimeout(createTarget, 2000);
                }, 300);
            }, 800);
        }, 500);
    }
    
    // Start the aim targeting demo
    setTimeout(createTarget, 2000);
}

// Create visual element to demonstrate aim assist
window.addEventListener('load', function() {
    // Create a canvas for aim trajectories
    const trajectoryDemo = document.createElement('div');
    trajectoryDemo.className = 'trajectory-demo';
    trajectoryDemo.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 5;
    `;
    
    document.querySelector('.demo-screen').appendChild(trajectoryDemo);
    
    // Create trajectory lines
    function createTrajectory() {
        // Only create trajectories if the screen is visible
        const demoScreen = document.querySelector('.demo-screen');
        const rect = demoScreen.getBoundingClientRect();
        
        if (rect.top > window.innerHeight || rect.bottom < 0) {
            setTimeout(createTrajectory, 3000);
            return;
        }
        
        const line = document.createElement('div');
        
        // Random start position
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        
        // Target position (center area)
        const targetX = 40 + Math.random() * 20;
        const targetY = 40 + Math.random() * 20;
        
        // Control points for curve (simulate human movement)
        const cp1x = startX + (Math.random() * 20 - 10);
        const cp1y = startY + (Math.random() * 20 - 10);
        const cp2x = targetX + (Math.random() * 10 - 5);
        const cp2y = targetY + (Math.random() * 10 - 5);
        
        line.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background-color: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            top: ${startY}%;
            left: ${startX}%;
            box-shadow: 0 0 5px rgba(0, 229, 255, 0.8);
            opacity: 0;
        `;
        
        trajectoryDemo.appendChild(line);
        
        // Animate along bezier path
        const duration = 1000 + Math.random() * 500;
        line.animate([
            { 
                top: `${startY}%`, 
                left: `${startX}%`,
                opacity: 0.8,
            },
            { 
                top: `${cp1y}%`, 
                left: `${cp1x}%`,
                opacity: 0.8,
            },
            { 
                top: `${cp2y}%`, 
                left: `${cp2x}%`,
                opacity: 0.8,
            },
            { 
                top: `${targetY}%`, 
                left: `${targetX}%`,
                opacity: 0,
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
            fill: 'forwards'
        }).onfinish = function() {
            trajectoryDemo.removeChild(line);
        };
        
        // Create next trajectory
        setTimeout(createTrajectory, 1500 + Math.random() * 1500);
    }
    
    // Start trajectory animations
    createTrajectory();
    
    // Initialize statistics display
    initStatistics();
});

function updatePredictionStats() {
    // Simulate updating the consistency and jitter based on prediction value
    const predictValue = parseFloat(document.getElementById('predict-amount').value);
    
    // Consistency is inversely related to prediction amount (higher prediction often means less consistent movement)
    const consistencyBase = 0.85 - (predictValue * 0.1);
    const consistency = Math.max(0.1, Math.min(0.95, consistencyBase + (Math.random() * 0.1)));
    
    // Jitter simulation - higher prediction tends to amplify jitter
    const jitterBase = 0.05 + (predictValue * 0.15);
    const jitter = Math.max(0.01, Math.min(0.9, jitterBase + (Math.random() * 0.2)));
    
    // Update the statistics display
    document.getElementById('consistency-value').textContent = consistency.toFixed(2);
    document.getElementById('jitter-value').textContent = jitter.toFixed(2);
}

// Initialize statistics
function initStatistics() {
    updatePredictionStats();
    
    // Set up automatic stats updating to simulate real-time changes
    setInterval(() => {
        // Get current values
        let consistency = parseFloat(document.getElementById('consistency-value').textContent);
        let jitter = parseFloat(document.getElementById('jitter-value').textContent);
        
        // Add small random variations to simulate real-time changes
        consistency += (Math.random() * 0.06) - 0.03; // +/- 0.03
        jitter += (Math.random() * 0.04) - 0.02; // +/- 0.02
        
        // Keep values in valid range
        consistency = Math.max(0.1, Math.min(0.95, consistency));
        jitter = Math.max(0.01, Math.min(0.9, jitter));
        
        // Update display
        document.getElementById('consistency-value').textContent = consistency.toFixed(2);
        document.getElementById('jitter-value').textContent = jitter.toFixed(2);
    }, 2000); // Update every 2 seconds
}
