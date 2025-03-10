
let currentSong=new Audio();
let songs;
let currFolder;
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getSongs(folder){
    currFolder = folder;
    let a=await fetch(`/${folder}/`)
    let response=await a.text();
    console.log(response);
    let div=document.createElement("div");
    div.innerHTML=response;
    let as=div.getElementsByTagName("a")
    songs=[];
    for(let index=0;index<as.length;index++){
        const element=as[index];
        if(element.href.endsWith(".m4a")){
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }


    //Show all the songs in the playlist
    let songUL=document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML=""
    for (const song of songs) {
        songUL.innerHTML=songUL.innerHTML+`<li><img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Debjeet</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div></li>`;
    }  

    //Attach event listner to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    return songs
}

const playMusic=(track, pause=false)=>{
    currentSong.src=`/${currFolder}/`+track
    if(!pause){
        currentSong.play()
        play.src="img/pause.svg"
    }
    currentSong.play()
    document.querySelector(".songinfo").innerHTML=decodeURI(track)
    document.querySelector(".songtime").innerHTML="00:00 / 00:00"

    

}

async function displayAlbums(){
    let a=await fetch(`/songs/`)
    let response=await a.text();
    let div=document.createElement("div");
    div.innerHTML=response;
    let anchors=div.getElementsByTagName("a")
    let cardContainer=document.querySelector(".cardContainer")
    let array=Array.from(anchors)
        for(let index=0;index < array.length;index++){
            const e=array[index];

        let parts = e.href.split("/").slice(-2);  // Get last two parts of URL
        if (parts[0] === "songs") {  // Ensure the parent is "songs"
            let folder=parts[1];
            console.log(parts)

            //Get the metadata of the folder
            let a=await fetch(`/songs/${folder}/info.json`)
            let response=await a.json();
            console.log(response) 
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                        <div class="play">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5" stroke-linejoin="round"/>
                            </svg>   
                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="fail">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
        }    
    }

    //Load the playlist whenever the card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async item=>{
            songs=await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
    })
}

async function main(){
    //Get the list of all songs
    await getSongs("songs/ncs")
    playMusic(songs[0],true)

    //Display all the albums on this page
    displayAlbums()

    //Attach an event listner to play, next and previous
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src="img/pause.svg"
        }
        else{
            currentSong.pause()
            play.src="img/play.svg"
        }
    })

    //Listen for time update event
    currentSong.addEventListener("timeupdate",()=>{
        document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100+"%";
       })

       //Add an event Listner to seekbar
       document.querySelector(".seekbar").addEventListener("click",e=>{
            let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
            document.querySelector(".circle").style.left=percent+"%";
            currentSong.currentTime=((currentSong.duration)*percent)/100;
       })

       //Add an event listner for hamburger

       document.querySelector(".hamburger").addEventListener("click", ()=>{
            document.querySelector(".left").style.left="0";
       })

       //Add event listner for close button

       document.querySelector(".close").addEventListener("click", ()=>{
            document.querySelector(".left").style.left="-120%";
        })

        //Add an event listner to previous link
        previous.addEventListener("click", ()=>{
            console.log("Previous link")
            let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
            if((index-1)>=0){
                playMusic(songs[index-1])
            }
        })

        //Add an event listner to next link
        next.addEventListener("click", ()=>{
            console.log("Next link")

            let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
            if((index+1)< songs.length){
                playMusic(songs[index+1])
            }  
        })

        //Add a event to volume
        document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
            console.log("Setting volume to",e.target.value, "/ 100")
            currentSong.volume=parseInt(e.target.value)/100
            if (currentSong.volume>0){
                document.querySelector(".volume>img").src=document.querySelector(".volume>img").src.replace("img/mute.svg","img/volume.svg")
            }
        })

        //Add event listener to mute the track
        document.querySelector(".volume>img").addEventListener("click",e=>{
            if(e.target.src.includes("img/volume.svg")){
                e.target.src=e.target.src.replace("img/volume.svg","img/mute.svg")
                currentSong.volume=0;
                document.querySelector(".range").getElementsByTagName("input")[0].value=0;
            }
            else{
                e.target.src=e.target.src.replace("img/mute.svg","img/volume.svg")
                currentSong.volume=.10;
                document.querySelector(".range").getElementsByTagName("input")[0].value=10;
            }
        })

        // Search functionality for filtering the cards
document.querySelector('.searchInput').addEventListener('input', function() {
    const query = this.value.toLowerCase();
    const cards = document.querySelectorAll('.cardContainer .card');
  
    cards.forEach(card => {
      // Retrieve text content from card elements (customize selectors as needed)
      const title = card.querySelector('h2') ? card.querySelector('h2').textContent.toLowerCase() : "";
      const description = card.querySelector('p') ? card.querySelector('p').textContent.toLowerCase() : "";
      const folder = card.getAttribute('data-folder') ? card.getAttribute('data-folder').toLowerCase() : "";
  
      // If any field contains the query, display the card; otherwise hide it
      if (title.includes(query) || description.includes(query) || folder.includes(query)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
  



} 




main()



