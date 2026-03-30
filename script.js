gsap.registerPlugin(ScrollTrigger);
const marquee = document.querySelectorAll(".marquee div");

const scroll = new LocomotiveScroll({
  el: document.querySelector("[data-scroll-container]"),
  smooth: true,
});

// Connect Locomotive Scroll with GSAP ScrollTrigger
scroll.on("scroll", ScrollTrigger.update);

// ScrollTrigger.scrollerProxy("[data-scroll-container]", {
//   scrollTop(value) {
//     return arguments.length
//       ? scroll.scrollTo(value, 0, 0)
//       : scroll.scroll.instance.scroll.y;
//   },
//   getBoundingClientRect() {
//     return {
//       top: 0,
//       left: 0,
//       width: window.innerWidth,
//       height: window.innerHeight,
//     };
//   },
//   pinType: document.querySelector("[data-scroll-container]").style.transform
//     ? "transform"
//     : "fixed",
// });

// ScrollTrigger.addEventListener("refresh", () => scroll.update());
// ScrollTrigger.refresh();

marquee.forEach((el) => {
  for (let i = 0; i < 25; i++) {
    el.innerHTML += `<img src="./icon.png" alt="">`;
  }
});

// gsap.set(".category .type",{opacity:0,x:20})
const rTol = [".category .type", ".date", ".Allcast p"];
const bTou = [".Allcast .icon", ".heading"];

rTol.forEach((el) => {
  gsap.set(el, { opacity: 0, x: 20 });

  gsap.to(el, {
    x: -20,
    opacity: 1,
    duration: 1,
  });
});

bTou.forEach((el) => {
  gsap.set(el, { opacity: 0, y: 20 });

  gsap.to(el, {
    y: -20,
    opacity: 1,
    duration: 1,
  });
});
// gsap.set("nav",{y:-20,opacity:0})
gsap.from("nav", {
  y: -80,
  duration: 1,
  opacity: 0,
});
gsap.from(".deadpool", {
  y: 50,
  duration: 0.5,
  opacity: 0,
});
gsap.to(".category .type", {
  x: -20,
  opacity: 1,
  duration: 1,
});
const tl = gsap.timeline();
tl.from(marquee, {
  x: -500,
  duration: 5,
  ease: "linear",
  repeat: -1,
});
const img = document.querySelector(".deadpool");

// scrollTrigger
gsap.to(img, {
  opacity: 0,
  y: 100,
  scrollTrigger: {
    trigger: ".marquee", // The element that initiates the scroll action
    start: " top ", // When the top of the trigger hits the center of the viewport
    scrub: 1, // Smoothly link the animation progress to the scroll position (1 means 1 second delay)
    // markers: true, // IMPORTANT: Shows visual markers for debugging (start, end, etc.)
    toggleActions: "play none none reverse", // Defines what happens on scroll: onEnter, onLeave, onEnterBack, onLeaveBack
  },
});

const arrowConfig = [
  { id: "#left", fromX: -200 },
  { id: "#right", fromX: 200 },
];

arrowConfig.forEach(({ id, fromX }) => {
  gsap.set(id, { opacity: 0, x: fromX });

  gsap.to(id, {
    x: 0,
    opacity: 1,
    duration: 1.5,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".line",       
      scroller: "[data-scroll-container]",  // ✅ tell ScrollTrigger about Locomotive
      start: "top 70%",
      end: "top 40%",
      scrub: 1,
    },
  });
});

const oval = document.querySelectorAll(".c");
oval.forEach((el)=>{
  gsap.set(el,{
    opacity:1,
    y:0
  })
  gsap.from(el,{
    y:100,
    opacity:0,
    duration:1,
    scrub:true,
    yoyo:1,
    scrollTrigger:{
      trigger:".first",
      start:"top 10%",
      end:"bottom 50%",
    }
  })
})


