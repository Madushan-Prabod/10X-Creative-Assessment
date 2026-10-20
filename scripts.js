/**
 * GlowPure Skincare Studio — Premium Animation & Interaction Suite
 * Architecture: GSAP 3 + ScrollTrigger + Lenis Smooth Scroll + Accessible Fallbacks
 *
 * Libraries used:
 * - GSAP 3.12  — High-performance animation engine for coordinated, sequenced reveals
 * - ScrollTrigger — Viewport-aware triggers for scroll-based animation orchestration
 * - Lenis 1.1  — Buttery smooth-scroll normalisation across browsers and devices
 */

(function () {
  "use strict";

  // -------------------------------------------------------------------------
  // Accessibility & Environment Detection
  // -------------------------------------------------------------------------
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let prefersReducedMotion = motionQuery.matches;

  motionQuery.addEventListener("change", (e) => {
    prefersReducedMotion = e.matches;
    if (prefersReducedMotion) {
      document.documentElement.classList.add("reduced-motion");
      if (window.lenisInstance) window.lenisInstance.destroy();
    } else {
      document.documentElement.classList.remove("reduced-motion");
      initSmoothScroll();
    }
  });

  if (prefersReducedMotion) {
    document.documentElement.classList.add("reduced-motion");
  }

  const hasGSAP = typeof gsap !== "undefined";
  const hasScrollTrigger = typeof ScrollTrigger !== "undefined";

  if (hasGSAP && hasScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  // -------------------------------------------------------------------------
  // Reusable animation helpers
  // -------------------------------------------------------------------------

  /** Gentle staggered fade-up reveal — the signature GlowPure entrance */
  function revealUp(targets, triggerEl, opts = {}) {
    if (!hasGSAP || !hasScrollTrigger || prefersReducedMotion) return;
    const defaults = {
      y: 30,
      opacity: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: "power2.out",
      start: "top 82%",
      once: true,
    };
    const cfg = Object.assign({}, defaults, opts);
    return gsap.from(targets, {
      scrollTrigger: {
        trigger: triggerEl,
        start: cfg.start,
        once: cfg.once,
      },
      y: cfg.y,
      opacity: cfg.opacity,
      duration: cfg.duration,
      stagger: cfg.stagger,
      ease: cfg.ease,
      delay: cfg.delay || 0,
    });
  }

  /** Subtle ambient float loop — extremely slow, organic */
  function ambientFloat(target, yRange, duration, delay) {
    if (!hasGSAP || prefersReducedMotion) return;
    return gsap.to(target, {
      y: yRange,
      duration: duration,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: delay || 0,
    });
  }

  // -------------------------------------------------------------------------
  // 1. Ultra-Luxurious Smooth Scroll (Lenis + GSAP ScrollTrigger Integration)
  // -------------------------------------------------------------------------
  let lenis = null;

  function initSmoothScroll() {
    if (prefersReducedMotion || typeof Lenis === "undefined") return;

    lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.4,
    });

    window.lenisInstance = lenis;

    if (hasGSAP && hasScrollTrigger) {
      lenis.on("scroll", ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  initSmoothScroll();

  // Smooth Anchor Navigation & Back to Top
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (!targetId || targetId === "#") {
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(0, { duration: 1.2 });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return;
      }

      if (targetId === "#home") {
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(0, { duration: 1.2 });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return;
      }

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(targetEl, { offset: -30, duration: 1.2 });
        } else {
          targetEl.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });

  // -------------------------------------------------------------------------
  // 2. Section 1: Hero — Cinematic Product Reveal
  // -------------------------------------------------------------------------
  function initHeroAnimation() {
    if (!hasGSAP || prefersReducedMotion) return;

    const heroTl = gsap.timeline({
      defaults: { ease: "power3.out" },
      delay: 0.15,
    });

    // 1. Navigation bar descent
    heroTl.from(".navbar", {
      y: -28,
      opacity: 0,
      duration: 1.1,
      ease: "power2.out",
    });

    // 2. Eyebrow text reveal
    heroTl.from(
      ".hero-copy .eyebrow",
      {
        y: 18,
        opacity: 0,
        duration: 0.85,
      },
      "-=0.7",
    );

    // 3. Editorial line-by-line headline reveal
    const titleInners = document.querySelectorAll(".hero-title-inner");
    if (titleInners.length) {
      heroTl.from(
        titleInners,
        {
          y: "115%",
          opacity: 0,
          duration: 1.2,
          stagger: 0.14,
          ease: "power4.out",
        },
        "-=0.65",
      );
    } else {
      heroTl.from(".hero h1", { y: 25, opacity: 0, duration: 1.1 }, "-=0.65");
    }

    // 4. Description & social proof — gentle upward fade
    heroTl.from(
      ".hero-copy .description",
      {
        y: 22,
        opacity: 0,
        duration: 0.9,
      },
      "-=0.8",
    );

    heroTl.from(
      ".hero-copy .social-proof",
      {
        y: 20,
        opacity: 0,
        duration: 0.85,
      },
      "-=0.75",
    );

    // 5. Actions and Trust items — staggered entrance
    heroTl.from(
      ".hero-copy .actions > *",
      {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
      },
      "-=0.7",
    );

    heroTl.from(
      ".hero-copy .trust > span",
      {
        y: 16,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
      },
      "-=0.6",
    );

    // 6. Central product scene: Halo, orbits, water splash, and bottle
    heroTl.from(
      [".scene-halo", ".scene-orbit"],
      {
        scale: 0.82,
        opacity: 0,
        duration: 1.4,
        stagger: 0.09,
        ease: "power2.out",
      },
      "-=1.4",
    );

    heroTl.from(
      ".water-splash",
      {
        scale: 0.85,
        opacity: 0,
        duration: 1.3,
        ease: "power2.out",
      },
      "-=1.2",
    );

    // Serum bottle: opacity + scale reveal, then subtle float loop
    heroTl.from(
      ".serum-product",
      {
        y: 45,
        scale: 0.94,
        opacity: 0,
        duration: 1.3,
        ease: "power3.out",
      },
      "-=1.2",
    );

    // 7. Floating "Daily Radiance" badge — restrained entrance
    heroTl.from(
      ".floating-tag",
      {
        scale: 0,
        rotation: -30,
        opacity: 0,
        duration: 0.9,
        ease: "back.out(1.8)",
      },
      "-=0.85",
    );

    // 8. Petals and glass bubbles
    heroTl.from(
      [".product-scene .petal", ".product-scene .glass-bubble"],
      {
        scale: 0.35,
        opacity: 0,
        duration: 1.0,
        stagger: 0.07,
        ease: "power2.out",
      },
      "-=0.9",
    );

    // 9. Right lead card
    heroTl.from(
      ".guide-card",
      {
        y: 35,
        opacity: 0,
        duration: 1.1,
        ease: "power2.out",
      },
      "-=1.1",
    );
  }

  // -------------------------------------------------------------------------
  // 2b. Hero ambient floating loops — independent slow movement
  // -------------------------------------------------------------------------
  function initHeroAmbient() {
    if (!hasGSAP || prefersReducedMotion) return;

    // Glass orbs: very slow independent float
    const bubbles = document.querySelectorAll(".product-scene .glass-bubble");
    bubbles.forEach((bubble, i) => {
      gsap.to(bubble, {
        y: i % 2 === 0 ? -12 : 10,
        x: i % 2 === 0 ? 6 : -5,
        duration: 5 + i * 1.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: i * 0.4,
      });
    });

    // Hero flowers: slow sway
    const heroFlowers = document.querySelectorAll(".hero-flower");
    heroFlowers.forEach((flower, i) => {
      gsap.to(flower, {
        y: i === 0 ? -8 : 10,
        rotation: i === 0 ? "-=4" : "+=4",
        duration: 6 + i * 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: i * 0.6,
      });
    });

    // Scene caption subtle fade pulse
    const caption = document.querySelector(".scene-caption");
    if (caption) {
      gsap.to(caption, {
        opacity: 0.6,
        duration: 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }
  }

  // Hero Restrained 3D Interactive Tilt on Desktop
  function initHeroTilt() {
    if (prefersReducedMotion) return;
    const scene = document.querySelector(".product-scene");
    const visual = document.querySelector(".hero-visual");
    const splash = document.querySelector(".water-splash");
    if (!scene || !visual) return;

    const isDesktop = window.matchMedia(
      "(min-width: 1024px) and (pointer: fine)",
    ).matches;
    if (!isDesktop) return;

    let bounds = scene.getBoundingClientRect();
    window.addEventListener("resize", () => {
      bounds = scene.getBoundingClientRect();
    });

    scene.addEventListener("pointermove", (e) => {
      bounds = scene.getBoundingClientRect();
      const relX = (e.clientX - bounds.left) / bounds.width - 0.5;
      const relY = (e.clientY - bounds.top) / bounds.height - 0.5;

      if (hasGSAP) {
        gsap.to(visual, {
          rotationY: relX * 11,
          rotationX: -relY * 11,
          duration: 0.7,
          ease: "power2.out",
          overwrite: "auto",
        });

        if (splash) {
          gsap.to(splash, {
            xPercent: -50 + relX * -14,
            yPercent: -50 + relY * -14,
            duration: 0.9,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      }
    });

    scene.addEventListener("pointerleave", () => {
      if (hasGSAP) {
        gsap.to(visual, {
          rotationY: 0,
          rotationX: 0,
          duration: 1.2,
          ease: "power2.out",
        });

        if (splash) {
          gsap.to(splash, {
            xPercent: -50,
            yPercent: -50,
            duration: 1.2,
            ease: "power2.out",
          });
        }
      }
    });
  }

  // -------------------------------------------------------------------------
  // 3. Section 2: Everyday Difference — Botanical Atmosphere & SVG Drawing
  // -------------------------------------------------------------------------
  function initDifferenceSection() {
    if (!hasGSAP || !hasScrollTrigger || prefersReducedMotion) return;

    // Benefit strip & SVG Stroke Drawing
    const benefitItems = document.querySelectorAll(".gp-benefit-item");
    const paths = document.querySelectorAll(".gp-benefit-icon svg path");

    paths.forEach((path) => {
      const length = path.getTotalLength ? path.getTotalLength() : 100;
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
    });

    ScrollTrigger.create({
      trigger: ".gp-benefit-strip",
      start: "top 82%",
      once: true,
      onEnter: () => {
        gsap.from(benefitItems, {
          y: 26,
          opacity: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: "power2.out",
        });

        paths.forEach((path, i) => {
          gsap.to(path, {
            strokeDashoffset: 0,
            duration: 1.3,
            delay: i * 0.08,
            ease: "power2.out",
          });
        });
      },
    });

    // Main difference copy — staggered reveal
    gsap.from(".gp-difference-copy > *", {
      scrollTrigger: {
        trigger: ".gp-difference-copy",
        start: "top 80%",
        once: true,
      },
      y: 30,
      opacity: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: "power2.out",
    });

    // Benefit cards sequential reveal
    gsap.from(".gp-benefit-cards .gp-card", {
      scrollTrigger: {
        trigger: ".gp-benefit-cards",
        start: "top 78%",
        once: true,
      },
      y: 42,
      opacity: 0,
      duration: 0.95,
      stagger: 0.18,
      ease: "power2.out",
    });

    // Restrained parallax on botanical background elements
    const bgGlows = document.querySelectorAll(
      ".gp-bg-glow, .gp-botanical, .gp-light-orb",
    );
    if (bgGlows.length) {
      bgGlows.forEach((elem, idx) => {
        const depth = 20 + idx * 15;
        gsap.to(elem, {
          scrollTrigger: {
            trigger: ".gp-difference",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
          y: -depth,
          ease: "none",
        });
      });
    }

    // Floating petals in benefits section
    const benefitPetals = document.querySelectorAll(".gp-floating-petal");
    benefitPetals.forEach((petal, i) => {
      gsap.to(petal, {
        scrollTrigger: {
          trigger: ".gp-difference",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
        y: -(30 + i * 20),
        rotation: i % 2 === 0 ? 15 : -15,
        ease: "none",
      });
    });
  }

  // -------------------------------------------------------------------------
  // 4. Section 3: Ingredients — Elegant Formula Storytelling
  // -------------------------------------------------------------------------
  function initIngredientsSection() {
    if (!hasGSAP || !hasScrollTrigger || prefersReducedMotion) return;

    // Reveal the product visual from the LEFT
    gsap.from(".gp-formula-visual", {
      scrollTrigger: {
        trigger: ".gp-formula-inner",
        start: "top 75%",
        once: true,
      },
      x: -60,
      opacity: 0,
      duration: 1.2,
      ease: "power2.out",
    });

    // Reveal the content from the RIGHT
    gsap.from(".gp-formula-content", {
      scrollTrigger: {
        trigger: ".gp-formula-inner",
        start: "top 75%",
        once: true,
      },
      x: 60,
      opacity: 0,
      duration: 1.2,
      ease: "power2.out",
      delay: 0.15,
    });

    // Heading & intro stagger (within the content block)
    gsap.from(
      [".gp-formula-eyebrow", ".gp-formula-content > h2", ".gp-formula-intro"],
      {
        scrollTrigger: {
          trigger: ".gp-formula-content",
          start: "top 78%",
          once: true,
        },
        y: 28,
        opacity: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: "power2.out",
        delay: 0.3,
      },
    );

    // Ingredient rows — short stagger sequential reveal & line animations
    const ingredientContainer = document.querySelector(".gp-ingredients");
    const ingredientRows = document.querySelectorAll(".gp-ingredient");

    if (ingredientRows.length) {
      ScrollTrigger.create({
        trigger: ".gp-ingredients",
        start: "top 78%",
        once: true,
        onEnter: () => {
          if (ingredientContainer)
            ingredientContainer.classList.add("is-in-view");

          gsap.from(ingredientRows, {
            y: 28,
            opacity: 0,
            duration: 0.85,
            stagger: 0.16,
            ease: "power2.out",
            onComplete: () => {
              ingredientRows.forEach((row) => row.classList.add("is-in-view"));
            },
          });
        },
      });
    }

    // Restrained parallax on botanical background leaves and petals
    const formulaParallax = document.querySelectorAll(
      ".gp-formula-petal-a, .gp-formula-petal-b, .gp-formula-leaf",
    );
    if (formulaParallax.length) {
      formulaParallax.forEach((elem, idx) => {
        const depth = (idx + 1) * 35;
        gsap.to(elem, {
          scrollTrigger: {
            trigger: ".gp-formula",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.4,
          },
          y: -depth,
          ease: "none",
        });
      });
    }

    // Floating bubbles in formula section — ambient
    const formulaBubbles = document.querySelectorAll(".gp-formula-bubble");
    formulaBubbles.forEach((bubble, i) => {
      ambientFloat(bubble, i % 2 === 0 ? -10 : 8, 5 + i * 1.2, i * 0.5);
    });
  }

  // -------------------------------------------------------------------------
  // 5. Section 4: Daily Ritual — Three-Step Guided Experience
  // -------------------------------------------------------------------------
  function initRitualSection() {
    if (!hasGSAP || !hasScrollTrigger || prefersReducedMotion) return;

    const heading = document.querySelector(".gp-ritual-heading");
    const steps = document.querySelectorAll(".gp-ritual-step");
    const connectors = document.querySelectorAll(".gp-ritual-connector");

    // Heading reveal
    if (heading) {
      gsap.from(heading.children, {
        scrollTrigger: {
          trigger: heading,
          start: "top 85%",
          once: true,
        },
        y: 25,
        opacity: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: "power2.out",
      });
    }

    // Sequenced reveal of steps, connectors with progressive dot drawing
    const ritualStepsContainer = document.querySelector(".gp-ritual-steps");
    if (ritualStepsContainer && steps.length >= 3) {
      ScrollTrigger.create({
        trigger: ritualStepsContainer,
        start: "top 88%",
        once: true,
        onEnter: () => {
          const ritualTl = gsap.timeline({
            defaults: { ease: "power2.out" },
          });

          // Step 1: visual first, then label
          const step1Visual = steps[0].querySelector(".gp-ritual-visual");
          const step1Text = steps[0].querySelectorAll(
            ".gp-step-number, h3, p, .gp-step-caption",
          );

          if (step1Visual) {
            ritualTl.from(step1Visual, {
              y: 30,
              scale: 0.92,
              opacity: 0,
              duration: 0.75,
            });
          }
          if (step1Text.length) {
            ritualTl.from(
              step1Text,
              {
                y: 18,
                opacity: 0,
                duration: 0.6,
                stagger: 0.06,
              },
              "-=0.4",
            );
          }

          // Connector 1 — progressive dot drawing
          if (connectors[0]) {
            const dots1 = connectors[0].querySelectorAll("span");
            const star1 = connectors[0].querySelector("i");
            ritualTl.from(
              dots1,
              {
                scale: 0,
                opacity: 0,
                duration: 0.3,
                stagger: 0.06,
                ease: "back.out(2)",
              },
              "-=0.3",
            );
            if (star1) {
              ritualTl.from(
                star1,
                {
                  scale: 0,
                  rotation: -180,
                  opacity: 0,
                  duration: 0.4,
                  ease: "back.out(2)",
                },
                "-=0.15",
              );
            }
          }

          // Step 2: visual first, then label
          const step2Visual = steps[1].querySelector(".gp-ritual-visual");
          const step2Text = steps[1].querySelectorAll(
            ".gp-step-number, h3, p, .gp-step-caption",
          );

          if (step2Visual) {
            ritualTl.from(
              step2Visual,
              {
                y: 30,
                scale: 0.92,
                opacity: 0,
                duration: 0.75,
              },
              "-=0.3",
            );
          }
          if (step2Text.length) {
            ritualTl.from(
              step2Text,
              {
                y: 18,
                opacity: 0,
                duration: 0.6,
                stagger: 0.06,
              },
              "-=0.4",
            );
          }

          // Connector 2 — progressive dot drawing
          if (connectors[1]) {
            const dots2 = connectors[1].querySelectorAll("span");
            const star2 = connectors[1].querySelector("i");
            ritualTl.from(
              dots2,
              {
                scale: 0,
                opacity: 0,
                duration: 0.3,
                stagger: 0.06,
                ease: "back.out(2)",
              },
              "-=0.3",
            );
            if (star2) {
              ritualTl.from(
                star2,
                {
                  scale: 0,
                  rotation: -180,
                  opacity: 0,
                  duration: 0.4,
                  ease: "back.out(2)",
                },
                "-=0.15",
              );
            }
          }

          // Step 3: visual first, then label
          const step3Visual = steps[2].querySelector(".gp-ritual-visual");
          const step3Text = steps[2].querySelectorAll(
            ".gp-step-number, h3, p, .gp-step-caption",
          );

          if (step3Visual) {
            ritualTl.from(
              step3Visual,
              {
                y: 30,
                scale: 0.92,
                opacity: 0,
                duration: 0.75,
              },
              "-=0.3",
            );
          }
          if (step3Text.length) {
            ritualTl.from(
              step3Text,
              {
                y: 18,
                opacity: 0,
                duration: 0.6,
                stagger: 0.06,
              },
              "-=0.4",
            );
          }
        },
      });

      // Active step highlighting linked to viewport progress
      steps.forEach((step, idx) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top 60%",
          end: "bottom 40%",
          onToggle: (self) => {
            if (self.isActive) {
              steps.forEach((s) => s.classList.remove("is-active"));
              step.classList.add("is-active");
              if (connectors[idx]) connectors[idx].classList.add("is-active");
            }
          },
        });
      });
    }

    // Subtle floating movement on ritual visual assets
    const ritualSpheres = document.querySelectorAll(".gp-glass-sphere");
    ritualSpheres.forEach((sphere, i) => {
      ambientFloat(sphere, i % 2 === 0 ? -8 : 6, 5 + i, i * 0.8);
    });

    // Ritual background petals parallax
    const ritualBgFlowers = document.querySelectorAll(".gp-ritual-flower");
    ritualBgFlowers.forEach((flower, i) => {
      gsap.to(flower, {
        scrollTrigger: {
          trigger: ".gp-ritual",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.4,
        },
        y: -(25 + i * 20),
        ease: "none",
      });
    });

    // Ritual footer reveal
    const ritualFooter = document.querySelector(".gp-ritual-footer");
    if (ritualFooter) {
      revealUp(ritualFooter.children, ritualFooter, {
        y: 20,
        stagger: 0.08,
      });
    }
  }

  // -------------------------------------------------------------------------
  // 6. Section 5: Customer Reviews — Refined Social Proof
  // -------------------------------------------------------------------------
  function initReviewsSection() {
    if (!hasGSAP || !hasScrollTrigger || prefersReducedMotion) return;

    // Heading & overall rating — staggered entrance
    gsap.from([".gp-reviews-heading > *", ".gp-reviews-rating"], {
      scrollTrigger: {
        trigger: ".gp-reviews-heading",
        start: "top 80%",
        once: true,
      },
      y: 28,
      opacity: 0,
      duration: 0.85,
      stagger: 0.12,
      ease: "power2.out",
    });

    // Review cards stagger with gentle lift
    const reviewCards = document.querySelectorAll(".gp-review-card");
    if (reviewCards.length) {
      ScrollTrigger.create({
        trigger: ".gp-reviews-grid",
        start: "top 78%",
        once: true,
        onEnter: () => {
          gsap.from(reviewCards, {
            y: 42,
            opacity: 0,
            duration: 0.95,
            stagger: 0.16,
            ease: "power2.out",
          });

          // Star ratings reveal left-to-right wipe (once)
          gsap.fromTo(
            ".gp-review-stars",
            { clipPath: "inset(0 100% 0 0)" },
            {
              clipPath: "inset(0 0% 0 0)",
              duration: 0.85,
              stagger: 0.14,
              ease: "power2.out",
              delay: 0.35,
            },
          );
        },
      });
    }

    // Reviews footer
    const reviewsFooter = document.querySelector(".gp-reviews-footer");
    if (reviewsFooter) {
      revealUp(reviewsFooter.children, reviewsFooter, {
        y: 18,
        stagger: 0.1,
      });
    }
  }

  // -------------------------------------------------------------------------
  // 7. Section 6: Product Showcase CTA — Conversion & Interactive Parallax
  // -------------------------------------------------------------------------
  function initProductCTA() {
    if (!hasGSAP || !hasScrollTrigger || prefersReducedMotion) return;

    // Copy — deliberate sequenced entrance
    const ctaCopyChildren = document.querySelectorAll(".gp-cta-copy > *");
    if (ctaCopyChildren.length) {
      gsap.from(ctaCopyChildren, {
        scrollTrigger: {
          trigger: ".gp-cta-copy",
          start: "top 80%",
          once: true,
        },
        y: 30,
        opacity: 0,
        duration: 0.85,
        stagger: 0.1,
        ease: "power2.out",
      });
    }

    // Product bottle — subtle scale + opacity reveal
    gsap.from(
      [
        ".gp-cta-serum-wrap",
        ".gp-cta-halo",
        ".gp-cta-bubble",
        ".gp-clean-beauty",
      ],
      {
        scrollTrigger: {
          trigger: ".gp-cta-visual",
          start: "top 78%",
          once: true,
        },
        scale: 0.9,
        opacity: 0,
        duration: 1.05,
        stagger: 0.1,
        ease: "power2.out",
      },
    );

    // Scroll-linked parallax on bottle and decorative elements
    const ctaBottle = document.querySelector(".gp-cta-serum-wrap");
    if (ctaBottle) {
      gsap.to(ctaBottle, {
        scrollTrigger: {
          trigger: ".gp-product-cta",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
        y: -30,
        ease: "none",
      });
    }

    const ctaPetalsBg = document.querySelectorAll(".gp-cta-petal");
    ctaPetalsBg.forEach((petal, i) => {
      gsap.to(petal, {
        scrollTrigger: {
          trigger: ".gp-product-cta",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
        y: -(20 + i * 15),
        rotation: i % 2 === 0 ? 12 : -12,
        ease: "none",
      });
    });

    // Desktop pointer-based parallax (desktop fine pointer only)
    const ctaSection = document.querySelector(".gp-product-cta");
    const ctaSerumImg = document.querySelector(".gp-cta-serum");
    const ctaBubbles = document.querySelectorAll(".gp-cta-bubble");
    const ctaPetals = document.querySelectorAll(".gp-visual-petal");

    const isDesktop = window.matchMedia(
      "(min-width: 1024px) and (pointer: fine)",
    ).matches;
    if (ctaSection && isDesktop) {
      ctaSection.addEventListener("pointermove", (e) => {
        const rect = ctaSection.getBoundingClientRect();
        const xNorm = (e.clientX - rect.left) / rect.width - 0.5;
        const yNorm = (e.clientY - rect.top) / rect.height - 0.5;

        if (ctaSerumImg) {
          gsap.to(ctaSerumImg, {
            x: xNorm * 12,
            y: yNorm * 12,
            duration: 0.7,
            ease: "power2.out",
            overwrite: "auto",
          });
        }

        if (ctaBubbles.length) {
          ctaBubbles.forEach((bubble, i) => {
            const factor = (i + 1) * 8;
            gsap.to(bubble, {
              x: -xNorm * factor,
              y: -yNorm * factor,
              duration: 0.9,
              ease: "power2.out",
              overwrite: "auto",
            });
          });
        }

        if (ctaPetals.length) {
          ctaPetals.forEach((petal, i) => {
            const factor = (i + 1) * 10;
            gsap.to(petal, {
              x: xNorm * factor,
              y: yNorm * factor,
              duration: 0.8,
              ease: "power2.out",
              overwrite: "auto",
            });
          });
        }
      });

      ctaSection.addEventListener("pointerleave", () => {
        if (ctaSerumImg) {
          gsap.to(ctaSerumImg, {
            x: 0,
            y: 0,
            duration: 1.1,
            ease: "power2.out",
          });
        }
        ctaBubbles.forEach((b) => {
          gsap.to(b, {
            x: 0,
            y: 0,
            duration: 1.1,
            ease: "power2.out",
          });
        });
        ctaPetals.forEach((p) => {
          gsap.to(p, {
            x: 0,
            y: 0,
            duration: 1.1,
            ease: "power2.out",
          });
        });
      });
    }

    // CTA star decoration spin on scroll
    const ctaStar = document.querySelector(".gp-cta-star");
    if (ctaStar) {
      gsap.to(ctaStar, {
        scrollTrigger: {
          trigger: ".gp-product-cta",
          start: "top bottom",
          end: "bottom top",
          scrub: 2,
        },
        rotation: 180,
        ease: "none",
      });
    }
  }

  // -------------------------------------------------------------------------
  // 8. Section 7: FAQ Accordion & Footer — Scroll Reveals
  // -------------------------------------------------------------------------
  function initFAQ() {
    const faqItems = document.querySelectorAll(".gp-faq-item");

    // Smooth accordion logic (preserved from original)
    faqItems.forEach((item) => {
      const button = item.querySelector(".gp-faq-question");
      const answer = item.querySelector(".gp-faq-answer");
      const toggle = item.querySelector(".gp-faq-toggle");

      if (!button || !answer || !toggle) return;

      button.addEventListener("click", () => {
        const wasOpen = item.classList.contains("is-open");

        // Close all other items
        faqItems.forEach((other) => {
          if (other === item && !wasOpen) return;
          other.classList.remove("is-open");

          const otherBtn = other.querySelector(".gp-faq-question");
          const otherAns = other.querySelector(".gp-faq-answer");
          const otherTog = other.querySelector(".gp-faq-toggle");

          if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
          if (otherTog) otherTog.textContent = "+";

          if (otherAns) {
            window.setTimeout(() => {
              if (!other.classList.contains("is-open")) {
                otherAns.hidden = true;
              }
            }, 380);
          }
        });

        // Toggle selected
        if (!wasOpen) {
          answer.hidden = false;
          // Trigger reflow for smooth height transition
          void answer.offsetHeight;
          item.classList.add("is-open");
          button.setAttribute("aria-expanded", "true");
          toggle.textContent = "−";
        } else {
          item.classList.remove("is-open");
          button.setAttribute("aria-expanded", "false");
          toggle.textContent = "+";
          window.setTimeout(() => {
            if (!item.classList.contains("is-open")) {
              answer.hidden = true;
            }
          }, 380);
        }
      });
    });

    // ScrollTrigger reveals for FAQ section
    if (hasGSAP && hasScrollTrigger && !prefersReducedMotion) {
      // FAQ intro column reveal
      const faqIntro = document.querySelector(".gp-faq-intro");
      if (faqIntro) {
        gsap.from(faqIntro.children, {
          scrollTrigger: {
            trigger: faqIntro,
            start: "top 82%",
            once: true,
          },
          y: 28,
          opacity: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: "power2.out",
        });
      }

      // FAQ items — staggered reveal when they enter viewport
      if (faqItems.length) {
        gsap.from(faqItems, {
          scrollTrigger: {
            trigger: ".gp-faq-list",
            start: "top 82%",
            once: true,
          },
          y: 24,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
        });
      }

      // Footer subtle entrance
      gsap.from(".gp-footer-inner", {
        scrollTrigger: {
          trigger: ".gp-footer",
          start: "top 88%",
          once: true,
        },
        y: 28,
        opacity: 0,
        ease: "power2.out",
      });
    }
  }

  // -------------------------------------------------------------------------
  // 9. Add to Bag Cart State & Visual Feedback
  // -------------------------------------------------------------------------
  function initCart() {
    const addToBagButton = document.getElementById("gpAddToBag");
    const cartBadges = document.querySelectorAll("[data-cart-count]");

    function syncCartBadge() {
      let count = 0;
      try {
        const cart = JSON.parse(localStorage.getItem("glowpure-cart") || "[]");
        count = Array.isArray(cart)
          ? cart.reduce((total, item) => total + (item.quantity || 1), 0)
          : 0;
      } catch {
        count = 0;
      }

      cartBadges.forEach((badge) => {
        if (count > 0) {
          badge.textContent = count;
          badge.hidden = false;
        } else {
          badge.hidden = true;
        }
      });
    }

    syncCartBadge();

    if (addToBagButton) {
      addToBagButton.addEventListener("click", () => {
        const product = {
          id: "glowpure-radiance-serum",
          name: "GlowPure Radiance Serum",
          price: 4900,
          quantity: 1,
        };

        let cart = [];
        try {
          cart = JSON.parse(localStorage.getItem("glowpure-cart") || "[]");
          if (!Array.isArray(cart)) cart = [];
        } catch {
          cart = [];
        }

        const existingProduct = cart.find((item) => item.id === product.id);
        if (existingProduct) {
          existingProduct.quantity += 1;
        } else {
          cart.push(product);
        }

        localStorage.setItem("glowpure-cart", JSON.stringify(cart));
        syncCartBadge();

        // Button micro-bounce & label change
        const labelSpan = addToBagButton.querySelector("span");
        if (labelSpan) labelSpan.textContent = "Added to Bag";

        if (hasGSAP && !prefersReducedMotion) {
          gsap.fromTo(
            addToBagButton,
            { scale: 0.95 },
            { scale: 1, duration: 0.45, ease: "back.out(2.5)" },
          );

          cartBadges.forEach((badge) => {
            if (!badge.hidden) {
              gsap.fromTo(
                badge,
                { scale: 1.6 },
                { scale: 1, duration: 0.5, ease: "back.out(2.5)" },
              );
            }
          });
        }

        window.setTimeout(() => {
          if (labelSpan) labelSpan.textContent = "Add to bag";
        }, 1800);
      });
    }
  }

  // -------------------------------------------------------------------------
  // 9.5 Mobile Responsive Navbar
  // -------------------------------------------------------------------------
  function initMobileNavbar() {
    const toggle = document.getElementById("menu-toggle");
    const drawerClose = document.getElementById("drawer-close");
    const navMenu = document.getElementById("primary-navigation");
    const backdrop = document.getElementById("nav-backdrop");
    if (!toggle || !navMenu) return;

    function openNav() {
      document.body.classList.add("nav-open");
      toggle.classList.add("is-active");
      toggle.setAttribute("aria-expanded", "true");
    }

    function closeNav() {
      document.body.classList.remove("nav-open");
      toggle.classList.remove("is-active");
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", () => {
      const isOpen = document.body.classList.contains("nav-open");
      if (isOpen) {
        closeNav();
      } else {
        openNav();
      }
    });

    if (drawerClose) {
      drawerClose.addEventListener("click", closeNav);
    }

    if (backdrop) {
      backdrop.addEventListener("click", closeNav);
    }

    // Close when any link inside nav is clicked
    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        closeNav();
      });
    });

    // Close on Escape key
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && document.body.classList.contains("nav-open")) {
        closeNav();
        toggle.focus();
      }
    });

    // Ensure drawer starts in closed state
    closeNav();

    // Close drawer if user resizes to desktop width
    window.addEventListener("resize", () => {
      if (
        window.innerWidth > 960 &&
        document.body.classList.contains("nav-open")
      ) {
        closeNav();
      }
    });

    // Active link scrollspy
    const sections = [
      { id: "home", el: document.getElementById("home") },
      { id: "benefits", el: document.getElementById("benefits") },
      { id: "ingredients", el: document.getElementById("ingredients") },
      { id: "reviews", el: document.getElementById("reviews") },
      { id: "faq", el: document.getElementById("faq") },
    ];

    function updateActiveLink() {
      const scrollPos = window.scrollY + 140;
      let currentId = "home";

      for (let i = sections.length - 1; i >= 0; i--) {
        const s = sections[i];
        if (s.el && s.el.offsetTop <= scrollPos) {
          currentId = s.id;
          break;
        }
      }

      document
        .querySelectorAll(".navbar .nav-link, .navbar nav a")
        .forEach((a) => {
          const href = a.getAttribute("href");
          if (href === `#${currentId}`) {
            a.classList.add("active");
          } else {
            a.classList.remove("active");
          }
        });
    }

    window.addEventListener("scroll", updateActiveLink, { passive: true });
    updateActiveLink();
  }

  // -------------------------------------------------------------------------
  // 10. Initialization
  // -------------------------------------------------------------------------
  function init() {
    initMobileNavbar();
    initHeroAnimation();
    initHeroAmbient();
    initHeroTilt();
    initDifferenceSection();
    initIngredientsSection();
    initRitualSection();
    initReviewsSection();
    initProductCTA();
    initFAQ();
    initCart();

    // Ensure triggers recalculate accurate offsets after heavy images load
    window.addEventListener("load", () => {
      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh();
      }
    });

    document.querySelectorAll("img").forEach((img) => {
      if (!img.complete) {
        img.addEventListener(
          "load",
          () => {
            if (typeof ScrollTrigger !== "undefined") {
              ScrollTrigger.refresh();
            }
          },
          { once: true },
        );
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

// -------------------------------------------------------------------------
// 11. Lead Form Tracking
// -------------------------------------------------------------------------

window.dataLayer = window.dataLayer || [];

/**
 * Intercepts lead form submission and pushes structured tracking event to window.dataLayer
 * @param {HTMLFormElement} formElement - Form element to attach interception to
 * @param {string} customFormId - Custom form identifier for tracking (default: 'hero_lead_form')
 */
function initLeadFormTracking(formElement, customFormId = "hero_lead_form") {
  if (!formElement) return;

  formElement.addEventListener("submit", function (event) {
    event.preventDefault();

    // Validate form inputs
    if (
      typeof formElement.reportValidity === "function" &&
      !formElement.reportValidity()
    ) {
      return;
    }

    // Capture form values
    const nameInput = formElement.querySelector('[name="name"], #name');
    const emailInput = formElement.querySelector('[name="email"], #email');

    const messageElement = formElement.querySelector('[name="focus"], #focus');

    const capturedName = nameInput ? nameInput.value.trim() : "";
    const capturedEmail = emailInput ? emailInput.value.trim() : "";

    // Build the structured event payload
    const eventPayload = {
      event: "lead_form_submitted",
      form_id: customFormId,
      user_data: {
        name: capturedName,
        email: capturedEmail,
      },
      timestamp: new Date()
        .toLocaleString("sv-SE", {
          timeZone: "Asia/Colombo",
        })
        .replace(" ", "T"),
    };

    // Push to dataLayer
    window.dataLayer.push(eventPayload);

    // Log the complete event object to the console
    console.log("[DataLayer] Event pushed:", eventPayload);

    // Display success message
    const message = document.getElementById("form-message");
    if (message) {
      message.textContent =
        "Thanks! Your glow guide is on its way to your inbox.";
      message.style.color = "#5a7a58";

      // Clear the form fields after successful submission
      if (nameInput) nameInput.value = "";
      if (emailInput) emailInput.value = "";
      if (messageElement) messageElement.value = "";
    }
  });
}

// Initialize tracking on the hero lead form
const leadForm = document.getElementById("glow-form");
initLeadFormTracking(leadForm, "hero_lead_form");
