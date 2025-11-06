// Reusable tutorial overlay system

export class TutorialSystem {
  constructor(steps, onComplete) {
    this.steps = steps;
    this.currentStep = 0;
    this.onComplete = onComplete;
    this.overlay = null;
  }

  start() {
    this.currentStep = 0;
    this.showStep(0);
  }

  showStep(stepIndex) {
    if (stepIndex >= this.steps.length) {
      this.complete();
      return;
    }

    const step = this.steps[stepIndex];

    // Create or update overlay
    if (!this.overlay) {
      this.createOverlay();
    }

    this.updateOverlay(step);
  }

  createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'tutorial-overlay';
    this.overlay.innerHTML = `
      <div class="tutorial-backdrop"></div>
      <div class="tutorial-content">
        <div class="tutorial-header">
          <span class="tutorial-progress"></span>
          <button class="tutorial-skip" aria-label="Skip tutorial">Skip</button>
        </div>
        <div class="tutorial-body">
          <h3 class="tutorial-title"></h3>
          <p class="tutorial-text"></p>
        </div>
        <div class="tutorial-footer">
          <button class="tutorial-prev" disabled>Previous</button>
          <button class="tutorial-next">Next</button>
        </div>
      </div>
    `;

    document.body.appendChild(this.overlay);

    // Event listeners
    this.overlay.querySelector('.tutorial-next').addEventListener('click', () => this.next());
    this.overlay.querySelector('.tutorial-prev').addEventListener('click', () => this.previous());
    this.overlay.querySelector('.tutorial-skip').addEventListener('click', () => this.skip());
  }

  updateOverlay(step) {
    const content = this.overlay.querySelector('.tutorial-content');
    const title = this.overlay.querySelector('.tutorial-title');
    const text = this.overlay.querySelector('.tutorial-text');
    const progress = this.overlay.querySelector('.tutorial-progress');
    const prevBtn = this.overlay.querySelector('.tutorial-prev');
    const nextBtn = this.overlay.querySelector('.tutorial-next');

    // Update content
    title.textContent = step.title || '';
    text.innerHTML = step.text;
    progress.textContent = `${this.currentStep + 1} / ${this.steps.length}`;

    // Update buttons
    prevBtn.disabled = this.currentStep === 0;
    nextBtn.textContent = this.currentStep === this.steps.length - 1 ? 'Got it!' : 'Next';

    // Handle highlighting
    this.clearHighlights();
    if (step.highlight) {
      this.highlightElement(step.highlight);
    }

    // Position tutorial content
    if (step.position) {
      this.positionContent(step.position);
    } else {
      content.style.top = '50%';
      content.style.left = '50%';
      content.style.transform = 'translate(-50%, -50%)';
    }
  }

  highlightElement(selector) {
    const element = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;

    if (element) {
      element.classList.add('tutorial-highlight');
      element.style.position = 'relative';
      element.style.zIndex = '10001';
    }
  }

  clearHighlights() {
    document.querySelectorAll('.tutorial-highlight').forEach(el => {
      el.classList.remove('tutorial-highlight');
      el.style.zIndex = '';
    });
  }

  positionContent(position) {
    const content = this.overlay.querySelector('.tutorial-content');

    if (position.element) {
      const target = typeof position.element === 'string'
        ? document.querySelector(position.element)
        : position.element;

      if (target) {
        const rect = target.getBoundingClientRect();
        const placement = position.placement || 'bottom';

        switch (placement) {
          case 'bottom':
            content.style.top = `${rect.bottom + 20}px`;
            content.style.left = `${rect.left + rect.width / 2}px`;
            content.style.transform = 'translateX(-50%)';
            break;
          case 'top':
            content.style.top = `${rect.top - 20}px`;
            content.style.left = `${rect.left + rect.width / 2}px`;
            content.style.transform = 'translate(-50%, -100%)';
            break;
          case 'left':
            content.style.top = `${rect.top + rect.height / 2}px`;
            content.style.left = `${rect.left - 20}px`;
            content.style.transform = 'translate(-100%, -50%)';
            break;
          case 'right':
            content.style.top = `${rect.top + rect.height / 2}px`;
            content.style.left = `${rect.right + 20}px`;
            content.style.transform = 'translateY(-50%)';
            break;
        }
      }
    }
  }

  next() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.showStep(this.currentStep);
    } else {
      this.complete();
    }
  }

  previous() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.showStep(this.currentStep);
    }
  }

  skip() {
    this.complete();
  }

  complete() {
    this.clearHighlights();
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
    if (this.onComplete) {
      this.onComplete();
    }
  }
}

// CSS for tutorial system (should be added to common.css or inline)
export const tutorialStyles = `
.tutorial-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10000;
  pointer-events: none;
}

.tutorial-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  pointer-events: all;
}

.tutorial-content {
  position: absolute;
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: var(--spacing-lg);
  max-width: 500px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  pointer-events: all;
  z-index: 10001;
}

.tutorial-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.tutorial-progress {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.tutorial-skip {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: 0.875rem;
}

.tutorial-skip:hover {
  color: var(--text-primary);
  background: none;
  transform: none;
}

.tutorial-body {
  margin-bottom: var(--spacing-lg);
}

.tutorial-title {
  font-size: 1.25rem;
  margin-bottom: var(--spacing-sm);
  color: var(--accent-primary);
}

.tutorial-text {
  color: var(--text-primary);
  line-height: 1.6;
}

.tutorial-footer {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-md);
}

.tutorial-footer button {
  flex: 1;
}

.tutorial-highlight {
  box-shadow: 0 0 0 4px var(--accent-primary), 0 0 20px rgba(233, 69, 96, 0.5);
  border-radius: 4px;
  animation: tutorial-pulse 2s infinite;
}

@keyframes tutorial-pulse {
  0%, 100% {
    box-shadow: 0 0 0 4px var(--accent-primary), 0 0 20px rgba(233, 69, 96, 0.5);
  }
  50% {
    box-shadow: 0 0 0 6px var(--accent-primary), 0 0 30px rgba(233, 69, 96, 0.8);
  }
}

@media (max-width: 768px) {
  .tutorial-content {
    max-width: 90%;
    padding: var(--spacing-md);
  }
}
`;
