// create some initial stage static page html content
function createInitialContent(type) {
  const rootElem = document.getElementById("root");
  if (type === "shows") {
    rootElem.innerHTML = initialShowsPageContent;
  } else if (type === "episodes") {
    rootElem.innerHTML = initialEpisodesContent;
  } else {
    rootElem.innerHTML = errorContent;
  }
}

// set initial styling to some page components
function setInitialStyling(pageName) {
  const contentDiv = document.querySelector(`.all-${pageName}`);
  const thumbnails = contentDiv.childNodes;
  document.getElementById("txt-search").style.order = 1;
  document.getElementById("txt-search").hidden = true;
  document.getElementById("btn-search").style.order = 2;
  document.getElementById("btn-search").classList.add("blue");

  thumbnails.forEach((thumbnail) => {
    thumbnail.querySelector("div:first-of-type").classList = "summary";
    if (pageName === "shows") {
      thumbnail.classList = "show thumbnail";
      thumbnail.querySelector("h4").classList = "title show-title link";
    } else {
      thumbnail.classList = "episode thumbnail";
      thumbnail.querySelector("h4").classList = "title episode-title";
    }
  });
}

// this function changes the search input box properties
function controlSearchBox(event) {
  const icon = event.target;
  const selector = document.querySelector("select:last-of-type");
  const allOptions = [...document.querySelectorAll("option")];
  const allThumbnails = [...document.querySelectorAll(".thumbnail")];
  const input = document.getElementById("txt-search");

  input.value = "";

  if (icon.classList.toString().includes("fa-search")) {
    input.hidden = false;
    input.focus();
    changeButtonStyle("close");
  } else {
    input.hidden = true;
    changeButtonStyle("search");
  }
  allThumbnails.forEach((thumbnail) => showHideItems(thumbnail, true));
  allOptions.forEach((option) => showHideItems(option, true));
  updateSelector(allOptions, selector.id);
  updateDisplayInfo();
}

// a function to update the display information at the top of the page
function updateDisplayInfo() {
  const totalThumbnails = [...document.querySelectorAll(".thumbnail")];
  const removedThumbnails = totalThumbnails.filter(
    (thumbnail) => thumbnail.style.display === "none"
  ); // hidden shows/episode thumbnails
  // update the value of the number shows/episodes being displayed
  document.getElementById("quantity").textContent =
    totalThumbnails.length - removedThumbnails.length;
  // update the value of the number of total shows/episodes available
  document.getElementById("total").textContent = totalThumbnails.length;
}

// function to change the CSS display properties of a show/an episode thumbnail
function showHideItems(thumbnail, bool) {
  if (bool === true && thumbnail.style.display === "none") {
    thumbnail.style.display = "grid";
  }
  if (bool === false) {
    thumbnail.style.display = "none";
  }
}

// // change the search control button styles
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

function updateSelector(availableOptions, selectorId) {
  // * availableOptions = list of options that correspond to shows/episodes that are on display
  const selector = document.getElementById(selectorId);

  if (selector[0].value === "") {
    selector[0].remove();
  }
  const allOptions = [...selector.children]; // list of all the show/episode options in selector
  if (availableOptions.length < allOptions.length) {
    // get the option from selector that gets displayed in the selector box
    const currentOption = allOptions.find(
      (option) => option.value === availableOptions[0]
    );
    // show/hide options depending on search input
    allOptions.forEach((option) => {
      // if an option in allOptions is included in availableOptions...
      if (availableOptions.find((text) => text === option.value)) {
        // ...make sure it still shows in the selector
        showHideItems(option, true); // unhide option
      } else {
        // otherwise hide the option from view
        showHideItems(option, false); // hide option
      }
    });
    // update what show/episode title the user sees displayed in the selector
    selector.selectedIndex = allOptions.indexOf(currentOption);
  } else {
    if (selector.children.item(0).value !== "") {
      const option = document.createElement("option");
      option.textContent = `All ${selectorId}`;
      option.value = "";
      selector.prepend(option);
    }
    selector.selectedIndex = 0;
  }
}