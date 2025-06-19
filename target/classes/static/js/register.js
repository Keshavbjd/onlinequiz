document.addEventListener("DOMContentLoaded", () => {
  const passwordInput = document.getElementById("password")
  const confirmPasswordInput = document.getElementById("confirmPassword")
  const strengthBar = document.querySelector(".strength-fill")
  const strengthText = document.querySelector(".strength-text")

  // Password strength checker
  passwordInput.addEventListener("input", function () {
    const password = this.value
    const strength = calculatePasswordStrength(password)
    updatePasswordStrength(strength)
  })

  // Confirm password validation
  confirmPasswordInput.addEventListener("input", () => {
    validatePasswordMatch()
  })

  passwordInput.addEventListener("input", () => {
    if (confirmPasswordInput.value) {
      validatePasswordMatch()
    }
  })

  function calculatePasswordStrength(password) {
    let score = 0

    if (password.length >= 8) score += 25
    if (password.match(/[a-z]/)) score += 25
    if (password.match(/[A-Z]/)) score += 25
    if (password.match(/[0-9]/)) score += 25
    if (password.match(/[^a-zA-Z0-9]/)) score += 25

    return Math.min(score, 100)
  }

  function updatePasswordStrength(strength) {
    strengthBar.style.width = strength + "%"

    if (strength < 25) {
      strengthBar.style.background = "#dc3545"
      strengthText.textContent = "Weak"
      strengthText.style.color = "#dc3545"
    } else if (strength < 50) {
      strengthBar.style.background = "#ffc107"
      strengthText.textContent = "Fair"
      strengthText.style.color = "#ffc107"
    } else if (strength < 75) {
      strengthBar.style.background = "#17a2b8"
      strengthText.textContent = "Good"
      strengthText.style.color = "#17a2b8"
    } else {
      strengthBar.style.background = "#28a745"
      strengthText.textContent = "Strong"
      strengthText.style.color = "#28a745"
    }
  }

  function validatePasswordMatch() {
    const password = passwordInput.value
    const confirmPassword = confirmPasswordInput.value

    if (confirmPassword && password !== confirmPassword) {
      confirmPasswordInput.classList.add("error")
      return false
    } else {
      confirmPasswordInput.classList.remove("error")
      return true
    }
  }

  // Enhanced form validation for registration
  const registerForm = document.querySelector(".auth-form")
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault()

      let isValid = true
      const formData = new FormData(this)

      // Reset errors
      document.querySelectorAll(".input-group input").forEach((input) => {
        input.classList.remove("error")
      })

      // Validate all fields
      const firstName = document.getElementById("firstName")
      const lastName = document.getElementById("lastName")
      const email = document.getElementById("email")
      const password = document.getElementById("password")
      const confirmPassword = document.getElementById("confirmPassword")
      const termsCheckbox = document.querySelector('input[name="terms"]')

      function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return re.test(email)
      }

      function showError(message) {
        alert(message)
      }

      function showSuccess(message) {
        alert(message)
      }

      function showLoading(button) {
        button.disabled = true
        button.textContent = "Loading..."
        return () => {
          button.disabled = false
          button.textContent = "Register"
        }
      }

      if (!firstName.value.trim()) {
        firstName.classList.add("error")
        isValid = false
      }

      if (!lastName.value.trim()) {
        lastName.classList.add("error")
        isValid = false
      }

      if (!email.value.trim() || !isValidEmail(email.value)) {
        email.classList.add("error")
        isValid = false
      }

      if (calculatePasswordStrength(password.value) < 50) {
        password.classList.add("error")
        showError("Password is too weak. Please choose a stronger password.")
        isValid = false
      }

      if (!validatePasswordMatch()) {
        isValid = false
        showError("Passwords do not match.")
      }

      if (!termsCheckbox.checked) {
        showError("Please accept the Terms of Service and Privacy Policy.")
        isValid = false
      }

      if (isValid) {
        const submitBtn = this.querySelector('button[type="submit"]')
        const hideLoading = showLoading(submitBtn)

        // Simulate registration API call
        setTimeout(() => {
          hideLoading()
          showSuccess("Account created successfully! Please check your email to verify your account.")
          setTimeout(() => {
            window.location.href = "/login"
          }, 2000)
        }, 2500)
      }
    })
  }
})
