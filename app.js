let play = document.querySelector("#play");

let currentSong = new Audio();
let songs;

// time convert sec into hours:min format 
function timeConvert(totalSeconds) {
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = Math.floor(totalSeconds % 60);

    // Add leading zeros if necessary
    var formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    var formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

    return formattedMinutes + ":" + formattedSeconds;
}





//get all songs from url
async function getSong() {
   
    try {
        const response = await fetch("https://github.com/IsmailofficialGithub/Spotify-Clone-Music-app-/tree/main/song");
        if (!response.ok) throw new Error("Failed to fetch songs.");

        const songs = Array.from(
            new DOMParser().parseFromString(await response.text(), "text/html").querySelectorAll("a[href$='.mp3']"),
            a => a.href
        );

        // Split each song URL by "/song/" and return the resulting array
        const splitSongs = songs.map(song => song.split("/song/")[1]);

        return splitSongs;
    } catch (error) {
        console.error("Error fetching songs:", error);
    }
    
    
}
//play music when ever play button click
const playMusic = (track, pause = false) => {
    currentSong.src = "/song/" + track;
    if (!pause) {
        currentSong.play();
        play.src = "images/play.svg";
    }


    currentSong.play();
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00/00:00";


    

}


async function main() {

    songs = await getSong("song")

    playMusic(songs[0], true);


    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUl.innerHTML = "";
    
    for (const song of songs) { 
        songUl.innerHTML =songUl.innerHTML + `<li><img src="images/music.svg" alt="" class="invert">
        <div class="info">
            <div>${song.replaceAll("%20", " ")}</div>
            <div>Ismail</div>
        </div>
       
        <img src="images/play.svg" alt="" class="invert">
     </li> `;
    }
    //attach eventlistener to each
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e) => {
    
        e.addEventListener("click", element => {
            // console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML);
    
        })
    })


    // listner for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${timeConvert(currentSong.currentTime)} / ${timeConvert(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";

    })

}


main();
//event listener on click btn
play.addEventListener("click", () => {
    if (currentSong.paused) {
        play.src = "images/pause.svg";
        currentSong.play();
    } else {
        currentSong.pause();
        play.src = "images/play.svg";

    }
})
//event listener on seek btn
document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
})

//add event listener for hamburger //

document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
})
//add event listener for close button //

document.querySelector(".logo").getElementsByTagName("img")[1].addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";

})

//add event listener on previous button
previous.addEventListener("click", () => {
    currentSong.pause()
    // console.log("previous click")

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if ((index + 1) > 0) {
        playMusic(songs[index - 1]);
    }
})
//add event listener on next button
next.addEventListener("click", () => {
    currentSong.pause()
    // console.log("next click")

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if ((index + 1) < songs.length) {
        playMusic(songs[index + 1]);
    }
})
//add event listener on volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    currentSong.volume = parseInt(e.target.value) / 100
    console.log("volumn 100 /" + e.target.value);

    if (e.target.value < 1) {
        volumeImg.src = "images/volumeLow.svg";

    }
    else {
        volumeImg.src = "images/volumeHigh.svg";

    }
})



