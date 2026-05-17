document.querySelectorAll('video').forEach(video => {
  video.addEventListener('play', () => {
    document.querySelectorAll('video').forEach(other => {
      if (other !== video) other.pause();
    });
  });
});

document.querySelectorAll('video[data-src]').forEach(video => {
  new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        video.src = video.dataset.src;
        obs.disconnect();
      }
    });
  }).observe(video);
});
      function closeMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
}

document.getElementById('burgerBtn').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.toggle('open');
});

// Ferme le menu si on clique en dehors
document.addEventListener('click', (e) => {
  const menu = document.getElementById('mobileMenu');
  const btn = document.getElementById('burgerBtn');
  if (!menu.contains(e.target) && e.target !== btn) {
    menu.classList.remove('open');
  }
});

      // STARFIELD
      (function () {
        const c = document.getElementById("starCanvas");
        const ctx = c.getContext("2d");
        let stars = [];
        function resize() {
          c.width = window.innerWidth;
          c.height = window.innerHeight;
        }
        function init() {
          stars = [];
          for (let i = 0; i < 180; i++)
            stars.push({
              x: Math.random() * c.width,
              y: Math.random() * c.height,
              r: 0.3 + Math.random() * 0.8,
              a: 0.2 + Math.random() * 0.7,
              p: Math.random() * Math.PI * 2,
              ps: 0.003 + Math.random() * 0.007,
            });
        }
        function draw() {
          ctx.clearRect(0, 0, c.width, c.height);
          stars.forEach((s) => {
            s.p += s.ps;
            const a = s.a * (0.5 + 0.5 * Math.sin(s.p));
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(203,213,225,${a})`;
            ctx.fill();
          });
          requestAnimationFrame(draw);
        }
        resize();
        init();
        draw();
        window.addEventListener("resize", () => {
          resize();
          init();
        });
      })();

      // BLACK HOLE
      (function () {
        const canvas = document.getElementById("heroCanvas");
        const zone = document.getElementById("heroZone");
        const ctx = canvas.getContext("2d");
        let W,
          H,
          mouse = { x: 0, y: 0 },
          particles = [],
          lines = [],
          bh = [];
        let startTime = Date.now();

        function resize() {
          const dpr = window.devicePixelRatio || 1;
          const w = window.innerWidth,
            h = window.innerHeight;
          canvas.width = w * dpr;
          canvas.height = h * dpr;
          ctx.scale(dpr, dpr);
          W = w;
          H = h;
          bh = [
            { x: W * 0.28, y: H * 0.5 },
            { x: W * 0.72, y: H * 0.5 },
          ];
          init();
        }

        function spawnP() {
          return {
            x: Math.random() * W,
            y: Math.random() * H,
            vx: (Math.random() - 0.5) * 1.8,
            vy: (Math.random() - 0.5) * 1.8,
            size: 6 + Math.random() * 9,
            depth: 3,
          };
        }
        function init() {
          particles = [];
          for (let i = 0; i < 22; i++) particles.push(spawnP());
          lines = [];
          for (let i = 0; i < 14; i++) {
            lines.push({
              bi: i % 2,
              angle: Math.random() * Math.PI * 2,
              speed: (Math.random() - 0.5) * 0.045,
            });
          }
        }

        function fractal(x, y, r, d) {
          if (d <= 0 || r < 2.2) return;
          for (let b of bh) {
            const dist = Math.hypot(b.x - x, b.y - y);
            if (dist < r + 38) return;
          }
          const isDark =
            document.documentElement.getAttribute("data-theme") !== "light";
          ctx.save();
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.strokeStyle = isDark
            ? "rgba(139,92,246,0.45)"
            : "rgba(10,10,26,0.25)";
          ctx.lineWidth = 0.75;
          ctx.stroke();
          ctx.restore();
          const sr = r * 0.48;
          for (let i = 0; i < 6; i++) {
            const a = (i * Math.PI) / 3;
            fractal(
              x + Math.cos(a) * r * 1.15,
              y + Math.sin(a) * r * 1.15,
              sr,
              d - 1,
            );
          }
        }

        function electric(x1, y1, x2, y2) {
          const isDark =
            document.documentElement.getAttribute("data-theme") !== "light";
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          for (let i = 1; i <= 11; i++) {
            const t = i / 11,
              now = Date.now() * 0.013;
            ctx.lineTo(
              x1 + (x2 - x1) * t + Math.sin(now + i * 1.4) * 6,
              y1 + (y2 - y1) * t + Math.cos(now + i * 2.1) * 6,
            );
          }
          ctx.strokeStyle = isDark
            ? "rgba(140,160,255,0.38)"
            : "rgba(10,10,26,0.2)";
          ctx.lineWidth = 1.35;
          ctx.stroke();
        }

        function draw() {
          ctx.clearRect(0, 0, W, H);

          const t = (Date.now() - startTime) / 1000;
          let alpha = 1;

          if (t > 6) {
            let progress = Math.min(1, (t - 6) / 2);
            alpha = 1 - Math.pow(progress, 2);
          }
          const isDark =
            document.documentElement.getAttribute("data-theme") !== "light";
          const vg = ctx.createRadialGradient(
            W / 2,
            H / 2,
            H * 0.08,
            W / 2,
            H / 2,
            H * 0.9,
          );
          if (isDark) {
            vg.addColorStop(0, "rgba(5,5,26,0)");
            vg.addColorStop(1, "rgba(5,5,26,0.72)");
          } else {
            vg.addColorStop(0, "rgba(250,250,250,0)");
            vg.addColorStop(1, "rgba(250,250,250,0)");
          }
          ctx.fillStyle = vg;
          ctx.fillRect(0, 0, W, H);

        particles = particles.filter((p) => {
        bh.forEach((b) => {
          const dx = b.x - p.x,
            dy = b.y - p.y,
            d = Math.hypot(dx, dy) + 12;
        const pull = alpha > 0.3 ? 38 : 38 + (1 - alpha) * 300;
        p.vx += (dx / (d * d)) * pull;
        p.vy += (dy / (d * d)) * pull;
        });
        
        const dm = Math.hypot(mouse.x - p.x, mouse.y - p.y);
        if (dm < 140 && dm > 5) {
          const f = ((140 - dm) / 140) * 9;
          p.vx -= ((mouse.x - p.x) / dm) * f;
          p.vy -= ((mouse.y - p.y) / dm) * f;
        }
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.x += p.vx;
        p.y += p.vy;
        if (bh.some(b => Math.hypot(b.x - p.x, b.y - p.y) < 26)) return false;
        if (p.x < 0 || p.x > W || p.y < 0 || p.y > H) {
          if (alpha > 0.3) { Object.assign(p, spawnP()); return true; }
          return false;
        }
        fractal(p.x, p.y, p.size, p.depth);
        return true;
        });
        if (alpha <= 0) particles = [];
          if (alpha > 0) {
            ctx.save();
            ctx.globalAlpha = alpha;

            lines.forEach((l) => {
              l.angle += l.speed * alpha;
              const b = bh[l.bi];

              electric(
                b.x,
                b.y,
                b.x + Math.cos(l.angle) * 68,
                b.y + Math.sin(l.angle) * 68,
              );
            });

            ctx.restore();
          }

          if (alpha > 0) {
            bh.forEach((b) => {
              ctx.save();
              ctx.globalAlpha = alpha;

              // Dans le bloc bh.forEach, remplace les fillStyle :
              const isDarkBh =
                document.documentElement.getAttribute("data-theme") !== "light";

              const glow = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, 78);
              glow.addColorStop(
                0,
                isDarkBh ? "rgba(139,92,246,0.28)" : "rgba(10,10,26,0.12)",
              );
              glow.addColorStop(1, "rgba(0,0,0,0)");
              ctx.fillStyle = glow;
              ctx.beginPath();
              ctx.arc(b.x, b.y, 78, 0, Math.PI * 2);
              ctx.fill();

              ctx.beginPath();
              ctx.arc(b.x, b.y, 26, 0, Math.PI * 2);
              ctx.fillStyle = isDarkBh ? "#05051a" : "#fafafa";
              ctx.fill();

              ctx.strokeStyle = isDarkBh
                ? "rgba(139,92,246,0.75)"
                : "rgba(10,10,26,0.6)";
              ctx.lineWidth = 2.5;
              ctx.stroke();

              ctx.restore();
            });
          }

          requestAnimationFrame(draw);
        }

        resize();
        draw();
        window.addEventListener("resize", resize);
        zone.addEventListener("mousemove", (e) => {
          mouse.x = e.clientX;
          mouse.y = e.clientY;
        });
        zone.addEventListener(
          "touchmove",
          (e) => {
            if (e.touches.length > 0) {
              mouse.x = e.touches[0].clientX;
              mouse.y = e.touches[0].clientY;
            }
          },
          { passive: false },
        );
      })();

      /* LANG */
      (function () {
        const html = document.documentElement;
        function syncLang(l) {
          ["langToggle", "mLang"].forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.textContent = l === "fr" ? "EN" : "FR";
          });
        }
        html.setAttribute(
          "data-theme",
          localStorage.getItem("theme") || "dark",
        );
        const sl = localStorage.getItem("lang") || "fr";
        html.setAttribute("data-lang", sl);
        html.lang = sl;
        syncLang(sl);

        ["themeToggle", "mTheme"].forEach((id) => {
          const el = document.getElementById(id);
          if (el)
            el.addEventListener("click", () => {
              const n =
                html.getAttribute("data-theme") === "dark" ? "light" : "dark";
              html.setAttribute("data-theme", n);
              localStorage.setItem("theme", n);
            });
        });
        ["langToggle", "mLang"].forEach((id) => {
          const el = document.getElementById(id);
          if (el)
            el.addEventListener("click", () => {
              const n = html.getAttribute("data-lang") === "fr" ? "en" : "fr";
              html.setAttribute("data-lang", n);
              html.lang = n;
              localStorage.setItem("lang", n);
              syncLang(n);
            });
        });

        const secs = document.querySelectorAll("section[id]");
        const links = document.querySelectorAll("#sidenav .nav-links a");
        new IntersectionObserver(
          (es) => {
            es.forEach((e) => {
              if (e.isIntersecting)
                links.forEach((a) =>
                  a.classList.toggle(
                    "active",
                    a.getAttribute("href") === "#" + e.target.id,
                  ),
                );
            });
          },
          { rootMargin: "-30% 0px -60% 0px" },
        ).observe &&
          secs.forEach((s) =>
            new IntersectionObserver(
              (es) => {
                es.forEach((e) => {
                  if (e.isIntersecting)
                    links.forEach((a) =>
                      a.classList.toggle(
                        "active",
                        a.getAttribute("href") === "#" + e.target.id,
                      ),
                    );
                });
              },
              { rootMargin: "-30% 0px -60% 0px" },
            ).observe(s),
          );

        new IntersectionObserver(
          (es) => {
            es.forEach((e) => {
              if (e.isIntersecting) e.target.classList.add("in");
            });
          },
          { threshold: 0.08 },
        ).observe &&
          document.querySelectorAll(".reveal").forEach((el) =>
            new IntersectionObserver(
              (es) => {
                es.forEach((e) => {
                  if (e.isIntersecting) e.target.classList.add("in");
                });
              },
              { threshold: 0.08 },
            ).observe(el),
          );
      })();


      (function () {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const container = entry.target;
                container.classList.add("in");

                const children = container.querySelectorAll(".reveal-child");
                children.forEach((child, index) => {
                  setTimeout(
                    () => {
                      child.classList.add("in");
                    },
                    60 + index * 90,
                  ); 
                });
              }
            });
          },
          {
            threshold: 0.12,
            rootMargin: "-60px 0px -100px 0px",
          },
        );

        // Observer toutes les sections
        document.querySelectorAll("section .inner").forEach((inner) => {
          observer.observe(inner);
        });
      })();
