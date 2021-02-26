// initial page setup
let allShows = null;
function setup() {
  allShows = getAllShows();
  makePageForShows(allShows);
}

function makePageForShows(showsData) {
  const showsList = showsData.map((sData) => [sData.name, sData.id]);
  createInitialContent("shows");
  setInitialStyling("shows");
  populateItems(showsList, "array", "shows");
  populateItems(showsData, "object", "shows");
  createEventListeners("shows");
  updateDisplayInfo();
}

function getAllEpisodes(showId) {
  const episodesLink = `https://api.tvmaze.com/shows/${showId}/episodes`;
  fetch(episodesLink)
    .then((response) => response.json())
    // on successful response
    .then((data) => {
      createInitialContent("episodes");
      setInitialStyling("episodes");
      populateItems("", "string", "shows");
      makePageForEpisodes(data);
    })
    // on failed response
    .catch(() => createInitialContent("episodes"));
}

function makePageForEpisodes(episodesData) {
  // const rootElem = document.getElementById("root");
  const episodesList = episodesData.map((epData) => [
    epData.name,
    epData.season,
    epData.number,
  ]); // epData = fetched single episode data
  populateItems(episodesList, "array", "episodes");
  populateItems(episodesData, "object", "episodes");
  createEventListeners("episodes");
  // update miscellaneous info (e.g. number of episodes being displayed)
  updateDisplayInfo();
}

function createInitialContent(type) {
  const rootElem = document.getElementById("root");
  if (type === "shows") {
    rootElem.innerHTML = `
  <p class="source info">Content from site:&nbsp;<span id="source"><a href="https://tvmaze.com/" target="_blank" style="text-decoration:none; color:darkred">TVMaze.com</a></span></p>
  <form class="shows flex-form" action="">
    <select name="shows" id="shows">
      <option value="">All shows</option>
    </select>
    <input type="text" id="txt-search">
    <span id="btn-search"><i class="fa fa-search"></i></span>
  </form>
  <p class="result info"><span>Displaying</span>&nbsp;<span id="quantity"></span>/<span id="total"></span>&nbsp;shows(s)</p>
  <div class="all-shows"></div>`;
  } else if (type === "episodes") {
    rootElem.innerHTML = `
  <p class="source info">Content from site:&nbsp;<span id="source"><a href="https://tvmaze.com/" target="_blank" style="text-decoration:none; color:darkred">TVMaze.com</a></span></p>
  <form class="episodes flex-form" action="">
    <button id="btn-shows">Back to<br>Shows</button>
    <select name="shows" id="shows">
    </select>
    <select name="episodes" id="episodes">
      <option value="">All episodes</option>
    </select>
    <input type="text" id="txt-search">
    <span id="btn-search"><i class="fa fa-search"></i></span>
  </form>
  <p class="result info"><span>Displaying</span>&nbsp;<span id="quantity"></span>/<span id="total"></span>&nbsp;episode(s)</p>
  <div class="all-episodes">`;
  } else {
    rootElem.innerHTML = `<p class="error"><span class="red">Error!</span><br>Sorry, cannot load the requested content.<br>Please try refreshing the page.</p>`;
  }
}

window.onload = setup;

