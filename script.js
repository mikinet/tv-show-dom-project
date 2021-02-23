// initial page setup
function setup() {
  const allShows = getAllShows().map((show) => show.id);
  const firstShowId = allShows[0];
  getAllEpisodes(firstShowId);
}

function getAllEpisodes(showId) {
  const episodesLink = `https://api.tvmaze.com/shows/${showId}/episodes`;
  fetch(episodesLink)
    .then((response) => response.json())
    // on successful response
    .then((data) => {
      createInitialContent(true);
      setInitialStyling();
      populateItems("shows", "string");
      makePageForEpisodes(data);
    })
    // on failed response
    .catch(() => createInitialContent(false));
}

function makePageForEpisodes(episodesData) {
  // const rootElem = document.getElementById("root");
  const episodesList = episodesData.map((epData) => [
    epData.name,
    epData.season,
    epData.number,
  ]); // epData = fetched single episode data
  populateItems(episodesList, "array");
  populateItems(episodesData, "data");
  createEventListeners();
  // update miscellaneous info (e.g. number of episodes being displayed)
  updateDisplayInfo();
}

function createInitialContent(status) {
    const rootElem = document.getElementById("root");
  if (status === true) {
  rootElem.innerHTML = `
  <p class="source info">Content from site:&nbsp;<span id="source"><a href="https://tvmaze.com/" target="_blank" style="text-decoration:none; color:darkred">TVMaze.com</a></span></p>
  <form class="flex-form">
    <select name="shows" id="shows">
    </select>
    <select name="episodes" id="episodes">
      <option value="">All episodes</option>
    </select>
    <input type="text" id="txt-search">
    <span id="btn-search"><i class="fa fa-search"></i></span>
  </form>
  <p class="result info"><span>Displaying</span>&nbsp;<span id="quantity"></span>/<span id="total"></span>&nbsp;episode(s)</p>
  <div class="episodes">`;
  } else {
    rootElem.innerHTML = `<p class="error"><span class="red">Error!</span><br>Sorry, cannot load the requested content.<br>Please try refreshing the page.</p>`;
  }
}

window.onload = setup;

function populateItems(arg, type) {
  switch (type) {
    case "string":
      const list = document.getElementById(arg); // show selector
      if (!list.length) {
        const options = getAllShows().map((show) => [show.name, show.id]);
        for (let i in options) {
          const option = document.createElement("option");
          option.value = options[i][0];
          option.textContent = option.value;
          option.id = options[i][1];
          list.appendChild(option);
        }
      }
      break;
    case "array":
      const listArray = arg;
      const select = document.getElementById("episodes"); // the <select> element
      for (let i in listArray) {
        const option = document.createElement("option"); // an <option> element (child to "select")
        const epName = listArray[i][0]; // episode name, e.g "Winter is Coming"
        const epSeason = listArray[i][1].toString().padStart(2, "0"); // episode season, e.g. "05"
        const epNumber = listArray[i][2].toString().padStart(2, "0"); // episode number, e.g. "02"
        option.value = `${epName} - S${epSeason}E${epNumber}`;
        option.textContent = `S${epSeason}E${epNumber} - ${epName}`;
        select.appendChild(option); // add options to select
      }
      break;
    default:
      const episodeData = arg;
      const episodes = document.querySelector(".episodes"); // a div container for episode thumbnails
      for (let i in episodeData) {
        let ep = episodeData[i]; // ep = episode data
        ep = createDisplayData(ep); // update ep with synthesised episode display data
        episodes.appendChild(ep); // add episode div element
      }
      break;
  }
}
function createDisplayData(episode) {
  // declare (and assigin) variables/constants related to html elements
  const thumbnail = document.createElement("div"); // a <div> element to display important episode information
  const title = document.createElement("h4"); // episode name and other important information
  const img = document.createElement("img"); // a medium-sized image representing the episode
  const summary = document.createElement("div"); // episode summary
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
  thumbnail.appendChild(title);
  thumbnail.appendChild(img);
  thumbnail.appendChild(summary);
  return thumbnail;
}

// set initial styling
function setInitialStyling() {
  document.getElementById("episodes").style.order = 1;
  document.getElementById("txt-search").style.order = 1;
  document.getElementById("txt-search").hidden = true;
  document.getElementById("btn-search").style.order = 2;
  document.getElementById("btn-search").classList.add("blue");
}

