export function renderQuestion(question, index) {
    return `
      <div class="question">
        <h3 class="text-xl font-semibold">${question.text}</h3>
        <p class="subtext">${question.subtext}</p>
        <div class="options-grid">
          ${question.options.map((option, optionIndex) => `
            <div class="option">
              <input type="radio" 
                     id="q${index}_${optionIndex}" 
                     name="q${index}" 
                     value="${option.value}"
                     class="hidden">
              <label for="q${index}_${optionIndex}" 
                     class="option-label">
                ${option.label}
              </label>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }