let darkmode = localStorage.getItem('darkmode')
const themeswitch = document.getElementById('check')

const enableDarkmode = () =>{
    // document.querySelector(".toggle").style.backgroundColor = "#710071"
    document.querySelector(".icon").src = "../static/images/iconwhite.png"
    document.getElementById("ol").querySelector("path").style.fill = '#664a5e';
    document.body.classList.add('darkmode')
    localStorage.setItem('darkmode', 'active')
}

const disableDarkmode = () =>{
    // document.querySelector(".toggle").style.backgroundColor = "wheat"
    document.querySelector(".icon").src = "../static/images/icon.png"
    document.getElementById("ol").querySelector("path").style.fill = 'black';
    document.body.classList.remove('darkmode')
    localStorage.setItem('darkmode', 'null')
}

if (darkmode === 'active') enableDarkmode()

themeswitch.addEventListener("click", ()=>{
    darkmode = localStorage.getItem('darkmode')
    darkmode !== "active" ? enableDarkmode() : disableDarkmode()
})
