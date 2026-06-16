import { motion } from "motion/react";
import { ArrowRight, Cloud, Shield, Lock, Network, Server, Database, Zap, Globe, Cpu, HardDrive, Flame, ShieldAlert, LayoutDashboard, UserPlus, GitBranch, ShieldCheck, Activity, Boxes, Container, Workflow } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

interface IconPhysics {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
}

export function Hero() {
  const primaryText = "Mu is a Product Designer with 6+ years of B2B experience";
  const bulletPoints = [
    "Skilled in SaaS & data visualization",
    "Solve complex problems in highly specialized domains",
    "Design intuitive & seamless user experience"
  ];
  
  const [displayedSecondary, setDisplayedSecondary] = useState("");
  const [currentBulletIndex, setCurrentBulletIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [hoveredIcon, setHoveredIcon] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const navBarRef = useRef<HTMLElement | null>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const physicsDataRef = useRef<IconPhysics[]>([]);
  const hoveredIconRef = useRef<number | null>(null);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rotationRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Floating icon configurations with more spread out positions
  const floatingIcons = [
    { Icon: Cloud, color: "from-blue-400 to-cyan-400", startX: 5, startY: 10 },
    { Icon: Shield, color: "from-green-400 to-emerald-400", startX: 92, startY: 15 },
    { Icon: Lock, color: "from-purple-400 to-pink-400", startX: 6, startY: 88 },
    { Icon: Network, color: "from-orange-400 to-red-400", startX: 75, startY: 8 },
    { Icon: Server, color: "from-indigo-400 to-blue-400", startX: 90, startY: 85 },
    { Icon: Database, color: "from-teal-400 to-cyan-400", startX: 3, startY: 45 },
    { Icon: Zap, color: "from-yellow-400 to-orange-400", startX: 95, startY: 60 },
    { Icon: Globe, color: "from-blue-400 to-indigo-400", startX: 12, startY: 60 },
    { Icon: Cpu, color: "from-pink-400 to-purple-400", startX: 70, startY: 75 },
    { Icon: HardDrive, color: "from-cyan-400 to-blue-400", startX: 18, startY: 30 },
    { Icon: Flame, color: "from-red-400 to-orange-400", startX: 65, startY: 22 },
    { Icon: ShieldAlert, color: "from-red-400 to-orange-400", startX: 25, startY: 65 },
    { Icon: LayoutDashboard, color: "from-gray-400 to-blue-400", startX: 35, startY: 52 },
    { Icon: UserPlus, color: "from-green-400 to-emerald-400", startX: 62, startY: 52 },
    { Icon: GitBranch, color: "from-purple-400 to-pink-400", startX: 58, startY: 70 },
    { Icon: ShieldCheck, color: "from-green-400 to-emerald-400", startX: 40, startY: 45 },
    { Icon: Activity, color: "from-blue-400 to-indigo-400", startX: 50, startY: 38 },
    { Icon: Boxes, color: "from-gray-400 to-blue-400", startX: 55, startY: 92 },
    { Icon: Container, color: "from-purple-400 to-pink-400", startX: 85, startY: 78 },
    { Icon: Workflow, color: "from-gray-400 to-blue-400", startX: 8, startY: 38 },
  ];

  const ICON_RADIUS = 28; // Radius of each icon in pixels (includes padding)
  const DAMPING = 0.998; // Smooth damping for realistic physics
  const RESTITUTION = 0.7; // Smoother bounciness coefficient for fluid motion
  const MIN_VELOCITY = 0.2; // Minimum velocity to keep icons moving (reduced for slower movement)
  const MAX_VELOCITY = 1.0; // Maximum velocity to prevent icons from moving too fast (reduced for slower movement)
  const SMOOTH_FACTOR = 0.15; // Smoothing factor for interpolation
  const REPULSION_FORCE = 0.05; // Gentle repulsion to keep icons spread out

  useEffect(() => {
    const currentBullet = bulletPoints[currentBulletIndex];
    let charIndex = 0;
    let typingTimeout: NodeJS.Timeout;

    if (isTyping) {
      // Typing animation
      const typeNextChar = () => {
        if (charIndex < currentBullet.length) {
          setDisplayedSecondary(currentBullet.slice(0, charIndex + 1));
          charIndex++;
          typingTimeout = setTimeout(typeNextChar, 50);
        } else {
          // Finished typing, wait then start deleting
          typingTimeout = setTimeout(() => {
            setIsTyping(false);
          }, 2000);
        }
      };
      typeNextChar();
    } else {
      // Deleting animation
      const deleteNextChar = () => {
        if (charIndex < currentBullet.length) {
          setDisplayedSecondary(currentBullet.slice(0, currentBullet.length - charIndex - 1));
          charIndex++;
          typingTimeout = setTimeout(deleteNextChar, 30);
        } else {
          // Finished deleting, move to next bullet
          setIsTyping(true);
          setCurrentBulletIndex((prev) => (prev + 1) % bulletPoints.length);
        }
      };
      deleteNextChar();
    }

    return () => clearTimeout(typingTimeout);
  }, [currentBulletIndex, isTyping]);

  // Initialize physics
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Get navigation bar reference
    navBarRef.current = document.querySelector('nav');

    // Use requestAnimationFrame to ensure layout is complete
    const initFrame = requestAnimationFrame(() => {
      // Use clientWidth/clientHeight instead of getBoundingClientRect for stable dimensions
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      // Ensure we have valid dimensions
      if (containerWidth === 0 || containerHeight === 0) {
        console.warn('Container has no dimensions yet');
        return;
      }

      // Get navigation bar height to calculate top boundary (calculate once)
      let navBarHeight = 0;
      if (navBarRef.current) {
        const navRect = navBarRef.current.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        navBarHeight = navRect.bottom - containerRect.top;
      }

      // Get hero content bounds (exclusion zone) - calculate once relative to container
      let heroContentBounds = null;
      if (heroContentRef.current) {
        const heroRect = heroContentRef.current.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        heroContentBounds = {
          left: heroRect.left - containerRect.left,
          right: heroRect.right - containerRect.left,
          top: heroRect.top - containerRect.top,
          bottom: heroRect.bottom - containerRect.top,
        };
      }

      // Get scroll indicator bounds (exclusion zone) - calculate once relative to container
      let scrollIndicatorBounds = null;
      if (scrollIndicatorRef.current) {
        const scrollRect = scrollIndicatorRef.current.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        scrollIndicatorBounds = {
          left: scrollRect.left - containerRect.left,
          right: scrollRect.right - containerRect.left,
          top: scrollRect.top - containerRect.top,
          bottom: scrollRect.bottom - containerRect.top,
        };
      }

      // Initialize physics for each icon with random starting positions from outside the borders
      const initialPhysics = floatingIcons.map((_, index) => {
        // Divide the screen into zones to ensure even distribution
        const totalIcons = floatingIcons.length;
        const cols = 5;
        const rows = Math.ceil(totalIcons / cols);
        
        const col = index % cols;
        const row = Math.floor(index / cols);
        
        // Calculate base position in grid
        const cellWidth = containerWidth / cols;
        const cellHeight = (containerHeight - Math.max(navBarHeight, 0)) / rows;
        
        // Add randomness within each cell
        const baseX = col * cellWidth + cellWidth / 2;
        const baseY = Math.max(navBarHeight, 0) + row * cellHeight + cellHeight / 2;
        
        // Add random offset within the cell (±40% of cell size)
        const offsetX = (Math.random() - 0.5) * cellWidth * 0.8;
        const offsetY = (Math.random() - 0.5) * cellHeight * 0.8;
        
        let x = baseX + offsetX;
        let y = baseY + offsetY;
        
        // Ensure icons stay within bounds
        x = Math.max(ICON_RADIUS + 10, Math.min(containerWidth - ICON_RADIUS - 10, x));
        y = Math.max(Math.max(navBarHeight, 0) + ICON_RADIUS + 10, Math.min(containerHeight - ICON_RADIUS - 10, y));
        
        // Random velocity in any direction (reduced speed for slower movement)
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 0.4 + 0.3; // Reduced from 1.0 + 0.8 to 0.4 + 0.3
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        
        return {
          x,
          y,
          vx,
          vy,
          rotation: Math.random() * 360,
        };
      });

      physicsDataRef.current = initialPhysics;

      // Position icons immediately via DOM refs
      initialPhysics.forEach((pos, i) => {
        const el = iconRefs.current[i];
        const rotEl = rotationRefs.current[i];
        if (el) {
          el.style.left = `${pos.x}px`;
          el.style.top = `${pos.y}px`;
          el.style.visibility = 'visible';
        }
        if (rotEl) {
          rotEl.style.transform = `rotate(${pos.rotation}deg)`;
        }
      });

      let lastTime = performance.now();
      let frameCount = 0;

      const animate = (currentTime: number) => {
        const deltaTime = Math.min((currentTime - lastTime) / 16.67, 2); // Cap delta to prevent large jumps
        lastTime = currentTime;
        frameCount++;

        const container = containerRef.current;
        if (!container) return;

        // Use clientWidth/Height for stable dimensions independent of scroll
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        const newPhysics = physicsDataRef.current.map((icon, index) => {
          const isHovered = hoveredIconRef.current === index;
          
          if (isHovered) {
            // Paused when hovered
            return icon;
          }

          let { x, y, vx, vy, rotation } = icon;

          // Update position based on velocity
          x += vx * deltaTime;
          y += vy * deltaTime;

          // Apply damping
          vx *= DAMPING;
          vy *= DAMPING;

          // Update rotation
          rotation += 1 * deltaTime;

          // Apply gentle repulsion force from nearby icons to keep them spread out
          for (let j = 0; j < physicsDataRef.current.length; j++) {
            if (j === index) continue; // Skip self
            
            const otherIcon = physicsDataRef.current[j];
            const dx = x - otherIcon.x;
            const dy = y - otherIcon.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Apply repulsion if icons are too close (within 150px)
            const repulsionDistance = 150;
            if (distance < repulsionDistance && distance > 0) {
              const repulsionStrength = REPULSION_FORCE * (1 - distance / repulsionDistance);
              vx += (dx / distance) * repulsionStrength;
              vy += (dy / distance) * repulsionStrength;
            }
          }

          // Check collision with hero content (exclusion zone)
          if (heroContentBounds) {
            const padding = ICON_RADIUS + 80; // Padding around hero content
            
            const boundaryLeft = heroContentBounds.left - padding;
            const boundaryRight = heroContentBounds.right + padding;
            const boundaryTop = heroContentBounds.top - padding;
            const boundaryBottom = heroContentBounds.bottom + padding;
            
            // Check if icon is overlapping with the exclusion zone
            const isInZoneX = x > boundaryLeft && x < boundaryRight;
            const isInZoneY = y > boundaryTop && y < boundaryBottom;
            
            if (isInZoneX && isInZoneY) {
              // Icon is in exclusion zone - find the closest boundary and bounce
              const distToLeft = Math.abs(x - boundaryLeft);
              const distToRight = Math.abs(x - boundaryRight);
              const distToTop = Math.abs(y - boundaryTop);
              const distToBottom = Math.abs(y - boundaryBottom);
              
              const minDist = Math.min(distToLeft, distToRight, distToTop, distToBottom);
              
              // Bounce off the closest boundary
              if (minDist === distToLeft) {
                x = boundaryLeft;
                vx = -Math.abs(vx) * RESTITUTION; // Bounce left
              } else if (minDist === distToRight) {
                x = boundaryRight;
                vx = Math.abs(vx) * RESTITUTION; // Bounce right
              } else if (minDist === distToTop) {
                y = boundaryTop;
                vy = -Math.abs(vy) * RESTITUTION; // Bounce up
              } else if (minDist === distToBottom) {
                y = boundaryBottom;
                vy = Math.abs(vy) * RESTITUTION; // Bounce down
              }
            }
          }

          // Check collision with scroll indicator (exclusion zone)
          if (scrollIndicatorBounds) {
            const padding = ICON_RADIUS + 40;
            
            const boundaryLeft = scrollIndicatorBounds.left - padding;
            const boundaryRight = scrollIndicatorBounds.right + padding;
            const boundaryTop = scrollIndicatorBounds.top - padding;
            const boundaryBottom = scrollIndicatorBounds.bottom + padding;
            
            // Check if icon is overlapping with the exclusion zone
            const isInZoneX = x > boundaryLeft && x < boundaryRight;
            const isInZoneY = y > boundaryTop && y < boundaryBottom;
            
            if (isInZoneX && isInZoneY) {
              // Icon is in exclusion zone - find the closest boundary and bounce
              const distToLeft = Math.abs(x - boundaryLeft);
              const distToRight = Math.abs(x - boundaryRight);
              const distToTop = Math.abs(y - boundaryTop);
              const distToBottom = Math.abs(y - boundaryBottom);
              
              const minDist = Math.min(distToLeft, distToRight, distToTop, distToBottom);
              
              // Bounce off the closest boundary
              if (minDist === distToLeft) {
                x = boundaryLeft;
                vx = -Math.abs(vx) * RESTITUTION; // Bounce left
              } else if (minDist === distToRight) {
                x = boundaryRight;
                vx = Math.abs(vx) * RESTITUTION; // Bounce right
              } else if (minDist === distToTop) {
                y = boundaryTop;
                vy = -Math.abs(vy) * RESTITUTION; // Bounce up
              } else if (minDist === distToBottom) {
                y = boundaryBottom;
                vy = Math.abs(vy) * RESTITUTION; // Bounce down
              }
            }
          }

          // Check collision with borders
          if (x - ICON_RADIUS < 0) {
            x = ICON_RADIUS;
            vx = Math.abs(vx) * RESTITUTION;
          } else if (x + ICON_RADIUS > containerWidth) {
            x = containerWidth - ICON_RADIUS;
            vx = -Math.abs(vx) * RESTITUTION;
          }

          if (y - ICON_RADIUS < Math.max(navBarHeight, 0)) {
            y = Math.max(navBarHeight, 0) + ICON_RADIUS;
            vy = Math.abs(vy) * RESTITUTION;
          } else if (y + ICON_RADIUS > containerHeight) {
            y = containerHeight - ICON_RADIUS;
            vy = -Math.abs(vy) * RESTITUTION;
          }

          // Detect and fix "stuck" icons (near border with very low velocity)
          const borderProximity = 5; // Pixels from border
          const stuckVelocityThreshold = 0.2; // Very low velocity threshold
          
          const nearLeftBorder = x - ICON_RADIUS < borderProximity;
          const nearRightBorder = containerWidth - (x + ICON_RADIUS) < borderProximity;
          const nearTopBorder = y - ICON_RADIUS - Math.max(navBarHeight, 0) < borderProximity;
          const nearBottomBorder = containerHeight - (y + ICON_RADIUS) < borderProximity;
          
          const isNearBorder = nearLeftBorder || nearRightBorder || nearTopBorder || nearBottomBorder;
          const hasLowVelocity = Math.abs(vx) < stuckVelocityThreshold && Math.abs(vy) < stuckVelocityThreshold;
          
          if (isNearBorder && hasLowVelocity) {
            // Icon is stuck! Give it a gentle push away from the border
            if (nearLeftBorder) {
              vx = 0.8;
            } else if (nearRightBorder) {
              vx = -0.8;
            }
            
            if (nearTopBorder) {
              vy = 0.8;
            } else if (nearBottomBorder) {
              vy = -0.8;
            }
          }

          // Ensure icons have a minimum velocity to keep moving
          if (Math.abs(vx) < MIN_VELOCITY) {
            vx = (Math.random() - 0.5) * 1.5;
          }
          if (Math.abs(vy) < MIN_VELOCITY) {
            vy = (Math.random() - 0.5) * 1.5;
          }

          // Cap velocity to prevent icons from moving too fast
          if (Math.abs(vx) > MAX_VELOCITY) {
            vx = Math.sign(vx) * MAX_VELOCITY;
          }
          if (Math.abs(vy) > MAX_VELOCITY) {
            vy = Math.sign(vy) * MAX_VELOCITY;
          }

          // Final boundary enforcement - ensure icons NEVER go outside the frame
          x = Math.max(ICON_RADIUS, Math.min(containerWidth - ICON_RADIUS, x));
          y = Math.max(Math.max(navBarHeight, 0) + ICON_RADIUS, Math.min(containerHeight - ICON_RADIUS, y));

          return { x, y, vx, vy, rotation };
        });

        // Check for collisions between icons
        for (let i = 0; i < newPhysics.length; i++) {
          if (hoveredIconRef.current === i) continue; // Skip if hovered
          
          for (let j = i + 1; j < newPhysics.length; j++) {
            if (hoveredIconRef.current === j) continue; // Skip if hovered
          
            const icon1 = newPhysics[i];
            const icon2 = newPhysics[j];

            const dx = icon2.x - icon1.x;
            const dy = icon2.y - icon1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Check if collision occurred
            if (distance < ICON_RADIUS * 2 && distance > 0) {
              // Collision detected! Calculate elastic collision response
              const angle = Math.atan2(dy, dx);
              const sin = Math.sin(angle);
              const cos = Math.cos(angle);

              // Rotate velocities to collision normal
              const vx1 = icon1.vx * cos + icon1.vy * sin;
              const vy1 = icon1.vy * cos - icon1.vx * sin;
              const vx2 = icon2.vx * cos + icon2.vy * sin;
              const vy2 = icon2.vy * cos - icon2.vx * sin;

              // Swap velocities along collision normal (elastic collision with equal masses)
              const vx1Final = vx2;
              const vx2Final = vx1;

              // Rotate back to original coordinate system
              icon1.vx = vx1Final * cos - vy1 * sin;
              icon1.vy = vy1 * cos + vx1Final * sin;
              icon2.vx = vx2Final * cos - vy2 * sin;
              icon2.vy = vy2 * cos + vx2Final * sin;

              // Apply restitution (bounciness)
              icon1.vx *= RESTITUTION;
              icon1.vy *= RESTITUTION;
              icon2.vx *= RESTITUTION;
              icon2.vy *= RESTITUTION;

              // Separate icons to prevent overlap
              const overlap = ICON_RADIUS * 2 - distance;
              const separationX = (overlap / 2 + 0.5) * cos;
              const separationY = (overlap / 2 + 0.5) * sin;

              icon1.x -= separationX;
              icon1.y -= separationY;
              icon2.x += separationX;
              icon2.y += separationY;
            }
          }
        }

        physicsDataRef.current = newPhysics;

        // Update DOM directly — no React re-render needed
        newPhysics.forEach((pos, i) => {
          const el = iconRefs.current[i];
          const rotEl = rotationRefs.current[i];
          if (el) {
            el.style.left = `${pos.x}px`;
            el.style.top = `${pos.y}px`;
          }
          if (rotEl) {
            rotEl.style.transform = `rotate(${pos.rotation}deg)`;
          }
        });

        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animationFrameRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    });

    return () => {
      cancelAnimationFrame(initFrame);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []); // Empty dependency array - only initialize once

  return (
    <section
      id="home"
      ref={containerRef}
      className="h-screen flex flex-col items-center justify-center relative overflow-hidden pt-20 pb-16"
    >
      {/* Floating icons with physics - 20 animated icons */}
      {floatingIcons.map((iconConfig, index) => {
        const isHovered = hoveredIcon === index;

        return (
          <motion.div
            key={index}
            ref={(el) => { iconRefs.current[index] = el; }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.6, scale: 1 }}
            transition={{
              opacity: { duration: 1, delay: index * 0.1 },
              scale: { duration: 1, delay: index * 0.1 },
            }}
            className="absolute pointer-events-auto z-0 -translate-x-1/2 -translate-y-1/2"
            style={{
              visibility: 'hidden',
              willChange: 'left, top',
            }}
            onMouseEnter={() => {
              setHoveredIcon(index);
              hoveredIconRef.current = index;
            }}
            onMouseLeave={() => {
              setHoveredIcon(null);
              hoveredIconRef.current = null;
            }}
          >
            <div ref={(el) => { rotationRefs.current[index] = el; }}>
              <div className={`bg-gradient-to-br ${iconConfig.color} rounded-full p-2 sm:p-2.5 shadow-lg backdrop-blur-sm transition-all duration-300 ${isHovered ? 'scale-110 shadow-2xl' : ''}`}>
                <iconConfig.Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
              </div>
            </div>
          </motion.div>
        );
      })}

      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Glass card container */}
          <motion.div
            ref={heroContentRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-50"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-6 sm:mb-8 relative z-50 flex justify-center items-center h-[60px] sm:h-[72px] md:h-[90px] px-4"
              style={{
                filter: "drop-shadow(0 0 20px rgba(99, 102, 241, 0.3)) drop-shadow(0 1px 3px rgba(0, 0, 0, 0.15))",
                WebkitTextStroke: "0.3px rgba(99, 102, 241, 0.2)",
                overflow: "visible",
                lineHeight: "1.5",
              }}
            >
              <motion.span
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%"],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="bg-gradient-to-r from-pink-500 via-purple-500 via-indigo-500 via-blue-500 via-cyan-500 to-pink-500 dark:from-pink-300 dark:via-purple-300 dark:via-indigo-300 dark:via-blue-300 dark:via-cyan-300 dark:to-pink-300 bg-clip-text text-transparent text-center"
                style={{
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  whiteSpace: "nowrap",
                }}
              >
                {primaryText}
              </motion.span>
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-sm sm:text-base md:text-lg mb-8 sm:mb-10 md:mb-12 relative z-50 text-center h-[32px] sm:h-[40px] md:h-[48px] flex items-center justify-center px-4"
            >
              <span
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-300 dark:via-purple-300 dark:to-pink-300 bg-clip-text text-transparent"
                style={{
                  filter: "drop-shadow(0 0 15px rgba(147, 51, 234, 0.25)) drop-shadow(0 1px 3px rgba(0, 0, 0, 0.12))",
                  WebkitTextStroke: "0.3px rgba(147, 51, 234, 0.2)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: "500",
                }}
              >
                {displayedSecondary}
              </span>
              {isTyping && displayedSecondary.length < bulletPoints[currentBulletIndex].length && (
                <span 
                  className="animate-pulse ml-2 text-indigo-600 dark:text-indigo-300"
                  style={{
                    fontSize: '1.2em',
                    fontWeight: '700',
                  }}
                >
                  |
                </span>
              )}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/about">
                <Button
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] hover:from-[#0d2543] hover:to-[#153d63] dark:from-[#6DB2FF] dark:to-[#5a9ae6] dark:hover:from-[#5a9ae6] dark:hover:to-[#4882cc] text-white dark:text-gray-900 shadow-lg cursor-pointer"
                >
                  More About Me <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        ref={scrollIndicatorRef}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 cursor-pointer"
          onClick={() => {
            const projectsSection = document.getElementById('projects');
            if (projectsSection) {
              projectsSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          <span className="text-sm text-gray-600 dark:text-gray-300">Scroll for more</span>
          <div className="w-6 h-10 rounded-full border-2 border-gray-400 dark:border-gray-500 flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full bg-gradient-to-b from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}