// add event listeners
function createEventListeners() {
  document.getElementById("shows").addEventListener("input", selectShow);
  document.getElementById("episodes").addEventListener("input", selectEpisode);
  document
    .getElementById("txt-search")
    .addEventListener("input", searchEpisodes);
  document
    .getElementById("btn-search")
    .addEventListener("click", resetSearchBox);
}

// a function to update the display information at the top of the page
function updateDisplayInfo() {
  const totalEpisodes = Array.from(document.querySelectorAll(".thumbnail"));
  const removedEpisodes = totalEpisodes.filter(
    (ep) => ep.style.display === "none"
  ); // hidden episode thumbnails
  // update the value of the number episodes being displayed
  document.getElementById("quantity").textContent =
    totalEpisodes.length - removedEpisodes.length;
  // update the value of the number of total episodes available
  document.getElementById("total").textContent = totalEpisodes.length;
}

// this function resets the search input box properties
function resetSearchBox(e) {
  event.preventDefault;
  if (!e.target.id) {
    // if the event is fired by the search icon
    controlSearch(e);
    // update the number of episodes being displayed
    updateDisplayInfo();
  }
}

// a function to manage searching of episode(s), given keyword(s)
function searchEpisodes(e) {
  performEpisodeAction("search", e);
  updateDisplayInfo();
}

// a function to manage selection of a tv show from list
function selectShow(e) {
  const selectedShow = document.getElementById(e.target.id).selectedOptions[0]
    .id;
  controlSearch(e);
  getAllEpisodes(selectedShow);
}

// a function to manage selection of an episode from list
function selectEpisode(e) {
  performEpisodeAction("select", e);
  controlSearch(e);
  // update the number of episodes being displayed
  updateDisplayInfo();
}

// this function performs different actions (e.g. search episode, select episode)
function performEpisodeAction(action, event) {
  const totalEpisodes = Array.from(document.querySelectorAll(".thumbnail"));
  for (let episode of totalEpisodes) {
    let result = false; // whether or not episode meets the criteria
    if (action === "search") {
      const title = episode.querySelector(".title").textContent.toLowerCase(); // episode title (lowercase)
      const summary = episode
        .querySelector(".summary")
        .textContent.toLowerCase(); // episode synopsis (lowercase)
      const keyword = event.target.value;
      result = title.includes(keyword) || summary.includes(keyword);
    } else if (action === "select" && event.target.value !== "") {
      const title = event.target.value;
      result = episode.querySelector(".title").textContent === title;
    }
    // show/hide the episode
    showHideThumbnail(episode, result);
  }
}

// function to change the CSS display properties of an episode
function showHideThumbnail(thumbnail, bool) {
  if (bool === true) {
    if (thumbnail.style.display === "none") {
      thumbnail.style.display = "initial";
    }
  } else {
    thumbnail.style.display = "none";
  }
}

// control the episode search function
function controlSearch(event) {
  const el = event.target; // form element the event was fired
  const button = document.getElementById("btn-search");
  const icon = button.querySelector(".fa");
  const input = document.getElementById("txt-search");
  const showSelector = document.getElementById("shows");
  const episodeSelector = document.getElementById("episodes");
  
  switch (el) {
    case showSelector:
      const options = document.querySelectorAll("#episodes option");
      for (let i of options) {
        options.item(i).remove;
      }
      if (input.value !== "") {
        input.value = "";
        changeButtonStyle("search");
      }
      break;
    case episodeSelector:
      if (episodeSelector.value !== "") {
        input.value = "";
        input.hidden = true;
      }
      changeButtonStyle("search");
      break;
    default:
      // = button
      const totalEpisodes = Array.from(document.querySelectorAll(".thumbnail"));
      if (episodeSelector.value !== "" || input.value !== "") {
        totalEpisodes.forEach((episode) => showHideThumbnail(episode, true));
        document.getElementById("episodes").value = "";
        input.value = "";
      }
      if (icon.classList.toString().includes("fa-search")) {
        input.hidden = false;
        input.focus();
        changeButtonStyle("close");
      } else {
        changeButtonStyle("search");
        input.hidden = true;
      }
      break;
  }
}

// change the search control button styles
function changeButtonStyle(style) {
  const button = document.getElementById("btn-search");
  const icon = button.querySelector(".fa");
  if (style === "search") {
    // change button to enable searching
    icon.classList.remove("fa-close");
    icon.classList.add("fa-search");
    button.classList.remove("grey");
    button.classList.add("blue");
  } else {
    // change button to enable canceling a search
    icon.classList.remove("fa-search");
    icon.classList.add("fa-close");
    button.classList.remove("blue");
    button.classList.add("grey");
  }
}
