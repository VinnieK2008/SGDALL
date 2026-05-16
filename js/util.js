// https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
export function getYoutubeIdFromUrl(url) {
    return url.match(
        /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&]*).*/,
    )?.[1] ?? '';
}
export function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
export function engineCompleted(entry, engine, list, returnProgress) {
    let b = 0;
    let c = 0;
    console.error(entry);
    console.error(entry.verified.length);
    for (let index = 0; index < entry.verified.length; index++) {
        if (entry.verified[index].engine == engine) {
            b++;
        }
    }
    for (let index = 0; index < entry.completed.length; index++) {
        if (entry.completed[index].engine == engine) {
            b++;
        }
    }
    for (let index = 0; index < list.length; index++) {
        if (list[index][0].engine == engine) {
            c++;
        }
    }
    if (returnProgress) {
        return `${b}/${c}`;
    } else {
        // bronze medal for 1 completion or less than 40% completion
        if (b >= 1 && b / c < 0.4) {
            return 1;
        }
        // sliver medal for more than 40% to less than 70% completion
        if (b / c >= 0.4 && b / c < 0.7) {
            return 2;
        }
        // gold medal for more than 70% to less than 100%
        if (b / c >= 0.7 && b / c != 1) {
            return 3;
        }
        // "author" medal for all levels completed
        if (b / c == 1) {
            return 4;
        }
    }
    // no completions?
    return 0;
}
export function engiCalc(level) {
    let enjoyments = [];
    let divideBy = 1;
    let enjoymentAverage = parseFloat(level.enj);
	console.error(`Engi avg: ${enjoymentAverage}`)
    for (let index = 0; index < level.records.length; index++) {
           enjoyments.push(parseFloat(level.records[index].enj))
    }
	console.error(`Engis: ${enjoyments}`)
    for (let index = 0; index < enjoyments.length; index++) {
		if (enjoyments[index] || enjoyments[index] == 0) {
            divideBy++;
            enjoymentAverage = enjoymentAverage + enjoyments[index];
			console.error(`index: ${index}`)
			console.error(`EngiAvg: ${enjoymentAverage}`)
		}
    }	
	if (enjoymentAverage != "55.355000000000004") {
        return Math.round((enjoymentAverage / divideBy) * 100) / 100;
	} else {
		return "55.3550000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004";
	}
}
export function getScratchPFP(username) {
    return "https://uploads.scratch.mit.edu/get_image/user/111315218_90x90.png?v=";
    let b = getAPI(username);
    b.then(hsdkjhwsfkjwh => { return hsdkjhwsfkjwh })
}
async function getAPI(username) {
	    const res = await fetch(`https://cors.gays3xlol.workers.dev/https://api.scratch.mit.edu/users/${encodeURIComponent(username)}`);
        const obj = await res.json();
        const objParsed = JSON.parse(JSON.stringify(obj));
        if (objParsed.profile) {
            return `https://uploads.scratch.mit.edu/get_image/user/${objParsed.profile.id}_90x90.png`;
        } else {
            return "https://uploads.scratch.mit.edu/get_image/user/1_90x90.png"
        }
    }
export function getLevelThumbnail(levelPos, list) {
            if (list || levelPos) {
                const currentLevel = list[levelPos][0];
                if (currentLevel) {
                    return setUpThumbnailStyle(currentLevel.name);
                }
            }
            return null
}
export function getLevelThumbnailR(levelPos, list) {
            if (list || levelPos) {
                const currentLevel = list[levelPos];
                if (currentLevel) {
                    return setUpThumbnailStyle(currentLevel.name);
                }
            }
            return null
}
function setUpThumbnailStyle(levelName) {
    			if (levelName == "getting kicked out of train") {
                    return `background-image: linear-gradient(rgb(0 0 0 / 0.5), rgb(0 0 0 / 0.5)), url(https://www.amtrak.com/content/dam/projects/dotcom/english/public/images/heros/couple-cafe-window-view.jpg); background-size: cover; background-repeat: no-repeat; background-position: center;`
                } else {
                return `background-image: var(--level-button), url(${getThumbnailImage(levelName)}); background-size: cover; background-repeat: no-repeat; background-position: center;`
				}
            }
