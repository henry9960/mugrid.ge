document.onreadystatechange = function() {
    if (document.readyState !== "complete") {
        document.querySelector("body").style.visibility = "hidden";
        document.querySelector(".loader-container").style.display = "visible";
    } else {
        document.querySelector("body").style.visibility = "visible";
        document.querySelector(".loader-container").style.display = "none";
    }
}