// ===========================================تعريف المتغيرات===============================================

const reciters = document.querySelector("#reciters");
const rewaya = document.querySelector("#system");
rewaya.innerHTML = `<option value="" disabled selected hidden>اختر الرواية</option>`;
const suwars = document.querySelector("#sora");
suwars.innerHTML += `<option value="" disabled selected hidden>اختر السورة</option>`;
const player = new Plyr('#player', {
    controls: [
        'play-large',
        'play', 
        'progress', 
        'current-time', 
        'mute', 
        'volume', 
        'settings',
        'download'   
    ],
    settings: ['speed'], 
    speed: { selected: 1, options: [0.5, 1, 1.25, 1.5, 2] } 
});
const apiUrl = 'https://www.mp3quran.net/api/v3';
const endPoint = 'reciters';
const language = 'ar';
let boxOfPop = document.querySelector(".pop-box");
const reciters2 = document.querySelector("#reciters2");
const rewaya2 = document.querySelector("#system2");
rewaya2.innerHTML = `<option value="" disabled selected hidden>اختر الرواية</option>`;
const suwars2 = document.querySelector("#sora2");
suwars2.innerHTML += `<option value="" disabled selected hidden>اختر السورة</option>`;
const player2 = new Plyr('#player2', {
    controls: [
        'play-large',
        'play', 
        'progress', 
        'current-time', 
        'mute', 
        'volume', 
        'settings',  
    ],
    settings: ['speed'], 
    speed: { selected: 1, options: [0.5, 1, 1.25, 1.5, 2] } 
});
const btnDownload = document.querySelector(".boxdown a");
const messageAlert = document.querySelector(".alert");


// =============================================section2==================================================

async function getMoushaf(reciter) {
    const res = await fetch(`${apiUrl}/${endPoint}?language=${language}&reciter=${reciter}`);
    const data = await res.json();
    const mushaf = data.reciters[0].moshaf;
    rewaya.innerHTML = `<option value="" disabled selected hidden>اختر الرواية</option>`;
    mushaf.forEach((item) => {
        rewaya.innerHTML += `
        <option value="${item.id}" data-server="${item.server}" data-list="${item.surah_list}">${item.name}</option>
        `
    });
    rewaya.addEventListener("change", (e) => {
        const selectedMoshaf = rewaya.options[rewaya.selectedIndex];
        const soraServer = selectedMoshaf.dataset.server;
        const soraList = selectedMoshaf.dataset.list;
        getSura(soraServer,soraList);
    });
};
async function getReciters() {
    const res = await fetch(`${apiUrl}/${endPoint}?language=${language}`);
    const data = await res.json();
};
async function getSura(soraServer,soraList) {
    const res = await fetch(`https://mp3quran.net/api/v3/suwar`);
    const data = await res.json();
    const soraNames = data.suwar;
    soraList = soraList.split(",");
    suwars.innerHTML = `<option value="" disabled selected hidden>اختر السورة</option>`
    soraList.forEach((sora) => {
        const padSura = sora.padStart(3, "0");
        soraNames.forEach((soraName) => {
            if (soraName.id == sora) {
                suwars.innerHTML += `
                    <option value="${soraServer}${padSura}.mp3">${soraName.name}</option>
                `
            }
        })
    })
};
getReciters();
suwars.addEventListener("change", (e) => {
    const selectedSora = suwars.options[suwars.selectedIndex];
    playSora(selectedSora.value);
});
function playSora(soraMp3) {
    player.pause();
    player.source = {
    type: 'audio',
    sources: [{ src: soraMp3, type: 'audio/mp3' }]
    
};
setTimeout(() => {
    const downloadBtn = document.querySelector('.plyr__controls [data-plyr="download"]');
    if (downloadBtn) {
        const link = document.createElement('a');
        link.href = soraMp3;
        link.download = 'sura.mp3';
        downloadBtn.setAttribute('href', soraMp3);
        downloadBtn.setAttribute('download', 'sura.mp3');
    }
}, 500);
};

// ==================================================================================================

boxOfPop.addEventListener("click", (e) => {
    e.stopPropagation();
});

// =============================================section3==================================================

