/**
 * NOTE: This file contains supplementary code shared by both "shows page" and "episodes page"
 */

// this function is called when a user selects a show from shows dropdown list (shows or episodes page)
// or when user clicks on the title of a show from the shows display (shows page)
function getAllEpisodes(showId, showsList) {
  const episodesLink = `https://api.tvmaze.com/shows/${showId}/episodes`;
  fetch(episodesLink)
    .then((response) => response.json())
    // on successful response
    .then((data) => makePageForEpisodes(data, showsList, showId))
    // on failed response
    // .catch(() => createInitialContent("error"));
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

// this event handler enables user navigation back to "shows" page
const openShowsPage = function () {
  createShowsPage();
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
  const keyword = event.target.value.toLowerCase();
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
