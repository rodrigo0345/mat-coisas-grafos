import { Frontend } from "./frontend.js";
// gera a grid inicial
const selectedList = document.getElementById("selected-list");
// Function to update the selected items list
// function updateSelectedList() {
//   const clickedItems = document.querySelectorAll(".grid-item.clicked");
//   selectedList.innerHTML = "";
//   clickedItems.forEach((item) => {
//     const x = item.getAttribute("data-x");
//     const y = item.getAttribute("data-y");
//     const weight = item.getAttribute("data-weight");
//     const listItem = document.createElement("li");
//     listItem.textContent = `X: ${x}, Y: ${y}, Weight: ${weight}`;
//     selectedList.appendChild(listItem);
//   });
// }
// Create the grid on page load
window.addEventListener("load", () => {
    const gridContainer = document.getElementById("grid-container");
    if (gridContainer === null)
        throw new Error("Grid container not found");
    if (selectedList === null)
        throw new Error("Selected list not found");
    const frontend = new Frontend(selectedList, gridContainer, window);
    frontend.generateGrid();
    const gridItems = document.querySelectorAll(".grid-item");
    gridItems.forEach((item) => {
        item.addEventListener("click", function (e) {
            frontend.toggleItem(e);
            //   updateSelectedList();
        });
    });
    const typeSelector = document.getElementById("type-selector");
    if (typeSelector === null)
        throw new Error("Type selector not found");
    typeSelector.addEventListener("change", function (e) {
        frontend.changeItemType(e);
    });
});
