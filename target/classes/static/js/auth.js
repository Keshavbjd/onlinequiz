document.addEventListener("DOMContentLoaded", () => {
  // Password toggle functionality
  const passwordToggles = document.querySelectorAll(".password-toggle")
  passwordToggles.forEach((toggle) => {
    toggle.addEventListener("click", function () {
      const input = this.parentElement.querySelector("input")
      const icon = this.querySelector("i")

      if (input.type === "password") {
        input.type = "text"
        icon.classList.remove("fa-eye")
        icon.classList.add("fa-eye-slash")
      } else {
        input.type = "password"
        icon.classList.remove("fa-eye-slash")
        icon.classList.add("fa-eye")
      }
    })
  })

  // Form validation
  const authForm = document.querySelector(".auth-form")
  if (authForm) {
    authForm.addEventListener("submit", function (e) {
      e.preventDefault()

      const email = document.getElementById("email")
      const password = document.getElementById("password")
      let isValid = true

      // Reset previous errors
      document.querySelectorAll(".input-group input").forEach((input) => {
        input.classList.remove("error")
      })

      // Email validation
      if (!email.value.trim()) {
        email.classList.add("error")
        isValid = false
      } else if (!isValidEmail(email.value)) {
        email.classList.add("error")
        showError("Please enter a valid email address")
        isValid = false
      }

      // Password validation
      if (!password.value.trim()) {
        password.classList.add("error")
        isValid = false
      } else if (password.value.length < 6) {
        password.classList.add("error")
        showError("Password must be at least 6 characters long")
        isValid = false
      }

      if (isValid) {
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]')
        const hideLoading = showLoading(submitBtn)

        // Simulate API call
        setTimeout(() => {
          hideLoading()
          // In a real application, you would submit the form here
          showSuccess("Login successful! Redirecting...")
          setTimeout(() => {
            window.location.href = "/dashboard"
          }, 1500)
        }, 2000)
      }
    })
  }

  // Input focus effects
  document.querySelectorAll(".input-group input").forEach((input) => {
    input.addEventListener("focus", function () {
      this.parentElement.classList.add("focused")
    })

    input.addEventListener("blur", function () {
      this.parentElement.classList.remove("focused")
    })
  })
})

// Helper functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function showError(message) {
  showNotification(message, "error")
}

function showSuccess(message) {
  showNotification(message, "success")
}

function showNotification(message, type) {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification")
  existingNotifications.forEach((notification) => notification.remove())

  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}"></i>
            <span>${message}</span>
        </div>
    `

  // Add notification styles
  const notificationStyles = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
        }
        .notification-success {
            background: #28a745;
        }
        .notification-error {
            background: #dc3545;
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `

  // Add styles if not already added
  if (!document.querySelector("#notification-styles")) {
    const styleSheet = document.createElement("style")
    styleSheet.id = "notification-styles"
    styleSheet.textContent = notificationStyles
    document.head.appendChild(styleSheet)
  }

  document.body.appendChild(notification)

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove()
    }
  }, 5000)
}

function showLoading(button) {
  const originalHTML = button.innerHTML
  button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...'
  button.disabled = true

  return function hideLoading() {
    button.innerHTML = originalHTML
    button.disabled = false
  }
}
