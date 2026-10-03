/**
 * CodeSage — AI Programming Mentor
 * Editorial Scroll Choreography, Sticky Storytelling, & Product Interactive Logic
 */

document.addEventListener("DOMContentLoaded", () => {
    // -------------------------------------------------------------
    // 1. Refined Navigation Scroll State & Mobile Menu
    // -------------------------------------------------------------
    const floatingNavbar = document.getElementById("floating-navbar");
    const mobileToggle = document.getElementById("nav-mobile-toggle");
    const mobileDrawerMenu = document.getElementById("mobile-drawer-menu");
    const navItems = document.querySelectorAll(".nav-center-links .nav-item");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 25) {
            floatingNavbar.classList.add("scrolled-nav");
        } else {
            floatingNavbar.classList.remove("scrolled-nav");
        }

        // Active navigation item tracking
        let currentActiveIdx = -1;
        const scrollPos = window.scrollY + 160;
        const trackedSections = [
            { id: "hero", navIdx: -1 },
            { id: "machine", navIdx: 0 },
            { id: "process", navIdx: 1 },
            { id: "developer-dna", navIdx: 2 }
        ];

        trackedSections.forEach(section => {
            const el = document.getElementById(section.id);
            if (el && scrollPos >= el.offsetTop) {
                currentActiveIdx = section.navIdx;
            }
        });

        navItems.forEach((item, idx) => {
            if (idx === currentActiveIdx) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }
        });
    }, { passive: true });

    if (mobileToggle && mobileDrawerMenu) {
        mobileToggle.addEventListener("click", () => {
            mobileToggle.classList.toggle("open");
            mobileDrawerMenu.classList.toggle("open");
        });

        mobileDrawerMenu.querySelectorAll(".drawer-link, .drawer-cta").forEach(link => {
            link.addEventListener("click", () => {
                mobileToggle.classList.remove("open");
                mobileDrawerMenu.classList.remove("open");
            });
        });
    }

    // -------------------------------------------------------------
    // 2. Natural Scroll Reveal (IntersectionObserver)
    // -------------------------------------------------------------
    const scrollRevealElements = document.querySelectorAll(".scroll-reveal");

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: "0px 0px -40px 0px"
        });

        scrollRevealElements.forEach(el => revealObserver.observe(el));
    } else {
        scrollRevealElements.forEach(el => el.classList.add("revealed"));
    }

    // -------------------------------------------------------------
    // 3. Scroll Choreography: Product Workspace & Pinned Storytelling
    // -------------------------------------------------------------
    const productWorkspace = document.getElementById("product-workspace");
    const giantWordmark = document.querySelector(".giant-wordmark-title, .giant-wordmark-text");
    const stageCards = document.querySelectorAll(".process-stage-card, .stage-scroll-card");
    const activeStepText = document.getElementById("active-step-text");

    const stageNames = {
        "1": "01 / 05 — ATTEMPT",
        "2": "02 / 05 — ANALYZE",
        "3": "03 / 05 — HINT",
        "4": "04 / 05 — RETRY",
        "5": "05 / 05 — UNDERSTAND"
    };

    let ticking = false;

    function handleScrollChoreography() {
        const windowHeight = window.innerHeight;

        // A. Product Workspace Scale & Focus
        if (productWorkspace) {
            const workspaceRect = productWorkspace.getBoundingClientRect();
            if (workspaceRect.top < windowHeight * 0.75 && workspaceRect.bottom > 0) {
                productWorkspace.classList.add("in-focus");
            } else {
                productWorkspace.classList.remove("in-focus");
            }
        }

        // B. Process Sticky Stage Active Tracker
        if (stageCards.length > 0) {
            stageCards.forEach(card => {
                const rect = card.getBoundingClientRect();
                if (rect.top <= windowHeight * 0.55 && rect.bottom >= windowHeight * 0.25) {
                    stageCards.forEach(c => c.classList.remove("active"));
                    card.classList.add("active");
                    const stageNum = card.getAttribute("data-stage");
                    if (activeStepText && stageNames[stageNum]) {
                        activeStepText.textContent = stageNames[stageNum];
                    }
                }
            });
        }

        // C. Giant Wordmark Reveal on Footer Entry
        if (giantWordmark) {
            const wordmarkRect = giantWordmark.getBoundingClientRect();
            if (wordmarkRect.top < windowHeight) {
                const progress = Math.min(1, Math.max(0, (windowHeight - wordmarkRect.top) / (windowHeight * 0.7)));
                const scaleVal = 0.94 + progress * 0.06;
                giantWordmark.style.transform = `scale(${scaleVal})`;
            }
        }

        ticking = false;
    }

    window.addEventListener("scroll", () => {
        if (!ticking) {
            window.requestAnimationFrame(handleScrollChoreography);
            ticking = true;
        }
    }, { passive: true });

    // Initial check on load
    handleScrollChoreography();

    // -------------------------------------------------------------
    // 4. Hero Product Preview: Problem Database & Socratic Hints
    // -------------------------------------------------------------
    const problemDatabase = {
        twosum: {
            fileName: "solution.js",
            langTag: "JavaScript ES6",
            code: `<span class="c-kw">function</span> <span class="c-fn">twoSum</span>(nums, target) {
    <span class="c-cm">// Brute force attempt: nested comparison</span>
    <span class="c-kw">for</span> (<span class="c-kw">let</span> i = 0; i &lt; nums.length; i++) {
        <span class="c-kw">for</span> (<span class="c-kw">let</span> j = i + 1; j &lt; nums.length; j++) {
            <span class="c-warn-line"><span class="c-kw">if</span> (nums[i] + nums[j] === target) {</span>
                <span class="c-kw">return</span> [i, j];
            }
        }
    }
    <span class="c-kw">return</span> [];
}`,
            warning: "O(n²) Time Complexity Detected",
            observation: "Your solution correctly finds matching pairs, but the nested loop scans the array repeatedly. Can we look up the needed difference faster?",
            pattern: "Hash Map Complement",
            targetBigO: "O(n) Time / O(n) Space",
            hints: [
                {
                    badge: "Conceptual",
                    text: `Instead of checking all pairs, what data structure lets you check whether the complement <code class="inline-code">target - nums[i]</code> already exists in <span class="highlight-code">O(1)</span> time?`
                },
                {
                    badge: "Data Structure",
                    text: `A JavaScript <code class="inline-code">Map</code> or plain object can store numbers you've already seen as keys, mapped to their index: <code class="inline-code">map.set(nums[i], i)</code>.`
                },
                {
                    badge: "Implementation",
                    text: `In a single pass: calculate <code class="inline-code">complement = target - nums[i]</code>. If <code class="inline-code">map.has(complement)</code>, return <code class="inline-code">[map.get(complement), i]</code>. Otherwise, insert <code class="inline-code">nums[i]</code>.`
                }
            ]
        },
        parentheses: {
            fileName: "valid_parentheses.py",
            langTag: "Python 3.11",
            code: `<span class="c-kw">def</span> <span class="c-fn">isValid</span>(s: str) -> bool:
    <span class="c-cm"># Attempting string replacement</span>
    <span class="c-kw">while</span> <span class="c-str">"()"</span> <span class="c-kw">in</span> s <span class="c-kw">or</span> <span class="c-str">"[]"</span> <span class="c-kw">in</span> s <span class="c-kw">or</span> <span class="c-str">"{}"</span> <span class="c-kw">in</span> s:
        <span class="c-warn-line">s = s.replace(<span class="c-str">"()"</span>, <span class="c-str">""</span>).replace(<span class="c-str">"[]"</span>, <span class="c-str">""</span>)</span>
    <span class="c-kw">return</span> len(s) == 0`,
            warning: "O(n²) Allocations & String Rebuilding",
            observation: "String replacements create repeated full scans and memory allocations. Notice how the most recently opened bracket must be the first closed.",
            pattern: "LIFO Stack / Bracket Match",
            targetBigO: "O(n) Time / O(n) Space",
            hints: [
                {
                    badge: "Conceptual",
                    text: `What classic data structure naturally handles Last-In, First-Out (LIFO) order where the inner-most open bracket matches first?`
                },
                {
                    badge: "Data Structure",
                    text: `Use a <code class="inline-code">stack = []</code>. Push opening brackets <code class="inline-code">'(', '[', '{'</code> onto the stack as you encounter them.`
                },
                {
                    badge: "Implementation",
                    text: `When encountering a closing bracket, pop from the stack and verify it matches. If the stack is empty when closing or doesn't match, return <code class="inline-code">False</code>.`
                }
            ]
        },
        binarysearch: {
            fileName: "binary_search.cpp",
            langTag: "C++ 20",
            code: `<span class="c-kw">int</span> <span class="c-fn">search</span>(vector&lt;<span class="c-kw">int</span>&gt;&amp; nums, <span class="c-kw">int</span> target) {
    <span class="c-kw">int</span> left = 0, right = nums.size() - 1;
    <span class="c-kw">while</span> (left &lt; right) {
        <span class="c-warn-line"><span class="c-kw">int</span> mid = (left + right) / 2;</span>
        <span class="c-kw">if</span> (nums[mid] == target) <span class="c-kw">return</span> mid;
        <span class="c-kw">else if</span> (nums[mid] &lt; target) left = mid + 1;
        <span class="c-kw">else</span> right = mid - 1;
    }
    <span class="c-kw">return</span> -1;
}`,
            warning: "Boundary & Integer Overflow Risks",
            observation: "Two subtle edge cases: Check the loop termination condition for single-element arrays, and consider what happens when (left + right) exceeds INT_MAX.",
            pattern: "Two-Pointer Binary Partition",
            targetBigO: "O(log n) Time / O(1) Space",
            hints: [
                {
                    badge: "Boundary Check",
                    text: `What happens when <code class="inline-code">nums = [5]</code> and <code class="inline-code">target = 5</code>? With <code class="inline-code">left &lt; right</code>, the loop will never execute.`
                },
                {
                    badge: "Arithmetic Safety",
                    text: `To prevent integer overflow in large arrays, replace <code class="inline-code">(left + right) / 2</code> with <code class="inline-code">left + (right - left) / 2</code>.`
                },
                {
                    badge: "Loop Invariant",
                    text: `Change the condition to <code class="inline-code">while (left &lt;= right)</code> so that single-element search spaces are correctly evaluated.`
                }
            ]
        }
    };

    let currentProblemKey = "twosum";
    let currentHintStep = 1;

    // DOM Elements
    const problemDropdown = document.getElementById("preview-problem-dropdown");
    const previewFileName = document.getElementById("preview-file-name");
    const previewLangTag = document.getElementById("preview-lang-tag");
    const previewCodeContent = document.getElementById("preview-code-content");
    const previewEditorWarn = document.getElementById("preview-editor-warn");
    const previewObsText = document.getElementById("preview-obs-text");
    const previewHintBadge = document.getElementById("preview-hint-badge");
    const previewHintNum = document.getElementById("preview-hint-num");
    const previewHintText = document.getElementById("preview-hint-text");
    const previewHintStepper = document.getElementById("preview-hint-stepper");
    const previewNextHintBtn = document.getElementById("preview-next-hint-btn");
    const previewBtnText = document.getElementById("preview-btn-text");
    const previewMetricPattern = document.getElementById("preview-metric-pattern");

    function renderProblem(problemKey) {
        const prob = problemDatabase[problemKey];
        if (!prob) return;

        currentProblemKey = problemKey;
        currentHintStep = 1;

        if (previewFileName) previewFileName.textContent = prob.fileName;
        if (previewLangTag) previewLangTag.textContent = prob.langTag;
        if (previewCodeContent) previewCodeContent.innerHTML = prob.code;
        if (previewEditorWarn) previewEditorWarn.textContent = prob.warning;
        if (previewObsText) previewObsText.textContent = prob.observation;
        if (previewMetricPattern) previewMetricPattern.textContent = prob.pattern;

        updateHintUI();
    }

    function updateHintUI() {
        const prob = problemDatabase[currentProblemKey];
        const hint = prob.hints[currentHintStep - 1];

        if (previewHintBadge) previewHintBadge.textContent = `Hint ${currentHintStep} of 3`;
        if (previewHintNum) previewHintNum.textContent = `💡 Progressive Hint #${currentHintStep}`;
        if (previewHintText) previewHintText.innerHTML = hint.text;

        if (previewHintStepper) {
            const dashes = previewHintStepper.querySelectorAll(".dash-seg, .dot-bar");
            dashes.forEach((dash, index) => {
                if (index < currentHintStep) {
                    dash.classList.add("active");
                } else {
                    dash.classList.remove("active");
                }
            });
        }

        if (previewBtnText) {
            if (currentHintStep < 3) {
                previewBtnText.textContent = `Reveal Next Hint (${currentHintStep + 1}/3)`;
            } else {
                previewBtnText.textContent = `Reset to Hint #1`;
            }
        }
    }

    if (problemDropdown) {
        problemDropdown.addEventListener("change", (e) => {
            renderProblem(e.target.value);
        });
    }

    if (previewNextHintBtn) {
        previewNextHintBtn.addEventListener("click", () => {
            if (currentHintStep < 3) {
                currentHintStep += 1;
            } else {
                currentHintStep = 1;
            }
            updateHintUI();
        });
    }

    // Initialize default problem
    renderProblem("twosum");
});
