var menu = document.getElementById("menu");
var opener = document.getElementById("opener");


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
    }
    else{
        menu.classList.remove("lathato")
        menu.classList.add("nem_lathato")
    }
})