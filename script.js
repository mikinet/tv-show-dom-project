const allEpisodes = getAllEpisodes();
function setup() {
  // allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  // create a new <div> element to encompass all tv show episode
  const episodesDiv = document.createElement("div");
  episodesDiv.classList = "flex-section";

  rootElem.innerHTML = `Got ${episodeList.length} episode(s) (visit&nbsp;<a href="https://tvmaze.com/"
   target="_blank" style="text-decoration:none; color:darkred">TVMaze.com</a>&nbsp;for&nbsp;more)`;
  // for every episode in allEpisodes list
  allEpisodes.forEach((episode) => {
    // declare new variables and assign to each a new html element that is applicable
    const thumbnail = document.createElement("div"); // a div to display important episode information
    const h4 = document.createElement("h4"); // episode name and other important information
    const img = document.createElement("img"); // a medium-sized image representing the episode
    const summaryDiv = document.createElement("div"); // a container for episode synopsis
    const summary = episode.summary; // episode synopsis

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

    // add html elements to appropriate parent containers
    thumbnail.appendChild(h4);
    thumbnail.appendChild(img);
    thumbnail.appendChild(summaryDiv);

    episodesDiv.appendChild(thumbnail);
  });
  // finally add episodesDiv to rootElem, i.e. the parent div element
  rootElem.appendChild(episodesDiv);
}

window.onload = setup;
