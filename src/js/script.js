
const menuBtn = document.querySelector(".main-header__menu-button");
const navigationMenu = document.querySelector(".main-header__navigation");
menuBtn.addEventListener("click", (event) => {
    menuBtn.classList.toggle("active");
    navigationMenu.classList.toggle("active");
});



