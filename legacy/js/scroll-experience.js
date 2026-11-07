export function initializeScrollExperience() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (!reducedMotion.matches) entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1 },
    );
    document
      .querySelectorAll(".reveal")
      .forEach((element) => observer.observe(element));
  }
  const portrait = document.querySelector(".portrait-frame img");
  const hero = document.querySelector(".hero-composition");
  if (!hero || !portrait) return;
  let frame = 0;
  hero.addEventListener("pointermove", (event) => {
    if (
      reducedMotion.matches ||
      event.pointerType !== "mouse" ||
      window.innerWidth < 761
    )
      return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const rect = hero.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 6;
      portrait.style.transform = `scale(1.04) translate(${x}px, ${y}px)`;
    });
  });
  const reset = () => {
    cancelAnimationFrame(frame);
    portrait.style.transform = "";
  };
  hero.addEventListener("pointerleave", reset);
  reducedMotion.addEventListener("change", reset);
  window.addEventListener("pagehide", reset, { once: true });
}