async function getReciters2() {
    const res = await fetch(`${apiUrl}/${endPoint}?language=${language}`);
    const data = await res.json();
    reciters2.innerHTML = `<option value="" disabled selected hidden>اختر القارئ</option>`;
    data.reciters.forEach(item => {
        reciters2.innerHTML += `<option value="${item.id}">${item.name}</option>`;
    });

    reciters2.addEventListener("change", async (e) => {
        const res = await fetch(`${apiUrl}/${endPoint}?language=${language}&reciter=${e.target.value}`);
        const data2 = await res.json();
        const mushaf = data2.reciters[0].moshaf;
        rewaya2.innerHTML = `<option value="" disabled selected hidden>اختر الرواية</option>`;
        mushaf.forEach((item) => {
            rewaya2.innerHTML += `
                <option value="${item.id}" data-server="${item.server}" data-list="${item.surah_list}">${item.name}</option>
            `;
        });

        rewaya2.addEventListener("change", async (ev) => {
            const selectedMoshaf = rewaya2.options[rewaya2.selectedIndex];
            const soraServer = selectedMoshaf.dataset.server;
            const soraList = selectedMoshaf.dataset.list.split(",");
            const res3 = await fetch(`https://mp3quran.net/api/v3/suwar`);
            const data3 = await res3.json();
            suwars2.innerHTML = `<option value="" disabled selected hidden>اختر السورة</option>`;
            data3.suwar.forEach((soraName) => {
                soraList.forEach((sora) => {
                    const padSura = sora.padStart(3, "0");
                    if (soraName.id == sora) {
                        suwars2.innerHTML += `<option value="${soraServer}${padSura}.mp3">${soraName.name}</option>`;
                    }
                });
            });
        });
    });

    suwars2.addEventListener("change", (e) => {
        const selectedSora = suwars2.options[suwars2.selectedIndex];
        btnDownload.setAttribute("href", selectedSora.value);
        player2.pause();
        player2.source = {
        type: 'audio',
        sources: [{ src: selectedSora.value, type: 'audio/mp3' }]
        };
    setTimeout(() => player2.play(), 500);
    player2.on('play', () => {
        $(".imgTitleBox").addClass("play");
    });
    player2.on('pause', () => {
        $(".imgTitleBox").removeClass("play");
    });

    });
    btnDownload.addEventListener("click", (e) => {
    e.preventDefault();
    const selectedSora = suwars2.options[suwars2.selectedIndex];
    if (!selectedSora || !selectedSora.value) {
        $(".bigBoxForShapes .box").addClass("shaked");
        setTimeout(function () {
            $(".bigBoxForShapes .box").removeClass("shaked");
        }, 500);
        messageAlert.classList.add("show");
        setTimeout(function () {
            messageAlert.classList.remove("show");
        },2000);
    } else {
        console.log("sora");
        window.location.href = selectedSora.value;
    }
});

};
getReciters2();

// =======================================================================================================

new fullpage("#fullpage", {
    anchors: ["home", "elite", "reciters"],
    navigation: true,
    slidesNavigation: true,
    scrollingSpeed: 1198,
    fitToSectionDelay: 600,
    easingcss3: "cubic-bezier(0.8, -0.4, 0.5, 1)",
    loopHorizontal: false,
    scrollOverflow: true, // ✅ لازم تتفعل عشان التاتش يشتغل داخل السكاشن
    lazyLoading: false,
    licenseKey: "YOUR_LICENSE_KEY_HERE",
    touchSensitivity: 15,
    bigSectionsDestination: null,
    normalScrollElementTouchThreshold: 5,
    normalScrollElements: '.personCon',
    afterLoad: function(origin, destination, direction){
        document.querySelectorAll(".navbar-nav li").forEach(li => li.classList.remove("active"));
        const sectionName = destination.anchor;
        const activeLink = document.querySelector(`.navbar-nav a[data-anchor="${sectionName}"]`);
        if(activeLink){
            activeLink.parentElement.classList.add("active");
        }
    }
});

// ====================== التنقل بين الأقسام ======================
document.querySelector('a[data-anchor="home"]').addEventListener("click", function(e){
    e.preventDefault();
    fullpage_api.moveTo('home');
});

document.querySelector('a[data-anchor="elite"]').addEventListener("click", function(e){
    e.preventDefault();
    fullpage_api.moveTo('elite');
});

document.querySelector('a[data-anchor="reciters"]').addEventListener("click", function(e){
    e.preventDefault();
    fullpage_api.moveTo('reciters');
});

$(".navbar-nav li").click(function () {
    addActiveToNavItem(this);
});

window.addEventListener("load",() => {
    setTimeout(function () {
        $(".loading").fadeOut(3000);
},3000)
})
// =======================================================================================================