export function getThumbnailImage(lvlName) {
    return `../assets/levels/${encodeURIComponent(lvlName).replace(/\b'\b/, "")}.png`;
}
export function embed(video) {
    	if(video.includes("medal.tv")) {
            return video;
        } else if(video.includes("drive.google.com")) {
			return video.includes("/view") ? video.replace("/view", "/preview") : video + "/preview"
		} else {
        	return `https://www.youtube.com/embed/${getYoutubeIdFromUrl(video)}?rel=0`;
        }
}
export function mamaMia(swaggers) {
     console.log("../assets/" + swaggers + ".svg");
     return "../assets/" + swaggers + ".svg";
}
export async function getPeople() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
           // Typical action to be performed when the document is ready:
           console.log("yes sir");
           document.getElementById("displayVisits").innerHTML = xhttp.responseText;
        }
    };
    xhttp.open("GET", "../data/stats/displayVisits.php", true);
    xhttp.send();
}
export async function incVisits() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
           // Typical action to be performed when the document is ready:
        }
    };
    xhttp.open("GET", "../data/stats/incrementVisits.php", true);
    xhttp.send();
}
var incGDR = 0;
export async function otherStats(list) {
    incGDR = 0;
    for (let i = 0; i < list.length; i++) {
  		console.log(list[i].find(isGDR));
	}
    var timeDifference;
    var j;
    j = new Date();
    timeDifference = Math.floor(((new Date() / 1000) - 1763410264) / 86400);
    console.log(timeDifference);
    console.log(incGDR);
    document.getElementById("displayListLength").innerHTML = list.length;
    document.getElementById("displayMostUsedEngine").innerHTML = incGDR;
    document.getElementById("displayDaysSincePublic").innerHTML = timeDifference;
}

function isGDR(level) {
  if (level === null) {
      return 0;
  } else {
      if (level.engine === "GDR") {
          incGDR++;
      }
      return level.engine === "GDR";
  }
}
export function localize(num) {
    return num.toLocaleString(undefined, { minimumFractionDigits: 2 });
}

export function doStuff(levelName) {
    return "background-image: url('../assets/levels/Greyhound.webp');";
}
export function getEngineSelect() {
    console.log("juz pomnie,.");
    let params = new URLSearchParams(document.location.search); 
    console.log(params.get("engine"));
    if (params.get("engine") == "All") {
        return null;
    } else {
        return params.get("engine");
    }
}
export function getSelectSelect(list) {
    console.log("Yayers");
    let params = new URLSearchParams(document.location.search); 
    let selectedInt = parseInt(params.get("selected"));
    console.log(params.get("selected"));
    if (selectedInt == null || isNaN(selectedInt) || selectedInt - 1 > list.length || selectedInt - 1 < 0) {
        return null;
    } else {
        return selectedInt - 1;
    }
}

export function selectRandomLevel(levels) {
    console.log("They done clicked the egg button!!!");
	let randomLevel = getRandomInt(levels.length)
	return randomLevel;
}

export function getThumbnailFromId(id) {
    return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
}
export function listLevelNameFilter() {
	if (!document.getElementById("filterForLevelName") == null)
		document.getElementById("filterForLevelName").addEventListener("keyup", () => {
        console.log(`Name: ${document.getElementById("filterForLevelName").value}`);
    });
}
export function listPlayerFilter() {
	if (!document.getElementById("filterForPlayerlName") == null)
		document.getElementById("filterForPlayerName").addEventListener("keyup", () => {
        console.log(`Name: ${document.getElementById("filterForPlayerName").value}`);
    });
}
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }

    return array;
}
