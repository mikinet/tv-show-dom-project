/**
 * NOTE: This file contains supplementary code shared by both "shows page" and "episodes page"
 */

// attach event listeners to elements
function createEventListeners(pageName) {
  if (pageName === "shows") {
    document
      .getElementById("txt-search")
      .addEventListener("input", searchShows);
  } else {
    document
      .getElementById("btn-shows")
      .addEventListener("click", openShowsPage);
    document
      .getElementById("episodes")
      .addEventListener("input", selectEpisode);
    document
      .getElementById("txt-search")
      .addEventListener("input", searchEpisodes);
  }
  document.getElementById("shows").addEventListener("input", selectShow);
  document
    .getElementById("btn-search")
    .addEventListener("click", controlSearchBox);
}

// search show(s)/episode(s)
function search(keyword) {
  const allThumbnails = [...document.querySelectorAll(".thumbnail")];
  // this code below generally applies to both the "shows page" as well as "episodes page"
  for (let i = 0; i < allThumbnails.length; i++) {
    const thumbnail = allThumbnails[i];
    let result = false; // whether or not show/episode meets the criteria
    const title = thumbnail.querySelector(".title").textContent.toLowerCase(); // episode title (lowercase)
    const summary = thumbnail
      .querySelector(".summary")
      .textContent.toLowerCase(); // show/episode synopsis (lowercase)
    result = title.includes(keyword) || summary.includes(keyword);
    // show/hide the show/episode
    showHideItems(thumbnail, result);
  }
  return allThumbnails
    .filter((thumbnail) => thumbnail.style.display !== "none")
    .map((thumbnail) => thumbnail.querySelector(".title").textContent);
}