function populateItems(data, type, id) {
  switch (type) {
    case "array":
      if (id === "shows") {
        const showsList = data;
        const showSelector = document.getElementById("shows"); // the <select> element
        for (let i = 0; i < showsList.length; i++) {
          const option = document.createElement("option"); // an <option> element (child to "select")
          option.value = showsList[i][0];
          option.id = showsList[i][1];
          option.textContent = option.value;
          showSelector.appendChild(option); // add options to select
        }
      } else {
        const epList = data; // episodes list
        const episodeSelector = document.getElementById("episodes"); // the <select> element
        for (let i in epList) {
          const option = document.createElement("option"); // an <option> element (child to "select")
          const epName = epList[i][0]; // episode name, e.g "Winter is Coming"
          const epSeason = epList[i][1].toString().padStart(2, "0"); // episode season, e.g. "05"
          const epNumber = epList[i][2].toString().padStart(2, "0"); // episode number, e.g. "02"
          option.value = `${epName} - S${epSeason}E${epNumber}`;
          option.textContent = `S${epSeason}E${epNumber} - ${epName}`;
          episodeSelector.appendChild(option); // add options to select
        }
      }
      break;
    case "object":
      if (id === "shows") {
        const showsData = data;
        const shows = document.querySelector(".all-shows"); // a div container for episode thumbnails
        for (let i in showsData) {
          let s = showsData[i]; // s = show data
          s = createDisplayData(s, "show"); // update s with synthesised episode display data
          shows.appendChild(s); // add episode div element
        }
      } else {
        const episodeData = data;
        const episodes = document.querySelector(".all-episodes"); // a div container for episode thumbnails
        for (let i in episodeData) {
          let ep = episodeData[i]; // ep = episode data
          ep = createDisplayData(ep, "episode"); // update ep with synthesised episode display data
          episodes.appendChild(ep); // add episode div element
        }
      }
      break;
    default:
      const list = document.getElementById("shows"); // show selector
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
  }
}
function createDisplayData(data, type) {
  // declare (and assign) variables/constants related to html elements
  const thumbnail = document.createElement("div"); // a <div> element to display important episode information
  const title = document.createElement("h4"); // episode name and other important information
  const img = document.createElement("img"); // a medium-sized image representing the episode
  const summary = document.createElement("div"); // show/episode summary
  let url;
  let name;
  if (data.url) {
    url = data.url; // TVMaze link for episode
  }
  if (data.name) {
    name = data.name; // show/episode name
  }
  if (data.image) {
    img.src = data.image.medium;
  }
  if (data.summary) {
    summary.innerHTML = data.summary;
    summary.classList = "summary";
  }
  if (type === "episode") {
    const season = data.season.toString().padStart(2, "0"); // episode season, e.g. "05"
    const number = data.number.toString().padStart(2, "0"); // episode number, e.g. "02"
    title.classList = "episode title";
    title.innerHTML = `<a href=${url} target="_blank" style="text-decoration:none; color:darkred">${name} - S${season}E${number}</a>`;
    thumbnail.appendChild(title);
    thumbnail.appendChild(img);
    thumbnail.appendChild(summary);
    thumbnail.classList = "episode thumbnail";
  } else {
    // if type ==== "show"
    const extra = document.createElement("div");
    const ul = document.createElement("ul");
    const keys = ["genres", "status", "rating", "runtime"];
    title.id = data.id;
    title.classList = "link title";
    title.addEventListener("click", selectShow);
    title.textContent = data.name;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const li = document.createElement("li");
      if (key === "rating") {
        li.innerHTML = `<span class="bold">${key[0].toUpperCase()}${key.substring(
          1
        )}:</span>&nbsp;${data[key].average}`;
      } else if (key === "genres") {
        li.innerHTML = `<span class="bold">${key[0].toUpperCase()}${key.substring(
          1
        )}:</span>`;
        for (let j = 0; j < data.genres.length; j++) {
          li.innerHTML += ` ${data[key][j]} |`;
        }
      } else {
        li.innerHTML = `<span class="bold">${key[0].toUpperCase()}${key.substring(
          1
        )}:</span>&nbsp;${data[key]}`;
      }
      ul.appendChild(li);
    }

    extra.appendChild(ul);
    thumbnail.appendChild(title);
    thumbnail.appendChild(img);
    thumbnail.appendChild(summary);
    thumbnail.appendChild(extra);
    thumbnail.classList = "show thumbnail";
  }
  return thumbnail;
}

// set initial styling
function setInitialStyling(type) {
  document.getElementById("txt-search").style.order = 1;
  document.getElementById("txt-search").hidden = true;
  document.getElementById("btn-search").style.order = 2;
  document.getElementById("btn-search").classList.add("blue");
}

// add event listeners
function createEventListeners(id) {
  if (id === "episodes") {
    document
      .getElementById("btn-shows")
      .addEventListener("click", openShowsPage);
    document
      .getElementById("episodes")
      .addEventListener("input", selectEpisode);
  }
  document.getElementById("shows").addEventListener("input", selectShow);
  document.getElementById("txt-search").addEventListener("input", search);
  document
    .getElementById("btn-search")
    .addEventListener("click", resetSearchBox);
}

// a function to update the display information at the top of the page
function updateDisplayInfo() {
  const totalThumbnails = Array.from(document.querySelectorAll(".thumbnail"));
  const removedThumbnails = totalThumbnails.filter(
    (ep) => ep.style.display === "none"
  ); // hidden shows/episode thumbnails
  // update the value of the number shows/episodes being displayed
  document.getElementById("quantity").textContent =
    totalThumbnails.length - removedThumbnails.length;
  // update the value of the number of total shows/episodes available
  document.getElementById("total").textContent = totalThumbnails.length;
}

// this event handler enables user navigation back to "shows" page
const openShowsPage = function () {
  if (allShows !== null) {
    makePageForShows(allShows);
  }
};

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
function search(e) {
  performAction("search", e);
  updateDisplayInfo();
}

