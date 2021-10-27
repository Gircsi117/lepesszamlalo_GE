var menu = document.getElementById("menu");
var opener = document.getElementById("opener");
var menu_icons = document.getElementsByClassName("menu_icon")


document.addEventListener("scroll", ()=>{
    if (window.scrollY > 300) {
        menu.classList.add("teto")
    }
    else {
        menu.classList.remove("teto")
    }
})

opener.addEventListener("click", ()=>{
    if (!menu.classList.contains("lathato")) {
        menu.classList.add("lathato")
        menu.classList.remove("nem_lathato")

        menu_icons[1].style.display = "none";
        menu_icons[0].classList.add("fordul_jobb")
        menu_icons[2].classList.add("fordul_bal")
    }
    else{
        menu.classList.remove("lathato")
        menu.classList.add("nem_lathato")

        menu_icons[1].style.display = "block";
        menu_icons[0].classList.remove("fordul_jobb")
        menu_icons[2].classList.remove("fordul_bal")
    }
})