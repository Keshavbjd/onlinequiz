document.addEventListener("DOMContentLoaded", () => {
  // Mobile sidebar toggle
  const sidebarToggle = document.querySelector(".sidebar-toggle")
  const sidebar = document.querySelector(".sidebar")

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("open")
    })
  }

  // Close sidebar when clicking outside on mobile
  document.addEventListener("click", (e) => {
    if (window.innerWidth <= 1024) {
      if (!sidebar.contains(e.target) && !sidebarToggle?.contains(e.target)) {
        sidebar.classList.remove("open")
      }
    }
  })

  // Add loading states to action cards
  const actionCards = document.querySelectorAll(".action-card")
  actionCards.forEach((card) => {
    card.addEventListener("click", function (e) {
      // Add loading state
      this.style.opacity = "0.7"
      this.style.pointerEvents = "none"

      // Remove loading state after navigation
      setTimeout(() => {
        this.style.opacity = "1"
        this.style.pointerEvents = "auto"
      }, 1000)
    })
  })

  // Animate stat numbers on page load
  const statNumbers = document.querySelectorAll(".stat-info h3")
  statNumbers.forEach((stat) => {
    const finalValue = Number.parseInt(stat.textContent.replace(/[^\d]/g, ""))
    if (!isNaN(finalValue)) {
      animateCounter(stat, finalValue)
    }
  })

  function animateCounter(element, target) {
    let current = 0
    const increment = target / 50
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        current = target
        clearInterval(timer)
      }

      // Preserve any non-numeric characters
      const originalText = element.textContent
      const nonNumeric = originalText.replace(/[\d,]/g, "")
      element.textContent = Math.floor(current).toLocaleString() + nonNumeric
    }, 30)
  }

  // Add ripple effect to buttons
  const buttons = document.querySelectorAll(".action-card, .nav-link")
  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const ripple = document.createElement("span")
      const rect = this.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      ripple.style.width = ripple.style.height = size + "px"
      ripple.style.left = x + "px"
      ripple.style.top = y + "px"
      ripple.classList.add("ripple")

      this.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, 600)
    })
  })
})

// Add CSS for ripple effect
const rippleStyles = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(59, 130, 246, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .action-card, .nav-link {
        position: relative;
        overflow: hidden;
    }
`

const styleSheet = document.createElement("style")
styleSheet.textContent = rippleStyles
document.head.appendChild(styleSheet)
