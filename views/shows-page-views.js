/** GLOBAL VARIABLES AND CONSTANTS **/

// PAGE NAVIGATORS
const pageNavigators = {
  skipLeft: `<span id="skip-pages-bwd" class="navigator-link link" onclick="skipPagesBackward()">&#171;</span>`,
  skipRight: `<span id="skip-pages-fwd" class="link navigator-link" onclick="skipPagesForward()">&#187;</span>`,
  prevPage: `<span id="prev-page" class="link navigator-link" onclick="openPrevPage()">&#8249;</span>`,
  nextPage: `<span id="next-page" class="link navigator-link" onclick="openNextPage()">&#8250;</span>`,
};
const leftNavigators = [pageNavigators.skipLeft, pageNavigators.prevPage];
const rightNavigators = [pageNavigators.nextPage, pageNavigators.skipRight];
// COUNTERS
let counter = 0; // temporarily stores the number of http requests made when creating direct page navigators
let totalPages = 0; // registers the value of the highest direct page navigator on display
let firstPage = null; // registers the first (left most) page on display
let lastPage = null; // registers the last (right most) page that is selected (is on display)
let activePage = null; // registers the current shows page that is selected (is on display)
let startingPage = 1; // the page number where pagination starts when creating page navigators
const pageOne = 1;
// OTHERS
const maxPagesToCreate = 10; // maximum allowable number of direct page links
const no_img_link_s =
  // placeholder for missing show image
  `https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/488px-No-Image-Placeholder.svg.png`;

// initial page html content to be displayed before rendering the fetched shows data
const initialShowsPageContent = `
  <p class="source info">Content from site:&nbsp;<span id="source"><a href="https://tvmaze.com/" target="_blank" style="text-decoration:none; color:darkred">TVMaze.com</a></span></p>
  <div class="shows flex-form" action="">
    <select name="shows" id="shows">
      <option value="">All shows</option>
    </select>
    <input type="text" id="txt-search">
    <span id="btn-search"><i class="fa fa-search"></i></span>
  </div>
  <div id="navigator" class="navigator shows-page-navigator"></div>
  <p class="result info"><span>Displaying</span>&nbsp;<span id="quantity"></span>/<span id="total"></span>&nbsp;shows(s)</p>
  <div class="all-shows"></div>`;

/**** FUNCTION DEFINITIONS ****/
// this function creates html content that enables user to navigate through shows pages
function createPagesNavigator(numPages) {
  const navigator = document.querySelector("#navigator"); // the navigators container
  let pagination = ``; // pagination container
  // create pagination (direct page access "links")
  for (let i = 0; i < numPages; i++) {
    const pageNum = startingPage + i;
    const span = `<span id=page-${pageNum} class="link page-link" onclick="openPage(${pageNum})">${pageNum}</span>`;
    pagination += span;
  }
  if (activePage) {
    // if the active page number value is greater than 1
    navigator.innerHTML += leftNavigators[0]; // add the "<<" page navigator and...
    navigator.innerHTML += leftNavigators[1]; // ...the "<" page navigator
  }
  navigator.innerHTML += pagination;
  navigator.innerHTML += rightNavigators[0]; // add the ">" page navigator
  if (numPages === maxPagesToCreate) {
    // if numPages is more equal to amount set by "maxPagesToCreate", it means it is determined that...
    // there is at least one more show page that can be fetched from TVMaze.com
    navigator.innerHTML += rightNavigators[1]; // ...the ">>" page navigator and...
  }

  updatePageTrackers(); // update the values of activePage, firstPage and lastPage variables
}

// this function removes unnecessary navigators, or resets the navigators container <div> element
function removeNavigators(which) {
  const navigator = document.querySelector("#navigator");
  switch (which) {
    case "L":
      navigator.firstElementChild.remove(); // ...remove the "<<" page navigator and...
      navigator.firstElementChild.remove(); // ...the "<" page navigator
      break;
    case "R":
      navigator.lastElementChild.remove(); // ...remove the ">>" page navigator and...
      navigator.lastElementChild.remove(); // ...the ">" page navigator
      break;
    default:
      if (navigator.innerHTML != "") {
        navigator.innerHTML = "";
      }
      break;
  }
}

// this function clears the page before loading new shows inforation
function clearPage() {
  const allThumbnails = [...document.querySelector(".all-shows").children];
  const showsList = [...document.querySelector("#shows").children];
  if (allThumbnails) {
    allThumbnails.forEach((thumbnail) => thumbnail.remove());
  }
  if (showsList) {
    showsList.forEach((option) => option.remove);
  }
}

// this function creates shows page contents
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
      // create a formatted html content for li
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
