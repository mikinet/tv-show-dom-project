const allEpisodes = getAllEpisodes();
function setup() {
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  // create a new <div> element to encompass all tv show episode
  const episodesDiv = document.createElement("div");
  episodesDiv.classList = "flex-section";

  rootElem.innerHTML = `<select name="episodes" id="select"><option value="">Select an 
  episode...</option></select> <input type="text" id="search" placeholder="Search..."> Showing&nbsp;
  <span id="total">${episodeList.length}/${episodeList.length}</span>&nbsp;episode(s) <span>(visit&nbsp;
    <a href="https://tvmaze.com/" target="_blank" style="text-decoration:none; color:darkred">
      TVMaze.com
    </a>&nbsp;for&nbsp;more)</span>`;

  const select = document.getElementById("select");
  // for every episode in allEpisodes list
  allEpisodes.forEach((episode) => {
    // declare new variables and assign to each a new html element that is applicable
    const thumbnail = document.createElement("div"); // a div to display important episode information
    const h4 = document.createElement("h4"); // episode name and other important information
    const img = document.createElement("img"); // a medium-sized image representing the episode
    const summaryDiv = document.createElement("div"); // a container for episode synopsis
    const summary = episode.summary; // episode synopsis
    const option = document.createElement("option");
    // add attribute and content information to html elments
    thumbnail.classList = "flex-div";
    h4.classList = "episode-title";
    h4.innerHTML = `<a href=${
      episode.url
    } target="_blank" style="text-decoration:none; color:darkred">${
      episode.name
    } - S${episode.season
      .toString()
      .padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}</a>`;
    img.src = episode.image.medium;
    summaryDiv.classList = "summary";
    summaryDiv.innerHTML = summary;
    option.value = `${episode.name} - S${episode.season
      .toString()
      .padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`;
    option.textContent = `S${episode.season
      .toString()
      .padStart(2, "0")}E${episode.number.toString().padStart(2, "0")} - ${
      episode.name
    }`;
    // add html elements to appropriate parent containers
    select.appendChild(option);
    thumbnail.appendChild(h4);
    thumbnail.appendChild(img);
    thumbnail.appendChild(summaryDiv);

    episodesDiv.appendChild(thumbnail);
  });
  // finally add episodesDiv to rootElem, i.e. the parent div element
  rootElem.appendChild(episodesDiv);
  document.getElementById("search").addEventListener("input", searchEpisodes);
  document.getElementById("select").addEventListener("change", selectEpisode);
}

window.onload = setup;

function searchEpisodes(e) {
  const keyword = e.target.value.toLowerCase(); //
  const listedEpisodes = Array.from(document.querySelectorAll(".flex-div"));
  listedEpisodes.forEach((episode) => {
    const heading = episode.querySelector("h4").textContent.toLowerCase();
    const summary = episode.querySelector("div").textContent.toLowerCase();
    // if (keyword !== "") {
    if (!(heading.includes(keyword) || summary.includes(keyword))) {
      episode.classList.add("none");
    } else {
      if (episode.classList.toString().includes("none")) {
        episode.classList.remove("none");
      }
    }
    const removedEpisodes = document.querySelectorAll(".flex-section .none")
      .length;
    document.getElementById("total").textContent = `${
      listedEpisodes.length - removedEpisodes
    }/${listedEpisodes.length}`;
  });
}

// show only a selected episode
function selectEpisode(e) {
  const episodeToDisplay = e.target.value;
  const listedEpisodes = Array.from(document.querySelectorAll(".flex-div"));
  if (episodeToDisplay !== "") {
    document.getElementById("search").disabled = true;
    document.getElementById("search").value = "";
    listedEpisodes.forEach((episode) => {
      if (episodeToDisplay !== episode.querySelector("h4").textContent) {
        episode.classList.add("none");
      } else {
        if (episode.classList.toString().includes("none")) {
          episode.classList.remove("none");
        }
      }
    });
  } else {
    document.getElementById("search").disabled = false;
    listedEpisodes.forEach((episode) => {
      if (episode.classList.toString().includes("none")) {
        episode.classList.remove("none");
      }
    });
  }
  const removedEpisodes = document.querySelectorAll(".flex-section .none")
    .length;
  document.getElementById("total").textContent = `${
    listedEpisodes.length - removedEpisodes
  }/${listedEpisodes.length}`;
}
