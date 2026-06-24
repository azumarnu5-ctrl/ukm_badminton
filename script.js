/**
 * script.js - Vanilla JS Logic for BadmintonHub
 */

document.addEventListener('DOMContentLoaded', () => {

    // 0. INIT AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            once: true,
            offset: 50,
            duration: 800,
            easing: 'ease-out-cubic',
        });
    }

    // 1. PRELOADER
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                document.body.classList.remove('overflow-hidden');
            }, 500);
        }, 800); // Minimum showing time
    });
    // Fallback if load fails
    setTimeout(() => { if(preloader && preloader.style.display !== 'none') { preloader.style.opacity = '0'; setTimeout(()=>preloader.style.display='none',500); } }, 3000);

    // 2. CUSTOM CURSOR
    const cursor = document.getElementById('custom-cursor');
    const follower = document.getElementById('custom-cursor-follower');
    const cursorHoverElements = document.querySelectorAll('.cursor-hover, a, button, input, select, textarea');

    if (window.innerWidth >= 768 && cursor && follower) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Immediate update for dot
            cursor.style.left = `${mouseX}px`;
            cursor.style.top = `${mouseY}px`;
        });

        // Smooth follow for circle
        const animateFollower = () => {
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            follower.style.left = `${followerX}px`;
            follower.style.top = `${followerY}px`;
            requestAnimationFrame(animateFollower);
        };
        animateFollower();

        cursorHoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                follower.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                follower.classList.remove('hover');
            });
        });
    }

    // 3. DARK MODE TOGGLE (LocalStorage)
    const themeToggleBtn = document.getElementById('theme-toggle');
    const mobileThemeToggleBtn = document.getElementById('mobile-theme-toggle');
    const htmlElement = document.documentElement;
    
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlElement.classList.add('dark');
    } else {
        htmlElement.classList.remove('dark');
    }

    const toggleTheme = () => {
        htmlElement.classList.toggle('dark');
        if (htmlElement.classList.contains('dark')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    };

    if(themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
    if(mobileThemeToggleBtn) mobileThemeToggleBtn.addEventListener('click', toggleTheme);

    // 4. SCROLL PROGRESS BAR & BACK TO TOP & NAVBAR SHADOW
    const progressBar = document.getElementById('scroll-progress');
    const backToTop = document.getElementById('backToTop');
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        // Progress Bar
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;
        if(progressBar) progressBar.style.width = scrollPercentage + '%';

        // Back to Top
        if(backToTop) {
            if (scrollTop > 500) {
                backToTop.classList.remove('opacity-0', 'translate-y-10', 'invisible');
                backToTop.classList.add('opacity-100', 'translate-y-0', 'visible');
            } else {
                backToTop.classList.add('opacity-0', 'translate-y-10', 'invisible');
                backToTop.classList.remove('opacity-100', 'translate-y-0', 'visible');
            }
        }

        // Navbar Shadow on scroll
        if(navbar) {
            if (scrollTop > 10) {
                navbar.classList.add('shadow-md');
            } else {
                navbar.classList.remove('shadow-md');
            }
        }
    });

    if(backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 5. MOBILE MENU
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileBtn && mobileMenu) {
        const menuIcon = mobileBtn.querySelector('i');
        const toggleMenu = () => {
            if (mobileMenu.classList.contains('max-h-0')) {
                mobileMenu.classList.remove('max-h-0');
                mobileMenu.classList.add('max-h-screen');
                menuIcon.classList.remove('fa-bars');
                menuIcon.classList.add('fa-xmark');
            } else {
                mobileMenu.classList.add('max-h-0');
                mobileMenu.classList.remove('max-h-screen');
                menuIcon.classList.remove('fa-xmark');
                menuIcon.classList.add('fa-bars');
            }
        };

        mobileBtn.addEventListener('click', toggleMenu);
        document.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', toggleMenu);
        });
    }

    // 6. RIPPLE EFFECT
    document.querySelectorAll('.btn-ripple').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // 7. DYNAMIC TYPING EFFECT
    const textElement = document.getElementById('typed-text');
    if (textElement) {
        const words = ["Smash Your Limits", "Raih Prestasi", "Bangun Solidaritas"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeEffect() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                textElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                textElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 2000; // Pause at end of word
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500; // Pause before new word
            }

            setTimeout(typeEffect, typeSpeed);
        }
        setTimeout(typeEffect, 1000);
    }

    // 8. COUNTER ANIMATION (Intersection Observer)
    const counters = document.querySelectorAll('.counter-value');
    let hasCounted = false;

    const countUp = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target;
                }
            };
            updateCounter();
        });
        hasCounted = true;
    };

    const counterSection = document.getElementById('counter-section');
    if (counterSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasCounted) {
                countUp();
            }
        }, { threshold: 0.5 });
        observer.observe(counterSection);
    }

    // 9. INTERACTIVE SCHEDULE TABS
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all btns
            tabBtns.forEach(b => {
                b.classList.remove('bg-primary-600', 'text-white', 'shadow-lg');
                b.classList.add('bg-white', 'dark:bg-dark-card', 'text-gray-600', 'dark:text-gray-300');
            });
            // Add active to clicked btn
            btn.classList.remove('bg-white', 'dark:bg-dark-card', 'text-gray-600', 'dark:text-gray-300');
            btn.classList.add('bg-primary-600', 'text-white', 'shadow-lg');

            // Hide all panels
            tabPanels.forEach(panel => {
                panel.classList.remove('opacity-100', 'z-10', 'pointer-events-auto');
                panel.classList.add('opacity-0', 'z-0', 'pointer-events-none');
            });

            // Show target panel
            const target = document.getElementById(`tab-${btn.dataset.tab}`);
            if (target) {
                target.classList.remove('opacity-0', 'z-0', 'pointer-events-none');
                target.classList.add('opacity-100', 'z-10', 'pointer-events-auto');
            }
        });
    });

    // 10. DYNAMIC GALLERY FILTER
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update buttons
            filterBtns.forEach(b => {
                b.classList.remove('bg-primary-600', 'text-white');
                b.classList.add('bg-gray-100', 'dark:bg-dark-card', 'text-gray-600', 'dark:text-gray-300');
            });
            btn.classList.remove('bg-gray-100', 'dark:bg-dark-card', 'text-gray-600', 'dark:text-gray-300');
            btn.classList.add('bg-primary-600', 'text-white');

            const filter = btn.dataset.filter;

            galleryItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.classList.remove('hide');
                    setTimeout(() => item.style.display = 'block', 0);
                } else {
                    item.classList.add('hide');
                    setTimeout(() => {
                        if(item.classList.contains('hide')) item.style.display = 'none';
                    }, 400); // wait for scale animation
                }
            });
        });
    });

    // 11. TESTIMONIAL CAROUSEL
    const track = document.getElementById('testimonial-track');
    if (track) {
        const slides = Array.from(track.children);
        const nextBtn = document.getElementById('next-slide');
        const prevBtn = document.getElementById('prev-slide');
        const dots = Array.from(document.getElementById('carousel-dots').children);
        
        let currentIndex = 0;

        const updateCarousel = (index) => {
            track.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach((dot, i) => {
                if (i === index) {
                    dot.classList.replace('bg-white/30', 'bg-white');
                } else {
                    dot.classList.replace('bg-white', 'bg-white/30');
                }
            });
        };

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
                updateCarousel(currentIndex);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex === 0) ? slides.length - 1 : currentIndex - 1;
                updateCarousel(currentIndex);
            });
        }

        // Swipe logic for touch devices
        let startX;
        track.addEventListener('touchstart', e => startX = e.touches[0].clientX);
        track.addEventListener('touchend', e => {
            const endX = e.changedTouches[0].clientX;
            if (startX - endX > 50) nextBtn.click(); // Swipe left
            if (endX - startX > 50) prevBtn.click(); // Swipe right
        });
    }

    // 12. FAQ ACCORDION
    const faqBtns = document.querySelectorAll('.faq-btn');
    faqBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const content = btn.nextElementSibling;
            const icon = btn.querySelector('i');
            
            // Close others
            faqBtns.forEach(otherBtn => {
                if (otherBtn !== btn) {
                    otherBtn.nextElementSibling.style.maxHeight = null;
                    otherBtn.querySelector('i').style.transform = 'rotate(0deg)';
                }
            });

            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                icon.style.transform = 'rotate(0deg)';
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });

    // 13. MULTI-STEP FORM TO WHATSAPP API & TOAST NOTIFICATION
    const steps = document.querySelectorAll('.form-step');
    const nextBtns = document.querySelectorAll('.btn-next');
    const prevBtns = document.querySelectorAll('.btn-prev');
    const progressBarStep = document.getElementById('form-progress-bar');
    const stepIndicator = document.getElementById('step-indicator');
    const form = document.getElementById('multiStepForm');

    // Toast Function
    const showToast = (title, message, type = 'success') => {
        const container = document.getElementById('toast-container');
        if (!container) return;
        
        const toast = document.createElement('div');
        const icon = type === 'success' ? '<i class="fa-solid fa-check-circle text-green-500 text-xl"></i>' : '<i class="fa-solid fa-circle-exclamation text-red-500 text-xl"></i>';
        
        toast.className = `toast bg-white dark:bg-dark-card shadow-2xl rounded-2xl p-4 border-l-4 ${type === 'success' ? 'border-green-500' : 'border-red-500'} flex items-start gap-3 pointer-events-auto min-w-[300px]`;
        toast.innerHTML = `
            <div class="mt-0.5">${icon}</div>
            <div>
                <h4 class="font-bold text-gray-900 dark:text-white">${title}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">${message}</p>
            </div>
            <button class="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" onclick="this.parentElement.remove()"><i class="fa-solid fa-xmark"></i></button>
        `;
        
        container.appendChild(toast);
        
        // Animate in
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Remove after 5s
        setTimeout(() => {
            toast.classList.remove('show');
            toast.classList.add('hide');
            setTimeout(() => toast.remove(), 400);
        }, 5000);
    };

    const updateFormStep = (currentStepTarget) => {
        steps.forEach(step => {
            const stepNum = parseInt(step.dataset.step);
            if (stepNum === currentStepTarget) {
                step.classList.remove('translate-x-full', '-translate-x-full', 'opacity-0', 'pointer-events-none');
                step.classList.add('translate-x-0', 'opacity-100', 'pointer-events-auto');
            } else if (stepNum < currentStepTarget) {
                step.classList.remove('translate-x-0', 'translate-x-full', 'opacity-100', 'pointer-events-auto');
                step.classList.add('-translate-x-full', 'opacity-0', 'pointer-events-none');
            } else {
                step.classList.remove('translate-x-0', '-translate-x-full', 'opacity-100', 'pointer-events-auto');
                step.classList.add('translate-x-full', 'opacity-0', 'pointer-events-none');
            }
        });

        // Update indicators
        if(stepIndicator) stepIndicator.innerText = currentStepTarget;
        if(progressBarStep) progressBarStep.style.width = `${(currentStepTarget / 3) * 100}%`;
    };

    // Validation
    const validateStep = (stepNum) => {
        let isValid = true;
        const currentPanel = document.querySelector(`.form-step[data-step="${stepNum}"]`);
        if(!currentPanel) return false;
        
        const errMsgs = currentPanel.querySelectorAll('.err-msg');
        // Hide all errors first
        errMsgs.forEach(err => err.classList.add('hidden'));

        if (stepNum === 1) {
            const name = document.getElementById('regName');
            const nim = document.getElementById('regNim');
            const jurusan = document.getElementById('regJurusan');

            if (!name.value.trim()) { isValid = false; name.nextElementSibling.classList.remove('hidden'); }
            if (!nim.value.trim() || !jurusan.value.trim()) { isValid = false; jurusan.nextElementSibling.classList.remove('hidden'); }
        } 
        else if (stepNum === 2) {
            const skillChecked = document.querySelector('input[name="skill"]:checked');
            const program = document.getElementById('regProgram');

            if (!skillChecked) { isValid = false; document.getElementById('skillError').classList.remove('hidden'); }
            if (!program.value) { isValid = false; program.nextElementSibling.classList.remove('hidden'); }
        }
        else if (stepNum === 3) {
            const phone = document.getElementById('regPhone');
            const phoneRegex = /^08[0-9]{8,11}$/; // Basic ID phone validation
            if (!phoneRegex.test(phone.value.replace(/[\s-]/g, ''))) { 
                isValid = false; 
                phone.nextElementSibling.classList.remove('hidden'); 
            }
        }
        
        if (!isValid) showToast('Validasi Gagal', 'Harap periksa kembali isian Anda.', 'error');
        return isValid;
    };

    nextBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const currentStep = parseInt(e.target.closest('.form-step').dataset.step);
            if (validateStep(currentStep)) {
                updateFormStep(currentStep + 1);
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const currentStep = parseInt(e.target.closest('.form-step').dataset.step);
            updateFormStep(currentStep - 1);
        });
    });

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (validateStep(3)) {
                const btn = document.getElementById('btnSubmitForm');
                const originalContent = btn.innerHTML;
                btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Memproses...';
                btn.disabled = true;

                // Simulate processing before redirect
                setTimeout(() => {
                    showToast('Pendaftaran Berhasil!', 'Mengarahkan ke WhatsApp panitia...');
                    
                    // 1. Gather all form data
                    const name = document.getElementById('regName').value.trim();
                    const nim = document.getElementById('regNim').value.trim();
                    const jurusan = document.getElementById('regJurusan').value.trim();
                    const skill = document.querySelector('input[name="skill"]:checked').value;
                    const program = document.getElementById('regProgram').value;
                    const phone = document.getElementById('regPhone').value.trim();
                    const message = document.getElementById('regMessage').value.trim();

                    // 2. Format WhatsApp Message Template
                    const waText = `Halo Admin BadmintonHub! 👋\n\nSaya ingin mendaftar dengan data berikut:\n\n*DATA DIRI*\nNama Lengkap: ${name}\nNIM / Jurusan: ${nim} / ${jurusan}\nNo. WhatsApp: ${phone}\n\n*PENGALAMAN & PROGRAM*\nTingkat Kemampuan: ${skill}\nPilihan Program: ${program}\n\n*CATATAN TAMBAHAN*\n${message ? message : '-'}\n\nMohon informasi pendaftaran selanjutnya. Terima kasih!`;

                    // 3. Encode & Construct URL
                    const encodedText = encodeURIComponent(waText);
                    const waNumber = "6281234567890"; // Ganti dengan nomor asli admin UKM
                    const waUrl = `https://wa.me/${waNumber}?text=${encodedText}`;

                    // 4. Redirect & Reset Form
                    setTimeout(() => {
                        window.open(waUrl, '_blank');
                        form.reset();
                        updateFormStep(1); // Reset to step 1
                        btn.innerHTML = originalContent;
                        btn.disabled = false;
                    }, 1500); // 1.5 seconds delay to let user read the toast

                }, 500); // 0.5s processing simulation
            }
        });
    }

    // Set footer year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.innerText = new Date().getFullYear();

});
