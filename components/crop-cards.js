/**
 * Crop Selection Cards Component
 * Displays available crops with selection and confirmation modal
 */

export class CropCardsComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentCrop = null;
    this.isLocked = false;
  }

  /**
   * Render crop selector interface
   */
  render(crops = [], currentCrop = null, isLocked = false) {
    this.currentCrop = currentCrop;
    this.isLocked = isLocked;

    this.container.innerHTML = `
      <div class="crop-selector">
        <div class="crop-header">
          <h3>Crop Type Selection</h3>
          <div class="crop-controls">
            <input 
              type="text" 
              id="cropSearch" 
              class="crop-search" 
              placeholder="Search crops..."
            >
            <button id="cropLockBtn" class="btn-lock" title="Protect crop changes">
              ${isLocked ? "🔒" : "🔓"}
            </button>
          </div>
        </div>

        <div id="cropCardsContainer" class="crop-cards-grid">
          <!-- Cards will be rendered here -->
        </div>
      </div>
    `;

    this.renderCropCards(crops);
    this.attachEventListeners();
  }

  /**
   * Render individual crop cards
   */
  renderCropCards(crops = []) {
    const container = document.getElementById("cropCardsContainer");

    if (!crops || crops.length === 0) {
      container.innerHTML = '<p class="text-tertiary">No crops available</p>';
      return;
    }

    const cardsHTML = crops
      .map((crop) => {
        const isSelected = this.currentCrop?.value === crop.value;
        return `
        <div class="crop-card ${isSelected ? "selected" : ""}" data-value="${
          crop.value
        }">
          <div class="crop-image">
            <img src="../images/${crop.value}.png" alt="${crop.label}" 
              onerror="this.src='https://via.placeholder.com/150?text=${
                crop.label
              }'">
          </div>
          <div class="crop-info">
            <h4>${crop.label}</h4>
            <p class="crop-ph">pH: ${crop.minPH} - ${crop.maxPH}</p>
            ${isSelected ? '<span class="crop-badge">✓ Selected</span>' : ""}
          </div>
        </div>
      `;
      })
      .join("");

    container.innerHTML = cardsHTML;
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Crop search filter
    const searchInput = document.getElementById("cropSearch");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.filterCrops(e.target.value);
      });
    }

    // Crop card selection
    document.querySelectorAll(".crop-card").forEach((card) => {
      card.addEventListener("click", () => {
        this.selectCrop(card.dataset.value);
      });
    });

    // Lock button
    const lockBtn = document.getElementById("cropLockBtn");
    if (lockBtn) {
      lockBtn.addEventListener("click", () => {
        this.toggleLock();
      });
    }
  }

  /**
   * Filter crops by search term
   */
  filterCrops(searchTerm) {
    const cards = document.querySelectorAll(".crop-card");
    const term = searchTerm.toLowerCase();

    cards.forEach((card) => {
      const label = card.querySelector("h4").textContent.toLowerCase();
      card.style.display = label.includes(term) ? "" : "none";
    });
  }

  /**
   * Handle crop selection
   */
  selectCrop(cropValue) {
    // Dispatch event for parent to handle
    window.dispatchEvent(
      new CustomEvent("cropSelected", {
        detail: { cropValue },
      })
    );
  }

  /**
   * Toggle crop lock
   */
  toggleLock() {
    window.dispatchEvent(new CustomEvent("toggleCropLock"));
  }

  /**
   * Show confirmation modal
   */
  showConfirmationModal(cropData) {
    return new Promise((resolve) => {
      const modal = document.createElement("div");
      modal.className = "modal";
      modal.innerHTML = `
        <div class="modal-content scale-in">
          <div class="modal-header">
            <h2>Confirm Crop Change</h2>
            <button class="btn-close">✕</button>
          </div>
          <div class="modal-body">
            <p>You're about to change to <strong>${cropData.label}</strong></p>
            <div class="crop-details">
              <p><strong>Optimal pH Range:</strong> ${cropData.minPH} - ${cropData.maxPH}</p>
              <p class="warning">⚠️ This may trigger pump adjustments and affect your active monitoring</p>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" id="cancelBtn">Cancel</button>
            <button class="btn btn-primary" id="confirmBtn">Change Crop</button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      document.getElementById("cancelBtn").addEventListener("click", () => {
        modal.remove();
        resolve(false);
      });

      document.getElementById("confirmBtn").addEventListener("click", () => {
        modal.remove();
        resolve(true);
      });

      modal.querySelector(".btn-close").addEventListener("click", () => {
        modal.remove();
        resolve(false);
      });
    });
  }

  /**
   * Update current crop display
   */
  updateCurrentCrop(crop) {
    this.currentCrop = crop;
    document.querySelectorAll(".crop-card").forEach((card) => {
      card.classList.remove("selected");
    });
    const selectedCard = document.querySelector(`[data-value="${crop.value}"]`);
    if (selectedCard) {
      selectedCard.classList.add("selected");
    }
  }
}
