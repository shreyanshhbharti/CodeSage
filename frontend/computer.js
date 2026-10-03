/**
 * CodeSage — Retro Computer Experience Controller
 * Cinematic Camera Dolly-In, Protected UI Zones, Physical Coordinated Parallax
 */

document.addEventListener("DOMContentLoaded", () => {
    const machineSection = document.querySelector(".codesage-machine-section");
    const stickyViewport = document.getElementById("machine-sticky-viewport");
    const computerRig = document.getElementById("retro-computer-rig");
    const storyMarkers = document.querySelectorAll(".story-chapter-btn, .story-marker-pill");
    const storyCaption = document.getElementById("machine-story-caption");
    const captionTitle = document.getElementById("caption-title");
    const captionDesc = document.getElementById("caption-desc");

    // Parallax Environment Elements
    const deskWall = document.getElementById("desk-wall");
    const deskSurface = document.getElementById("desk-surface");
    const deskMug = document.getElementById("desk-mug");
    const deskCable = document.getElementById("desk-cable");
    const monitorShadow = document.getElementById("monitor-shadow");

    // Sticky Notes
    const noteLeft = document.querySelector(".note-top-left");
    const noteRight = document.querySelector(".bezel-sticky-cluster");

    // Physical Controls
    const crtPowerBtn = document.getElementById("crt-power-btn");
    const crtPowerLed = document.getElementById("crt-power-led");
    const crtScreen = document.querySelector(".crt-screen-housing, .crt-glass-tube");

    if (!machineSection || !computerRig) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // -------------------------------------------------------------
    // 1. Story Chapters & Editorial Captions
    // -------------------------------------------------------------
    const storySteps = [
        {
            title: "01 / MEET YOUR MENTOR",
            desc: "A programming mentor that teaches you how to think, not what to type."
        },
        {
            title: "02 / WRITE YOUR ATTEMPT",
            desc: "Tackle algorithmic challenges with your own intuition first."
        },
        {
            title: "03 / SOCRATIC HINTING",
            desc: "Progressive diagnostic feedback that reveals patterns, not answers."
        },
        {
            title: "04 / PERMANENT MASTERY",
            desc: "Understand the root principles to solve any future variant."
        }
    ];

    let currentActiveIndex = 0;

    // -------------------------------------------------------------
    // 2. Camera Dolly-In State & Interpolation Targets
    // -------------------------------------------------------------
    let currentScrollProgress = 0;
    
    // Dolly targets
    let targetScale = 0.81;
    let targetTy = 14;
    let targetBaseRx = 2.2;
    let targetBaseRy = -1.4;

    // Current lerp values
    let currentScale = 0.81;
    let currentTy = 14;
    let currentBaseRx = 2.2;
    let currentBaseRy = -1.4;

    // Pointer Parallax Targets (Subtle Physical 3D Tilt)
    let mouseXRatio = 0.5;
    let mouseYRatio = 0.5;
    let targetMouseRx = 0;
    let targetMouseRy = 0;
    let currentMouseRx = 0;
    let currentMouseRy = 0;

    // Environmental Parallax Targets
    let targetWallTy = 0;
    let targetWallScale = 1.0;
    let targetDeskTy = 0;
    let targetMugTx = 0;
    let targetMugTy = 0;
    let targetMugScale = 0.90;
    let targetCableTx = 0;
    let targetCableTy = 0;
    let targetCableScale = 0.92;
    let targetShadowScale = 0.84;
    let targetShadowOpacity = 0.60;

    function onScroll() {
        if (prefersReducedMotion || window.innerWidth <= 960) {
            computerRig.style.transform = "none";
            return;
        }

        const rect = machineSection.getBoundingClientRect();
        const sectionHeight = machineSection.offsetHeight;
        const windowHeight = window.innerHeight;

        // Calculate progress from 0 (entry) to 1 (exit)
        const scrollDistance = -rect.top;
        const maxScroll = sectionHeight - windowHeight;
        
        let progress = 0;
        if (maxScroll > 0) {
            progress = Math.min(Math.max(scrollDistance / maxScroll, 0), 1);
        }
        currentScrollProgress = progress;

        // -------------------------------------------------------------
        // Camera Dolly-In Motion:
        // Progress 0.00 -> 0.82: Camera approaches workstation.
        // Progress 0.82 -> 1.00: Workstation settles in Product View.
        // -------------------------------------------------------------
        const approachEnd = 0.82;
        const rawT = Math.min(progress / approachEnd, 1.0);
        // Silky easeOutCubic curve
        const approach = 1 - Math.pow(1 - rawT, 3);

        // Primary: Camera Dolly Scale (0.81 Room View -> 1.00 Product View)
        targetScale = 0.81 + (0.19 * approach);

        // Very Subtle TranslateY: Settles down into desk anchor (14px -> 0px)
        // Never moves upward into the protected navbar area!
        targetTy = 14 * (1 - approach);

        // Subtle Perspective Angle Transition:
        // Room View: 2.2deg looking down into room
        // Product View: 0.6deg eye-level directly facing CRT display
        targetBaseRx = 2.2 - (1.6 * approach);
        targetBaseRy = -1.4 + (0.9 * approach);

        // Environmental Depth Parallax (Spatially coherent workstation)
        targetWallTy = -10 * approach;
        targetWallScale = 1.0 + (0.025 * approach);
        targetDeskTy = 4 * approach;
        
        targetMugTx = -14 * approach;
        targetMugTy = 6 * approach;
        targetMugScale = 0.90 + (0.10 * approach);

        targetCableTx = 10 * approach;
        targetCableTy = 4 * approach;
        targetCableScale = 0.92 + (0.08 * approach);

        targetShadowScale = 0.84 + (0.16 * approach);
        targetShadowOpacity = 0.60 + (0.40 * approach);

        // -------------------------------------------------------------
        // Three Camera Visual Stages Across Four Story Chapters:
        // 0.00 – 0.25: Room View (Chapter 01)
        // 0.25 – 0.55: Camera Approach (Chapter 02)
        // 0.55 – 0.80: Workstation Focus (Chapter 03)
        // 0.80 – 1.00: Product View (Chapter 04)
        // -------------------------------------------------------------
        let activeIndex = 0;
        if (progress >= 0.80) activeIndex = 3;
        else if (progress >= 0.55) activeIndex = 2;
        else if (progress >= 0.25) activeIndex = 1;
        else activeIndex = 0;

        if (activeIndex !== currentActiveIndex) {
            currentActiveIndex = activeIndex;
            updateStoryChapterUI(activeIndex);
        }

        // Micro-parallax for sticky notes (staying attached to bezel)
        if (noteLeft) {
            const shiftL = (approach - 0.5) * 8;
            noteLeft.style.transform = `translateY(${shiftL}px) rotate(${-6 + approach * 1.5}deg)`;
        }
        if (noteRight) {
            const shiftR = -(approach - 0.5) * 8;
            noteRight.style.transform = `translateY(${shiftR}px) rotate(${4 - approach * 1.5}deg)`;
        }
    }

    function updateStoryChapterUI(index) {
        storyMarkers.forEach((marker, idx) => {
            if (idx === index) {
                marker.classList.add("active");
                marker.setAttribute("aria-selected", "true");
            } else {
                marker.classList.remove("active");
                marker.setAttribute("aria-selected", "false");
            }
        });

        if (captionTitle && captionDesc && storySteps[index]) {
            if (storyCaption) {
                storyCaption.style.opacity = "0";
                setTimeout(() => {
                    captionTitle.textContent = storySteps[index].title;
                    captionDesc.textContent = storySteps[index].desc;
                    storyCaption.style.opacity = "1";
                }, 140);
            } else {
                captionTitle.textContent = storySteps[index].title;
                captionDesc.textContent = storySteps[index].desc;
            }
        }
    }

    // Click on chapter markers for smooth navigation
    storyMarkers.forEach((marker, idx) => {
        marker.addEventListener("click", () => {
            const chapterPcts = [0.0, 0.35, 0.65, 0.90];
            const sectionHeight = machineSection.offsetHeight;
            const windowHeight = window.innerHeight;
            const maxScroll = sectionHeight - windowHeight;
            if (maxScroll > 0) {
                const targetY = machineSection.offsetTop + (maxScroll * chapterPcts[idx]);
                window.scrollTo({ top: targetY, behavior: "smooth" });
            }
        });
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();

    // Check for direct anchor or view parameter
    if (window.location.search.includes("view=machine") || window.location.hash === "#machine") {
        const targetScroll = machineSection.offsetTop + (machineSection.offsetHeight * 0.30);
        window.scrollTo({ top: targetScroll, behavior: "instant" });
        onScroll();
    }

    // -------------------------------------------------------------
    // 3. Smooth RAF Loop (Camera Dolly & Parallax Interpolation)
    // -------------------------------------------------------------
    function renderFrame() {
        if (!prefersReducedMotion && window.innerWidth > 960) {
            // Lerp scale and translateY
            currentScale += (targetScale - currentScale) * 0.12;
            currentTy += (targetTy - currentTy) * 0.12;

            // Base dolly angles
            currentBaseRx += (targetBaseRx - currentBaseRx) * 0.10;
            currentBaseRy += (targetBaseRy - currentBaseRy) * 0.10;

            // Pointer parallax angles
            currentMouseRx += (targetMouseRx - currentMouseRx) * 0.08;
            currentMouseRy += (targetMouseRy - currentMouseRy) * 0.08;

            const totalRx = currentBaseRx + currentMouseRx;
            const totalRy = currentBaseRy + currentMouseRy;

            // Transform retro computer rig
            computerRig.style.transform = `
                translate3d(0, ${currentTy.toFixed(2)}px, 0)
                scale(${currentScale.toFixed(3)})
                rotateX(${totalRx.toFixed(2)}deg)
                rotateY(${totalRy.toFixed(2)}deg)
            `;

            // Environmental Parallax (Background, Desk, Mug, Cable, Shadow)
            if (deskWall) {
                deskWall.style.transform = `translate3d(0, ${targetWallTy.toFixed(2)}px, 0) scale(${targetWallScale.toFixed(3)})`;
            }
            if (deskSurface) {
                deskSurface.style.transform = `translate3d(0, ${targetDeskTy.toFixed(2)}px, 0)`;
            }
            if (deskMug) {
                deskMug.style.transform = `translate3d(${targetMugTx.toFixed(2)}px, ${targetMugTy.toFixed(2)}px, 0) scale(${targetMugScale.toFixed(3)})`;
            }
            if (deskCable) {
                deskCable.style.transform = `translate3d(${targetCableTx.toFixed(2)}px, ${targetCableTy.toFixed(2)}px, 0) scale(${targetCableScale.toFixed(3)})`;
            }
            if (monitorShadow) {
                monitorShadow.style.transform = `translateX(-40%) scale(${targetShadowScale.toFixed(3)})`;
                monitorShadow.style.opacity = targetShadowOpacity.toFixed(2);
            }
        }

        requestAnimationFrame(renderFrame);
    }
    requestAnimationFrame(renderFrame);

    // -------------------------------------------------------------
    // 4. Pointer Parallax (Desktop Only, Subtle ±1.2deg)
    // -------------------------------------------------------------
    if (window.innerWidth > 960) {
        machineSection.addEventListener("mousemove", (e) => {
            if (prefersReducedMotion) return;

            const rect = machineSection.getBoundingClientRect();
            mouseXRatio = (e.clientX - rect.left) / rect.width;
            mouseYRatio = (e.clientY - rect.top) / rect.height;

            targetMouseRy = ((mouseXRatio - 0.5) * 2.0); // -1.0deg to +1.0deg
            targetMouseRx = -((mouseYRatio - 0.5) * 1.4); // -0.7deg to +0.7deg
        }, { passive: true });

        machineSection.addEventListener("mouseleave", () => {
            targetMouseRx = 0;
            targetMouseRy = 0;
        });
    }

    // -------------------------------------------------------------
    // 5. Physical Micro-Interactions
    // -------------------------------------------------------------
    // Tactile Power Button Toggle
    if (crtPowerBtn && crtPowerLed && crtScreen) {
        crtPowerBtn.addEventListener("click", () => {
            const isOff = crtScreen.classList.toggle("crt-screen-off");
            if (isOff) {
                crtPowerLed.style.background = "#A39C8C";
                crtPowerLed.style.boxShadow = "none";
                crtPowerLed.style.animation = "none";
            } else {
                crtPowerLed.style.background = "#50FA7B";
                crtPowerLed.style.boxShadow = "0 0 6px #50FA7B, 0 0 12px rgba(80, 250, 123, 0.6)";
                crtPowerLed.style.animation = "ledPulse 3.5s ease-in-out infinite";
            }
        });
    }

    // Interactive Key Click Sounds / Feedback
    const keyboardKeys = document.querySelectorAll(".retro-keyboard-chassis .key");
    keyboardKeys.forEach(k => {
        k.addEventListener("click", () => {
            k.style.transform = "translateY(2px)";
            setTimeout(() => {
                k.style.transform = "";
            }, 120);
        });
    });
});
