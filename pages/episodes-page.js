/**
 * NOTE: This file contains code related only to the "episodes" page
 */

// missing image placeholder
const no_img_link_e =
  "http://smithssanitationsupply.ca/wp-content/uploads/2018/06/noimage-1.png";

// this function is called when a user selects a show from shows dropdown list (shows or episodes page)
// or when user clicks on the title of a show from the shows display (shows page)
function getAllEpisodes(showId, showsList) {
  const episodesLink = `https://api.tvmaze.com/shows/${showId}/episodes`;
  fetch(episodesLink)
    .then((response) => response.json())
    // on successful response
    .then((data) => makePageForEpisodes(data, showsList, showId))
    // on failed response
    .catch(() => createInitialContent("error"));
}

function makePageForEpisodes(episodesData, showsList, showId) {
  episodesData = extractEpisodesData(episodesData);
  //create episodes content that is going to be desplayed on the page
  const episodesPageContent = createEpisodesContent(episodesData);
  // create default initial page content
  createInitialContent("episodes");
  // add previously created page contents onto the page for display
  appendEpisodesItems(episodesPageContent, showsList, showId);
  // creat event listeners for applicable page components
  createEventListeners("episodes");
  // set initial styling for some of the page components
  setInitialStyling("episodes");
  // finally, update the information about the number of episodes that are on display
  updateDisplayInfo();
}

const initialEpisodesContent = `
  <p class="source info">Content from site:&nbsp;<span id="source"><a href="https://tvmaze.com/" target="_blank" class="link">TVMaze.com</a></span></p>
  <div class="episodes flex-form" action="">
    <button id="btn-shows" class="link">Back to<br>Shows</button>
    <select name="shows" id="shows">
    </select>
    <select name="episodes" id="episodes">
      <option value="">All episodes</option>
    </select>
    <input type="text" id="txt-search">
    <span id="btn-search"><i class="fa fa-search"></i></span>
  </div>
  <p class="result info"><span>Displaying</span>&nbsp;<span id="quantity"></span>/<span id="total"></span>&nbsp;episode(s)</p>
  <div class="all-episodes">`;

const errorContent = `<p class="error"><span class="red">Error!</span><br>Sorry, cannot load the requested content.<br>Please try refreshing the page.</p>`;

// this function extracts shows-related data fetched via a given show's api
function extractEpisodesData(data) {
  data = data.map((obj) => ({
    name: obj.name,
    season: obj.season ? obj.season : "",
    number: obj.number ? obj.number : "",
    url: obj.url ? obj.url : "",
    img: obj.image ? obj.image.medium : no_img_link_e,
    summary: obj.summary ? obj.summary : "No Summary Available",
  }));

  return data;
}

function createEpisodesContent(data) {
  const contents = data.map((obj) => {
    const option = document.createElement("option");
    const thumbnail = document.createElement("div");
    const title = document.createElement("h4");
    const img = document.createElement("img");
    const summary = document.createElement("div");
    const epName = obj.name; // episode name, e.g "Winter is Coming"
    const epSeason = obj.season.toString().padStart(2, "0"); // episode season, e.g. "05"
    const epNumber = obj.number.toString().padStart(2, "0"); // episode number, e.g. "02"
    const epUrl = obj.url;
    option.value = `${epName} - S${epSeason}E${epNumber}`;
    option.textContent = `S${epSeason}E${epNumber} - ${epName}`;
    title.innerHTML = `<a href="${epUrl}" target="_blank" class="link episode-link">${epName} - S${epSeason}E${epNumber}</a>`;
    title.classList = "title episode-title";
    img.src = obj.img;
    summary.innerHTML = obj.summary;
    thumbnail.appendChild(title);
    thumbnail.appendChild(img);
    thumbnail.appendChild(summary);
    return { option, thumbnail };
  });
  return contents;
}

function appendEpisodesItems(data, showsList, showId) {
  const selector1 = document.querySelector("#shows");
  const selector2 = document.querySelector("#episodes");
  const contentDiv = document.querySelector(".all-episodes");
  let index; // index of the selected show title in the showsList
  for (item of showsList) {
    selector1.appendChild(item);
    if (item.id === showId) {
      index = showsList.indexOf(item);
    }
  }
  for (item of data) {
    selector2.appendChild(item.option);
    contentDiv.appendChild(item.thumbnail);
  }
  // display the selected show title in the show selector
  selector1.selectedIndex = index;
  // make sure to scroll the page the top
  window.scroll(0, 0);
}

// this event handler enables user navigation back to "shows" page
const openShowsPage = function () {
  const allShows = getAllShows();
  makePageForShows(allShows);
};

// // a function to manage selection of an episode from list
function selectEpisode(event) {
  const title = event.target.value;
  const allThumbnails = document.querySelectorAll(".thumbnail"); // all episode thumbnails
  const input = document.getElementById("txt-search"); // search input box
  // if an episode is selected
  if (title !== "") {
    // reset the search input box
    input.value = "";
    input.hidden = true;
    // hide all thumbnails, except the one selected by user
    for (const thumbnail of allThumbnails) {
      const result = thumbnail.querySelector(".title").textContent === title;
      showHideItems(thumbnail, result);
    }
  } else {
    for (const thumbnail of allThumbnails) {
      // show all thumbnails
      showHideItems(thumbnail, true);
    }
  }
  changeButtonStyle("search");
  updateDisplayInfo();
}

function searchEpisodes(event) {
  const keyword = event.target.value;
  const currentList = search(keyword);
  updateSelector(currentList, "episodes");
  updateDisplayInfo();
}

// this function performs different actions (e.g. search episode, select episode)
function performAction(event) {
  const allThumbnails = [...document.querySelectorAll(".thumbnail")]; // all episode thumbnails
  for (let i = 0; i < allThumbnails.length; i++) {
    const thumbnail = allThumbnails[i];
    if (event.target.value !== "") {
      const title = event.target.value;
      const result = thumbnail.querySelector(".title").textContent === title;
      // show/hide the show/episode
      showHideItems(thumbnail, result);
    }
  }
}
