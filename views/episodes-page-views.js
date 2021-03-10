/**
 * NOTE: This file contains code related only to the "episodes" page
 */

// missing image placeholder
const no_img_link_e =
  "http://smithssanitationsupply.ca/wp-content/uploads/2018/06/noimage-1.png";

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
