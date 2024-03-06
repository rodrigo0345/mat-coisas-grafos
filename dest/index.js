import { Frontend } from "./frontend.js";
// Create the grid on page load
window.addEventListener("load", () => {
    const gridContainer = document.getElementById("grid-container");
    const findBtn = document.getElementById("find-btn");
    const weightBtn = document.getElementById("weight-btn");
    if (gridContainer === null)
        throw new Error("Grid container not found");
    if (findBtn === null)
        throw new Error("Find button not found");
    if (weightBtn === null)
        throw new Error("Weight button not found");
    const frontend = new Frontend(gridContainer, window, findBtn, weightBtn);
    frontend.generateGrid();
    frontend.disableWeights();
    const gridItems = document.querySelectorAll(".grid-item");
    gridItems.forEach((item) => {
        item.addEventListener("click", function (e) {
            // check if he is pressing right click
            frontend.toggleItem(e);
        });
    });
    const typeSelector = document.getElementById("type-selector");
    if (typeSelector === null)
        throw new Error("Type selector not found");
    typeSelector.addEventListener("change", function (e) {
        frontend.changeItemType(e);
    });
    const changeGridSize = document.getElementById("grid-size");
    console.log(changeGridSize);
    if (changeGridSize === null)
        throw new Error("Change grid size not found");
    changeGridSize.addEventListener("change", function (e) {
        console.log("change");
        if (e.target.value < 1 || e.target.value > 50) {
            alert("Please enter a value between 1 and 50");
            return;
        }
        Frontend._gridSize = parseInt(e.target.value, 13);
        frontend.generateGrid();
    });
});
