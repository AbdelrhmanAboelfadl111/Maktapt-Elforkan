function addActiveToNavItem(that) {
    $(document).ready(function() {
    $(".navbar-nav li").removeClass("active").delay(500); 
    $(that).addClass("active");
    
});
};

function openNav(name) {
    $(name).fadeIn(500);
};

function closeNav(name) {
    $(name).fadeOut(500);
}

function stop() {
    player.pause();
}