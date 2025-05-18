// Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 100,
    easing: 'ease-in-out'
});

// Add loading indicator
function showLoading() {
    const loader = document.createElement('div');
    loader.className = 'loading-indicator';
    loader.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(loader);
}

function hideLoading() {
    const loader = document.querySelector('.loading-indicator');
    if (loader) {
        loader.remove();
    }
}

// Handle intro sequence and background music
document.addEventListener('DOMContentLoaded', function() {
    showLoading();
    
    const introOverlay = document.querySelector('.intro-overlay');
    const introVideo = document.getElementById('introVideo');
    const mainContent = document.querySelector('.main-content');
    const bgMusic = document.getElementById('bgMusic');
    const heroSection = document.querySelector('.hero');

    // Prevent scrolling when page loads
    document.body.style.overflow = 'hidden';

    // Scroll to hero section
    window.scrollTo(0, 0);

    // Set background music volume to 50%
    bgMusic.volume = 0.5;

    // Ensure intro video is unmuted to play its audio
    introVideo.muted = false;

    // Function to play intro video
    function startIntro() {
        console.log('Starting intro...');
        const playPromise = introVideo.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Intro started!');
                introVideo.classList.add('visible');
                document.querySelector('.click-to-play').style.display = 'none';
                document.body.style.overflow = 'hidden';
            }).catch(err => {
                console.error('Could not play intro:', err);
                // Fallback: Skip intro if video fails to play
                skipIntro();
            });
        }
    }

    // Function to skip intro
    function skipIntro() {
        introOverlay.classList.add('fade-out');
        mainContent.classList.add('visible');
        document.body.style.overflow = 'auto';
        window.scrollTo(0, 0);
        
        // Start playing background music
        setTimeout(() => {
            bgMusic.play().catch(err => {
                console.error('Music failed to play:', err);
            });
        }, 1000);
        
        // Remove intro overlay after fade out
        setTimeout(() => {
            introOverlay.remove();
            hideLoading();
        }, 1000);
    }

    // Add click event listener to the overlay
    introOverlay.addEventListener('click', startIntro);

    // When video ends
    introVideo.addEventListener('ended', skipIntro);

    // Handle video loading error
    introVideo.addEventListener('error', function(e) {
        console.error('Video error:', e);
        skipIntro();
    });

    // Add event listener for background music errors
    bgMusic.addEventListener('error', (e) => {
        console.error('Music error:', e);
    });

    // Add event listener for intro video loading
    introVideo.addEventListener('loadeddata', () => {
        console.log('Video loaded');
        hideLoading();
    });

    // Add event listener for video play state
    introVideo.addEventListener('playing', () => {
        console.log('Video playing');
    });

    // Add event listener for video pause state
    introVideo.addEventListener('pause', () => {
        console.log('Video paused');
    });

    // Prevent scrolling when intro overlay is visible
    window.addEventListener('scroll', function() {
        if (!introOverlay.classList.contains('fade-out')) {
            window.scrollTo(0, 0);
        }
    });
});

// Video speed control and auto-scroll
document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('heroVideo');
    if (video) {
        // Set video playback speed to 0.5 (half speed)
        video.playbackRate = 0.5;

        // Scroll after 9 seconds
        setTimeout(() => {
            const nextSection = document.querySelector('.journey');
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 9000);
    }
});

// Add click event listeners to trivia cards
document.querySelectorAll('.trivia-card').forEach(card => {
    card.addEventListener('click', () => {
        card.style.transform = card.style.transform === 'rotateY(180deg)' 
            ? 'rotateY(0deg)' 
            : 'rotateY(180deg)';
    });
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Typewriter effect for quotes
function typeWriter(element, text, speed = 50) {
    if (!element || !text) return;
    
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typewriter effect for quotes when they come into view
const quoteElements = document.querySelectorAll('.quote-text');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const text = entry.target.getAttribute('data-text');
            if (text) {
                typeWriter(entry.target, text);
                observer.unobserve(entry.target);
            }
        }
    });
}, { threshold: 0.5 });

