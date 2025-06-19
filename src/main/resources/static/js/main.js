// Mobile Navigation Toggle
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger")
  const navMenu = document.querySelector(".nav-menu")
  const navbar = document.querySelector(".navbar")

  // Toggle mobile menu
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active")
    navMenu.classList.toggle("active")
  })

  // Close mobile menu when clicking on a link
  document.querySelectorAll(".nav-link").forEach((n) =>
    n.addEventListener("click", () => {
      hamburger.classList.remove("active")
      navMenu.classList.remove("active")
    }),
  )

  // Navbar scroll effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }
  })

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Sample Quiz Start Button
  const quizStartBtn = document.querySelector(".quiz-start-btn")
  if (quizStartBtn) {
    quizStartBtn.addEventListener("click", () => {
      // Show sample quiz modal or redirect
      showSampleQuiz()
    })
  }

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observe elements for animation
  document.querySelectorAll(".feature-card, .review-card, .quiz-card").forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(el)
  })

  // Counter animation for stats
  function animateCounters() {
    const counters = document.querySelectorAll(".stat-number")
    counters.forEach((counter) => {
      const target = Number.parseInt(counter.textContent.replace(/[^\d]/g, ""))
      const increment = target / 100
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          current = target
          clearInterval(timer)
        }

        if (counter.textContent.includes("K")) {
          counter.textContent = Math.floor(current / 1000) + "K+"
        } else if (counter.textContent.includes("%")) {
          counter.textContent = Math.floor(current) + "%"
        } else {
          counter.textContent = Math.floor(current) + "+"
        }
      }, 20)
    })
  }

  // Trigger counter animation when hero section is visible
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(animateCounters, 1000)
        heroObserver.unobserve(entry.target)
      }
    })
  })

  const heroSection = document.querySelector(".hero")
  if (heroSection) {
    heroObserver.observe(heroSection)
  }
})

// Sample Quiz Modal/Functionality
function showSampleQuiz() {
  // Create modal overlay
  const modal = document.createElement("div")
  modal.className = "quiz-modal"
  modal.innerHTML = `
        <div class="quiz-modal-content">
            <div class="quiz-modal-header">
                <h3>Sample Quiz - General Knowledge</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="quiz-modal-body">
                <div class="quiz-question">
                    <h4>Question 1 of 3</h4>
                    <p>What is the capital of France?</p>
                    <div class="quiz-options">
                        <label><input type="radio" name="q1" value="a"> London</label>
                        <label><input type="radio" name="q1" value="b"> Berlin</label>
                        <label><input type="radio" name="q1" value="c"> Paris</label>
                        <label><input type="radio" name="q1" value="d"> Madrid</label>
                    </div>
                </div>
                <div class="quiz-actions">
                    <button class="btn btn-primary" onclick="nextQuestion()">Next Question</button>
                </div>
            </div>
        </div>
    `

  // Add modal styles
  const modalStyles = `
        .quiz-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }
        .quiz-modal-content {
            background: white;
            border-radius: 20px;
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        }
        .quiz-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            border-bottom: 1px solid #eee;
            padding-bottom: 1rem;
        }
        .close-modal {
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            color: #666;
        }
        .quiz-question h4 {
            color: #3E8EDE;
            margin-bottom: 1rem;
        }
        .quiz-question p {
            font-size: 1.1rem;
            margin-bottom: 1.5rem;
            color: #333;
        }
        .quiz-options {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-bottom: 2rem;
        }
        .quiz-options label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 1rem;
            border: 2px solid #eee;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .quiz-options label:hover {
            border-color: #3E8EDE;
            background: #f8f9fa;
        }
        .quiz-options input[type="radio"] {
            margin: 0;
        }
    `

  // Add styles to head
  const styleSheet = document.createElement("style")
  styleSheet.textContent = modalStyles
  document.head.appendChild(styleSheet)

  document.body.appendChild(modal)

  // Close modal functionality
  modal.querySelector(".close-modal").addEventListener("click", () => {
    document.body.removeChild(modal)
    document.head.removeChild(styleSheet)
  })

  // Close modal when clicking outside
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal)
      document.head.removeChild(styleSheet)
    }
  })
}

// Quiz navigation (placeholder)
function nextQuestion() {
  alert("This is a demo. In the full version, you would proceed to the next question!")
}

// Form validation helper
function validateForm(form) {
  const inputs = form.querySelectorAll("input[required]")
  let isValid = true

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      isValid = false
      input.classList.add("error")
    } else {
      input.classList.remove("error")
    }
  })

  return isValid
}

// Loading state helper
function showLoading(button) {
  const originalText = button.textContent
  button.textContent = "Loading..."
  button.disabled = true

  return function hideLoading() {
    button.textContent = originalText
    button.disabled = false
  }
}
