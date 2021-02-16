let displayedEpisodes = []; // episodes that are being displayed on the site page
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  // create a new <div> element to encompass all tv show episodes
  const episodesDiv = document.createElement("div");
  episodesDiv.classList = "flex episodes";

  rootElem.innerHTML = `
    <select name="episodes" id="episodes">
      <option value="">Select an episode...</option>
    </select>
    <input type="text" id="search" placeholder="Search...">
    <span>Displaying</span>&nbsp;<span id="quantity"></span><span id="total">/${episodeList.length}&nbsp;episode(s)</span>
    <span>(visit&nbsp;<a href="https://tvmaze.com/" target="_blank" style="text-decoration:none; color:darkred">TVMaze.com</a>&nbsp;for&nbsp;more)</span>
  `;

  // declare a constant representing the <select> element in rootElem
  const select = document.getElementById("episodes");
  // for every episode in episodeList...
  episodeList.forEach((episode) => {
    // declare (and assigin) variables/constants related to html elements
    const thumbnail = document.createElement("div"); // a <div> element to display important episode information
    const title = document.createElement("h4"); // episode name and other important information
    const img = document.createElement("img"); // a medium-sized image representing the episode
    const summaryDiv = document.createElement("div"); // a container for episode synopsis
    const option = document.createElement("option"); // an <option> element (child to "select")
    // other constants
    const summary = episode.summary; // episode synopsis
    const epName = episode.name; // episode name, e.g "Winter is Coming"
    const epSeason = episode.season.toString().padStart(2, "0"); // episode season, e.g. "05"
    const epNumber = episode.number.toString().padStart(2, "0"); // episode number, e.g. "02"
    const epUrl = episode.url; // TVMaze link for episode

    // add attribute and content information to html elments
    thumbnail.classList = "flex thumbnail";
    title.classList = "episode-title";
    title.innerHTML = `<a href=${epUrl} target="_blank" style="text-decoration:none; color:darkred">${epName} - S${epSeason}E${epNumber}</a>`;
    img.src = episode.image.medium;
    summaryDiv.classList = "summary";
    summaryDiv.innerHTML = summary;
    option.value = `${epName} - S${epSeason}E${epNumber}`;
    option.textContent = `S${epSeason}E${epNumber} - ${epName}`;
    // add html elements to appropriate parent containers
    select.appendChild(option);
    thumbnail.appendChild(title);
    thumbnail.appendChild(img);
    thumbnail.appendChild(summaryDiv);
    episodesDiv.appendChild(thumbnail);

    // add thumbnail to displayedEpisodes
    displayedEpisodes.push(thumbnail);
  });
  // finally add episodesDiv to rootElem, i.e. the parent div element
  rootElem.appendChild(episodesDiv);
  // now indicate how many episodes are being displayed
  document.getElementById("quantity").textContent = displayedEpisodes.length;
  // add event listeners to the search and select input boxes
  document.getElementById("search").addEventListener("input", searchEpisodes);
  document.getElementById("episodes").addEventListener("input", selectEpisode);
}

window.onload = setup;

function searchEpisodes(e) {
  const keyword = e.target.value.toLowerCase(); // search keyword
  // manage the <select> input element
  if (keyword !== "") {
    document.getElementById("episodes").value = "";
  }
  // for every episode in displayedEpisodes...
  displayedEpisodes.forEach((episode) => {
    const title = episode.querySelector("h4").textContent.toLowerCase(); // episode title
    const summary = episode.querySelector("div").textContent.toLowerCase(); // episode synopsis
    // show/hide episode thumbnails
    if (!(title.includes(keyword) || summary.includes(keyword))) {
      episode.classList.add("none");
    } else {
      if (episode.classList.toString().includes("none")) {
        episode.classList.remove("none");
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
    // manage the search text input element
    document.getElementById("search").value = "";
    // for every episode in displayedEpisodes..
    displayedEpisodes.forEach((episode) => {
      // show/hide episode thumbnails
      if (episodeToDisplay !== episode.querySelector("h4").textContent) {
        episode.classList.add("none");
      } else {
        if (episode.classList.toString().includes("none")) {
          episode.classList.remove("none");
        }
      }
    });
  } else {
    displayedEpisodes.forEach((episode) => {
      if (episode.classList.toString().includes("none")) {
        episode.classList.remove("none");
      }
    });
  }
  // update info about how many episodes are being displayed
  updateDisplayInfo();
}

// a function to update the display information at the top of the page
function updateDisplayInfo(keyword) {
  const removedEpisodes = document.querySelectorAll(".episodes .none"); // hidden episode thumbnails
  document.getElementById("quantity").textContent =
    displayedEpisodes.length - removedEpisodes.length;
}