// a function to manage selection of a tv show from list
function selectShow(e) {
  if (e.target.id === "shows") {
    const selectedShow = document.getElementById(e.target.id).selectedOptions[0]
      .id;
    getAllEpisodes(selectedShow);
  } else if (e.target.id === "episodes") {
    performAction("select", e);
    // update the number of episodes being displayed
    updateDisplayInfo();
  } else {
    getAllEpisodes(e.target.id);
  }
  controlSearch(e);
}

// a function to manage selection of an episode from list
function selectEpisode(e) {
  performAction("select", e);
  controlSearch(e);
  // update the number of episodes being displayed
  updateDisplayInfo();
}

// this function performs different actions (e.g. search episode, select episode)
function performAction(action, event) {
  const allThumbnails = Array.from(document.querySelectorAll(".thumbnail")); // all show/episode thumbnails
  const showSelector = document.getElementById("shows");
  const input = document.getElementById("txt-search");
  const isShowsPage = !document.getElementById("episodes"); // determine what page is being displayed
  let showsList = Array.from(showSelector.children); // a variable representing a list of shows
  let displayedShows = null; // an array that tracks and lists show thumbnails being displayed

  // remove the "All shows" option from the show selector (*applied only to the "shows page")
  if (isShowsPage && action === "search" && showSelector[0].value === "") {
    showSelector.children[0].remove();
    showsList = showsList.splice(1);
  }
  // this code below generally applies to both the "shows page" as well as "episodes page"
  for (let i = 0; i < allThumbnails.length; i++) {
    const thumbnail = allThumbnails[i];
    let result = false; // whether or not show/episode meets the criteria
    let showSelectorOption = null; // a variable (a select option) only applicable to the "shows page"
    if (action === "search") {
      if (isShowsPage) {
        showSelectorOption = showSelector[i];
      }
      const title = thumbnail.querySelector(".title").textContent.toLowerCase(); // episode title (lowercase)
      const summary = thumbnail
        .querySelector(".summary")
        .textContent.toLowerCase(); // show/episode synopsis (lowercase)
      const keyword = event.target.value;
      result = title.includes(keyword) || summary.includes(keyword);
      // show/hide the show/episode
      showHideThumbnail(thumbnail, result);
      if (isShowsPage) {
        showHideThumbnail(showSelectorOption, result);
      }
    } else {
      if (event.target.value !== "") {
        const title = event.target.value;
        result = thumbnail.querySelector(".title").textContent === title;
        // show/hide the show/episode
        showHideThumbnail(thumbnail, result);
      }
    }
  }
  // update the show selector (*applied only to the "shows page")
  if (isShowsPage) {
    if (input.value === "") {
      // recreate and insert the default option to the show selector
      const option = document.createElement("option");
      option.innerHTML = `<option value="">All shows</option>`;
      showSelector.prepend(option);
      // update selector display value
      showSelector.selectedIndex = 0;
    }
    // if the search box is not empty
    else {
      // update displayedShows as the number of thumbnails being displayed changes
      displayedShows = allThumbnails.filter(
        (show) => show.style.display !== "none"
      );
      // update selector display value (it's going to be the title of the first thumbnail displayed)
      // - but first, find out the position of the thumbnail in the whole collection, i.e. index
      for (let i = 0; i < showsList.length; i++) {
        show = showsList[i];
        // make sure there's a thumbnail being displayed, though...
        if (
          displayedShows[0] &&
          displayedShows[0].firstChild.textContent === show.value
        ) {
          // update selector display value
          showSelector.selectedIndex = i;
        }
      }
    }
  }
}

// function to change the CSS display properties of a show/an episode thumbnail
function showHideThumbnail(thumbnail, bool) {
  if (bool === true) {
    if (thumbnail.style.display === "none") {
      thumbnail.style.display = "grid";
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
  let episodeSelector;
  if (document.getElementById("episodes")) {
    episodeSelector = document.getElementById("episodes");
  }
  const showTitle = document.querySelector("h4.title");
  switch (el) {
    case showSelector:
      const options = document.querySelectorAll("#episodes option");
      for (let i of options) {
        options.item(i).remove;
      }
      break;
    case showSelector:
    case showTitle:
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
      const totalThumbnails = Array.from(
        document.querySelectorAll(".thumbnail")
      );
      if (input.value !== "") {
        input.value = "";
      }
      if (episodeSelector) {
        if (episodeSelector.value !== "") {
          document.getElementById("episodes").value = "";
          totalThumbnails.forEach((thumbnail) =>
            showHideThumbnail(thumbnail, true)
          );
          changeButtonStyle("search");
        }
      } else if (!episodeSelector && showSelector.value !== "") {
        showSelector.value = "";
        totalThumbnails.forEach((thumbnail) =>
          showHideThumbnail(thumbnail, true)
        );
        changeButtonStyle("search");
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