quoteElements.forEach(quote => {
    const text = quote.textContent;
    if (text) {
        quote.setAttribute('data-text', text);
        observer.observe(quote);
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.pageYOffset;
        hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
    }
});

// Horizontal scroll for Akatsuki section
const akatsukiScroll = document.querySelector('.akatsuki-scroll');
if (akatsukiScroll) {
    let isDown = false;
    let startX;
    let scrollLeft;

    akatsukiScroll.addEventListener('mousedown', (e) => {
        isDown = true;
        akatsukiScroll.style.cursor = 'grabbing';
        startX = e.pageX - akatsukiScroll.offsetLeft;
        scrollLeft = akatsukiScroll.scrollLeft;
    });

    akatsukiScroll.addEventListener('mouseleave', () => {
        isDown = false;
        akatsukiScroll.style.cursor = 'grab';
    });

    akatsukiScroll.addEventListener('mouseup', () => {
        isDown = false;
        akatsukiScroll.style.cursor = 'grab';
    });

    akatsukiScroll.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - akatsukiScroll.offsetLeft;
        const walk = (x - startX) * 2;
        akatsukiScroll.scrollLeft = scrollLeft - walk;
    });
}

// End animation
const endAnimation = document.getElementById('endAnimation');
const animationContainer = document.querySelector('.video-animation-container');
let animationShown = false;

function checkEndAnimation() {
    const animationSection = document.querySelector('.video-animation');
    if (!animationSection) return;
    
    const rect = animationSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // When the section is 50% visible in the viewport
    if (rect.top <= windowHeight * 0.5 && rect.bottom >= windowHeight * 0.5) {
        if (!animationShown) {
            animationContainer.classList.add('visible');
            animationShown = true;
        }
    }
}

// Add event listener for image loading
if (endAnimation) {
    endAnimation.addEventListener('load', () => {
        console.log('Animation loaded');
    });

    // Add event listener for image errors
    endAnimation.addEventListener('error', (e) => {
        console.error('Animation error:', e);
    });
}

window.addEventListener('scroll', checkEndAnimation);
// Initial check in case the section is already in view
checkEndAnimation();

// Handle shinobi card voice playback
document.addEventListener('DOMContentLoaded', function() {
    const shinobiCards = document.querySelectorAll('.shinobi-card');
    let currentVoice = null;

    shinobiCards.forEach(card => {
        const cardInner = card.querySelector('.card-inner');
        const voiceQuote = card.querySelector('.voice-quote');
        if (!cardInner || !voiceQuote) return;
        
        let isFlipped = false;

        // Set volume for all voice quotes
        voiceQuote.volume = 0.7;

        card.addEventListener('click', function() {
            // Toggle flipped state
            isFlipped = !isFlipped;
            
            // If there's a currently playing audio, stop it
            if (currentVoice && currentVoice !== voiceQuote) {
                currentVoice.pause();
                currentVoice.currentTime = 0;
            }

            // If the card is being flipped to show the back
            if (isFlipped) {
                // Play the voice quote
                voiceQuote.play().catch(err => {
                    console.error('Voice error:', err);
                });
                currentVoice = voiceQuote;
            } else {
                // If the card is being flipped back, stop the audio
                voiceQuote.pause();
                voiceQuote.currentTime = 0;
                currentVoice = null;
            }
        });

        // Add event listener for when audio ends
        voiceQuote.addEventListener('ended', function() {
            currentVoice = null;
        });

        // Add event listener for audio errors
        voiceQuote.addEventListener('error', function(e) {
            console.error('Voice error:', e);
        });

        // Add event listener for audio loading
        voiceQuote.addEventListener('loadeddata', function() {
            console.log('Voice loaded:', voiceQuote.src);
        });
    });
}); 