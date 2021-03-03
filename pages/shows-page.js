/**
 * NOTE: This file contains code related only to the "shows" page
 */

 // missing image placeholder
const no_img_link_s =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/488px-No-Image-Placeholder.svg.png";
const initialShowsPageContent = `
  <p class="source info">Content from site:&nbsp;<span id="source"><a href="https://tvmaze.com/" target="_blank" style="text-decoration:none; color:darkred">TVMaze.com</a></span></p>
  <div class="shows flex-form" action="">
    <select name="shows" id="shows">
      <option value="">All shows</option>
    </select>
    <input type="text" id="txt-search">
    <span id="btn-search"><i class="fa fa-search"></i></span>
  </div>
  <p class="result info"><span>Displaying</span>&nbsp;<span id="quantity"></span>/<span id="total"></span>&nbsp;shows(s)</p>
  <div class="all-shows"></div>`;

function makePageForShows(showsData) {
  showsData = extractShowsData(showsData);
  //create shows content that is going to be desplayed on the page
  const showsPageContent = createShowsContent(showsData);
  // create default initial page content
  createInitialContent("shows");
  // add previously created page contents onto the page for display
  appendShowsItems(showsPageContent);
  // creat event listeners for applicable page components
  createEventListeners("shows");
  // set initial styling for some of the page components
  setInitialStyling("shows");
  // finally, update the information about the number of shows that are on display
  updateDisplayInfo();
}

// this function extracts shows-related data fetched from shows.js
function extractShowsData(data) {
  data = data.map((obj) => ({
    name: obj.name,
    id: obj.id,
    img: obj.image ? obj.image.medium : no_img_link_s,
    summary: obj.summary ? obj.summary : "No Summary Available",
    extra: {
      genres: obj.genres ? obj.genres : "Not Available",
      status: obj.status ? obj.status : "Not Available",
      rating: obj.rating ? obj.rating.average : "Not Available",
      runtime: obj.runtime ? obj.runtime : "Not Available",
    },
  }));
  return data;
}

function createShowsContent(data) {
  // shows page content, including show options list and display content
  const contents = data.map((obj) => {
    // create applicable html elements
    const thumbnail = document.createElement("div");
    const option = document.createElement("option");
    const title = document.createElement("h4");
    const img = document.createElement("img");
    const summary = document.createElement("div");
    const extraDiv = document.createElement("div");
    const extra = document.createElement("ul");

    // assign applicable values to html elements
    option.innerHTML = option.value = obj.name;
    option.id = title.id = obj.id;
    title.innerHTML = obj.name;
    title.addEventListener("click", selectShow);
    img.src = obj.img;
    summary.innerHTML = obj.summary;
    for (let key in obj.extra) {
      const li = document.createElement("li");
      if (obj.extra[key] && key === "genres") {
        if (obj.extra[key].length > 0) {
          obj.extra[key] = obj.extra[key].join(" |");
        } else {
          obj.extra[key] = "Not Available";
        }
      }
      li.innerHTML = `<span class="bold">${key[0].toUpperCase()}${key.substring(
        1
      )}:</span>&nbsp;${obj.extra[key]}`;
      extra.appendChild(li);
    }
    // add created html elements to their respective parent elements
    extraDiv.appendChild(extra);
    thumbnail.appendChild(title);
    thumbnail.appendChild(img);
    thumbnail.appendChild(summary);
    thumbnail.appendChild(extraDiv);
    // return created major entities in the form of an object
    return { option, thumbnail };
  });
  // send all created page contents back to calling code
  return contents;
}

// insert the created contents into their corresponding display areas
function appendShowsItems(data) {
  const showSelector = document.querySelector("#shows");
  const contentDiv = document.querySelector(".all-shows");
  for (item of data) {
    showSelector.appendChild(item.option);
    contentDiv.appendChild(item.thumbnail);
  }
}

// a function to manage selection of a tv show from list
function selectShow(e) {
  const id = e.target.id;
  let selectedShow; //= e.target.id; // id of the element responsible for firing the event
  let showsList = [...document.getElementById("shows").children]; // list of show selector options
  showsList = showsList.splice(1); // remove the "All shows" option from the list; it's not required.
  // if action is triggered by selecting an option from the show selector
  if (id === "shows") {
    selectedShow = document.getElementById(id).selectedOptions[0].id;
  }
  // if action is triggered by clicking on the title of a show thumbnail
  else {
    selectedShow = id;
  }
  getAllEpisodes(selectedShow, showsList);
}

// this function performs different actions (e.g. search show, select show)
function searchShows(event) {
  const keyword = event.target.value;
  const currentList = search(keyword);
  updateSelector(currentList, "shows");
  updateDisplayInfo();
}
