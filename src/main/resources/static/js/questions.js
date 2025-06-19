let questionCount = 1

function addQuestion() {
  questionCount++
  const container = document.getElementById("questions-container")

  const questionCard = document.createElement("div")
  questionCard.className = "question-card"
  questionCard.setAttribute("data-question-id", questionCount)

  questionCard.innerHTML = `
        <div class="question-header">
            <h3>Question ${questionCount}</h3>
            <button type="button" class="remove-question" onclick="removeQuestion(${questionCount})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        
        <div class="question-form">
            <div class="form-group">
                <label>Question Text</label>
                <textarea placeholder="Enter your question here..." rows="3" required></textarea>
            </div>
            
            <div class="options-grid">
                <div class="form-group">
                    <label>Option A</label>
                    <input type="text" placeholder="Option A" required>
                </div>
                <div class="form-group">
                    <label>Option B</label>
                    <input type="text" placeholder="Option B" required>
                </div>
                <div class="form-group">
                    <label>Option C</label>
                    <input type="text" placeholder="Option C" required>
                </div>
                <div class="form-group">
                    <label>Option D</label>
                    <input type="text" placeholder="Option D" required>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Correct Answer</label>
                    <select required>
                        <option value="">Select correct answer</option>
                        <option value="A">Option A</option>
                        <option value="B">Option B</option>
                        <option value="C">Option C</option>
                        <option value="D">Option D</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Category</label>
                    <select required>
                        <option value="">Select category</option>
                        <option value="General Knowledge">General Knowledge</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Science">Science</option>
                        <option value="History">History</option>
                        <option value="Geography">Geography</option>
                        <option value="Literature">Literature</option>
                        <option value="Technology">Technology</option>
                        <option value="Sports">Sports</option>
                        <option value="Arts">Arts</option>
                        <option value="Current Affairs">Current Affairs</option>
                    </select>
                </div>
            </div>
        </div>
    `

  container.appendChild(questionCard)
  updateQuestionCount()

  // Show remove buttons if more than 1 question
  updateRemoveButtons()

  // Scroll to new question
  questionCard.scrollIntoView({ behavior: "smooth", block: "center" })
}

function removeQuestion(questionId) {
  const questionCard = document.querySelector(`[data-question-id="${questionId}"]`)
  if (questionCard) {
    questionCard.remove()
    updateQuestionCount()
    updateRemoveButtons()
    renumberQuestions()
  }
}

function updateQuestionCount() {
  const count = document.querySelectorAll(".question-card").length
  document.getElementById("question-count").textContent = count
}

function updateRemoveButtons() {
  const questions = document.querySelectorAll(".question-card")
  const removeButtons = document.querySelectorAll(".remove-question")

  removeButtons.forEach((button) => {
    button.style.display = questions.length > 1 ? "block" : "none"
  })
}

function renumberQuestions() {
  const questions = document.querySelectorAll(".question-card")
  questions.forEach((question, index) => {
    const header = question.querySelector(".question-header h3")
    header.textContent = `Question ${index + 1}`
    question.setAttribute("data-question-id", index + 1)
  })
}

function submitAllQuestions() {
  const quizId = document.getElementById("quiz-select").value
  if (!quizId) {
    showMessage("Please select a quiz first!", "error")
    return
  }

  const questions = []
  const questionCards = document.querySelectorAll(".question-card")

  let isValid = true

  questionCards.forEach((card, index) => {
    const questionText = card.querySelector("textarea").value.trim()
    const optionA = card.querySelectorAll("input")[0].value.trim()
    const optionB = card.querySelectorAll("input")[1].value.trim()
    const optionC = card.querySelectorAll("input")[2].value.trim()
    const optionD = card.querySelectorAll("input")[3].value.trim()
    const correctAnswer = card.querySelectorAll("select")[0].value
    const category = card.querySelectorAll("select")[1].value

    if (!questionText || !optionA || !optionB || !optionC || !optionD || !correctAnswer || !category) {
      showMessage(`Please fill in all fields for Question ${index + 1}`, "error")
      isValid = false
      return
    }

    questions.push({
      question: questionText,
      optionA: optionA,
      optionB: optionB,
      optionC: optionC,
      optionD: optionD,
      correctAnswer: correctAnswer,
      category: category,
    })
  })

  if (!isValid) return

  // Show loading state
  const submitBtn = document.querySelector(".btn-primary")
  const originalText = submitBtn.innerHTML
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...'
  submitBtn.disabled = true

  // Submit to backend
  fetch("/admin/api/questions/bulk", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      quizId: quizId,
      questions: questions,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message) {
        showMessage(`Successfully added ${questions.length} questions!`, "success")
        // Reset form
        setTimeout(() => {
          location.reload()
        }, 2000)
      } else {
        showMessage("Error adding questions. Please try again.", "error")
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      showMessage("Error adding questions. Please try again.", "error")
    })
    .finally(() => {
      submitBtn.innerHTML = originalText
      submitBtn.disabled = false
    })
}

function showMessage(text, type) {
  // Remove existing messages
  const existingMessages = document.querySelectorAll(".message")
  existingMessages.forEach((msg) => msg.remove())

  const message = document.createElement("div")
  message.className = `message ${type}`
  message.innerHTML = `
        <i class="fas ${type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}"></i>
        <span>${text}</span>
    `

  const content = document.querySelector(".questions-content")
  content.insertBefore(message, content.firstChild)

  // Auto remove after 5 seconds
  setTimeout(() => {
    message.remove()
  }, 5000)

  // Scroll to message
  message.scrollIntoView({ behavior: "smooth", block: "center" })
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  updateRemoveButtons()
})
