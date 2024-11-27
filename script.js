const canvasContainer = document.querySelector(".canvas-container");
const addTextBtn = document.querySelector(".add-textt");
const undoBtn = document.querySelector(".undo");
const redoBtn = document.querySelector(".redo");
const fontSelect = document.getElementById("fontSelect");
const increaseFontBtn = document.getElementById("increaseFont");
const decreaseFontBtn = document.getElementById("decreaseFont");
const boldBtn = document.getElementById("boldBtn");
const italicBtn = document.getElementById("italicBtn");
const underlineBtn = document.getElementById("underlineBtn");

let actionStack = [];
let redoStack = [];
let selectedText = null;

// Add Textbox to Canvas
addTextBtn.addEventListener("click", () => {
    const textBox = document.createElement("div");
    textBox.contentEditable = true;
    textBox.style.position = "absolute";
    textBox.style.left = "50%";
    textBox.style.top = "50%";
    textBox.style.transform = "translate(-50%, -50%)";
    textBox.style.fontSize = "16px";
    textBox.style.fontFamily = "Arial";
    textBox.style.padding = "10px";
    textBox.style.cursor = "grab";
    textBox.style.border = "2px solid black";
    textBox.style.borderRadius = "15px";
    textBox.style.width = "auto";
    textBox.style.minWidth = "150px";

    


   
    textBox.addEventListener("click", () => {
        selectedText = textBox;
    });

    // Dragging Logic
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    textBox.addEventListener("mousedown", (e) => {
        isDragging = true;
        const rect = textBox.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            const canvasRect = canvasContainer.getBoundingClientRect();

            let newLeft = e.clientX - canvasRect.left - offsetX;
            let newTop = e.clientY - canvasRect.top - offsetY;

            
            newLeft = Math.max(0, Math.min(newLeft, canvasRect.width - textBox.offsetWidth));
            newTop = Math.max(0, Math.min(newTop, canvasRect.height - textBox.offsetHeight));

            textBox.style.left = `${newLeft}px`;
            textBox.style.top = `${newTop}px`;
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
    });

    canvasContainer.appendChild(textBox);
    saveState();
});

// Undo Action
undoBtn.addEventListener("click", () => {
    if (actionStack.length > 0) {
        const lastAction = actionStack.pop();
        redoStack.push(canvasContainer.innerHTML);
        canvasContainer.innerHTML = lastAction;
    }
});

// Redo Action
redoBtn.addEventListener("click", () => {
    if (redoStack.length > 0) {
        const redoAction = redoStack.pop();
        actionStack.push(canvasContainer.innerHTML);
        canvasContainer.innerHTML = redoAction;
    }
});


function saveState() {
    actionStack.push(canvasContainer.innerHTML);
    redoStack = [];
}

// Font Selection
fontSelect.addEventListener("change", () => {
    if (selectedText) {
        selectedText.style.fontFamily = fontSelect.value;
        saveState();
    }
});

// Font Size Increase
increaseFontBtn.addEventListener("click", () => {
    if (selectedText) {
        const currentSize = parseInt(getComputedStyle(selectedText).fontSize);
        selectedText.style.fontSize = `${currentSize + 2}px`;
        saveState();
    }
});

// Font Size Decrease
decreaseFontBtn.addEventListener("click", () => {
    if (selectedText) {
        const currentSize = parseInt(getComputedStyle(selectedText).fontSize);
        selectedText.style.fontSize = `${currentSize - 2}px`;
        saveState();
    }
});

// Bold Text
boldBtn.addEventListener("click", () => {
    if (selectedText) {
        selectedText.style.fontWeight = selectedText.style.fontWeight === "bold" ? "normal" : "bold";
        saveState();
    }
});

// Italic Text
italicBtn.addEventListener("click", () => {
    if (selectedText) {
        selectedText.style.fontStyle = selectedText.style.fontStyle === "italic" ? "normal" : "italic";
        saveState();
    }
});

// Underline Text
underlineBtn.addEventListener("click", () => {
    if (selectedText) {
        selectedText.style.textDecoration = selectedText.style.textDecoration === "underline" ? "none" : "underline";
        saveState();
    }
});
