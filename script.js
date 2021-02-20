let displayedEpisodes = []; // episodes that are being displayed on the site page
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  const episodesDiv = document.createElement("div");

  rootElem.innerHTML = `
  <p class="source info">Content from site:&nbsp;<span id="source"><a href="https://tvmaze.com/" target="_blank" style="text-decoration:none; color:darkred">TVMaze.com</a></span></p>
  <form class="flex-form">
    <select name="episodes" id="episodes">
      <option value="">All episodes</option>
    </select>
    <input type="text" id="txt-search">
    <button id="btn-search"><i class="fa fa-search"></i></button>
  </form>
  <p class="result info"><span>Displaying</span>&nbsp;<span id="quantity"></span><span id="total">/${episodeList.length}&nbsp;episode(s)</span></p>
  `;

  episodesDiv.classList = "episodes";
  const select = document.getElementById("episodes"); // the <select> element
  // for every episode in episodeList...
  episodeList.forEach((episode) => {
    // declare (and assigin) variables/constants related to html elements
    const thumbnail = document.createElement("div"); // a <div> element to display important episode information
    const title = document.createElement("h4"); // episode name and other important information
    const img = document.createElement("img"); // a medium-sized image representing the episode
    const summary = document.createElement("div"); // episode summary
    const option = document.createElement("option"); // an <option> element (child to "select")
    // other constants
    const epName = episode.name; // episode name, e.g "Winter is Coming"
    const epSeason = episode.season.toString().padStart(2, "0"); // episode season, e.g. "05"
    const epNumber = episode.number.toString().padStart(2, "0"); // episode number, e.g. "02"
    const epUrl = episode.url; // TVMaze link for episode
    // add attribute and content information to html elments
    thumbnail.classList = "thumbnail";
    title.classList = "title";
    title.innerHTML = `<a href=${epUrl} target="_blank" style="text-decoration:none; color:darkred">${epName} - S${epSeason}E${epNumber}</a>`;
    img.src = episode.image.original;
    summary.innerHTML = episode.summary;
    summary.classList = "summary";
    option.value = `${epName} - S${epSeason}E${epNumber}`;
    option.textContent = `S${epSeason}E${epNumber} - ${epName}`;
    // add html elements to appropriate parent containers
    select.appendChild(option);
    thumbnail.appendChild(title);
    thumbnail.appendChild(img);
    thumbnail.appendChild(summary);
    episodesDiv.appendChild(thumbnail);
    // add thumbnail to displayedEpisodes
    displayedEpisodes.push(thumbnail);
  });
  // finally add episodesDiv to rootElem, i.e. the parent div element
  rootElem.appendChild(episodesDiv);
  // now indicate how many episodes are being displayed
  document.getElementById("quantity").textContent = displayedEpisodes.length;
  // add event listeners
  document
    .getElementById("btn-search")
    .addEventListener("click", controlSearch);
  document.getElementById("episodes").addEventListener("input", selectEpisode);
  // initial form styling
  document.getElementById("episodes").style.order = 1;
  document.getElementById("txt-search").style.order = 1;
  // document.getElementById("txt-search").classList.add("faded");
  document.getElementById("txt-search").hidden = true;
  document.getElementById("btn-search").style.order = 2;
  document.getElementById("btn-search").classList.add("blue");
}

window.onload = setup;

function searchEpisodes(e) {
  const keyword = e.target.value.toLowerCase(); // search keyword
  // for every episode in displayedEpisodes...
  displayedEpisodes.forEach((episode) => {
    const title = episode.querySelector(".title").textContent.toLowerCase(); // episode title
    const summary = episode.querySelector("div").textContent.toLowerCase(); // episode synopsis
    // show/hide episode thumbnails
    if (!(title.includes(keyword) || summary.includes(keyword))) {
      // episode.classList.add("none");
      episode.style.display = "none";
    } else {
      if (episode.style.display === "none") {
        episode.style.display = "initial";
      }
    }
    // update info about how many episodes are being displayed
    updateDisplayInfo();
  });
}

// show only a selected episode
function selectEpisode(e) {
  const episodeToDisplay = e.target.value;
  if (episodeToDisplay !== "") {
    // for every episode in displayedEpisodes..
    displayedEpisodes.forEach((episode) => {
      // show/hide episode thumbnails
      if (episodeToDisplay !== episode.querySelector(".title").textContent) {
        episode.style.display = "none";
      } else {
        if (episode.style.display === "none") {
          episode.style.display = "initial";
        }
      }
    });
  } else {
    displayedEpisodes.forEach((episode) => {
      if (episode.style.display === "none") {
        episode.style.display = "initial";
      }
    });
  }
  // update <form> element styles
  controlSearch(e);
  // update info about how many episodes are being displayed
  updateDisplayInfo();
}

// a function to update the display information at the top of the page
function updateDisplayInfo() {
  const removedEpisodes = Array.from(
    document.querySelectorAll(".thumbnail")
  ).filter((ep) => ep.style.display === "none"); // hidden episode thumbnails
  document.getElementById("quantity").textContent =
    displayedEpisodes.length - removedEpisodes.length;
}

function controlSearch(event) {
  event.preventDefault();
  const id = event.target.id; // id of the form element the event method was called upon
  const button = document.getElementById("btn-search");
  const icon = button.querySelector("i");
  const input = document.getElementById("txt-search");
  const select = document.getElementById("episodes");

  switch (id) {
    case "episodes":
      if (select.value !== "") {
        input.value = "";
        input.hidden = true;
        button.classList.remove("grey");
        button.classList.add("blue");
        icon.classList.remove("fa-close");
        icon.classList.add("fa-search");
      } else {
        if (button.classList.toString().includes("fa-close")) {
          button.classList.remove("grey");
          button.classList.add("blue");
          icon.classList.remove("fa-close");
          icon.classList.add("fa-search");
        }
      }
      break;
    default:
      select.value = "";
      if (icon.classList.toString().includes("fa-search")) {
        input.hidden = false;
        input.focus();
        input.addEventListener("input", searchEpisodes);
        icon.classList.remove("fa-search");
        icon.classList.add("fa-close");
        button.classList.remove("blue");
        button.classList.add("grey");
      } else {
        input.removeEventListener("input", searchEpisodes);
        icon.classList.remove("fa-close");
        icon.classList.add("fa-search");
        button.classList.remove("grey");
        button.classList.add("blue");
        input.hidden = true;
      }
      displayedEpisodes.forEach((episode) => {
        if (episode.style.display === "none") {
          episode.style.display = "initial";
        } 
      });
      updateDisplayInfo();
      break;
  }
}
