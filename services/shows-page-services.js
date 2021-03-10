/**** FUNCTION DEFINITIONS ****/

// CREATE A WHOLE NEW PAGE. THIS CODE RUNS DURING INITIAL PAGE SETUP
async function createShowsPage() {
  const showData = await getShowsPageData();
  if (showData[0]) {
    createInitialContent("shows");
    const numPages = await checkForMorePages();
    if (numPages > 1) {
      createPagesNavigator(numPages);
    }
    makePageForShows(showData);
  }
}

// ATTEMPT TO GET SHOWS DATA FOR A CHOSEN TVMaze.com API ENDPOINT
function getShowsPageData(pageNum = 1) {
  const currentUrl = `${showsApiFormat}${pageNum}`; // determine the TVMaze shows api endpoint
  return fetch(currentUrl).then((response) =>
    response.json().then((data) => data)
  );
}

// CHECK PAGES AVIALABILITY IN ORDER TO DETERMINE THE NUMBER OF PAGE "LINKS" TO BE CREATED FOR NAVIGATION
async function checkForMorePages(pageNum = 1) {
  const nextPage = pageNum + 1;
  const numPages = counter;
  const status = await checkStatus(nextPage);
  if (status === "OK" && numPages < maxPagesToCreate) {
    // if status is OK and the maxPagesToCreate limit has not been exceeded
    counter++; // update counter
    totalPages++;
    return checkForMorePages(nextPage); // check one more page
  }
  counter = 0;
  return numPages;
}

// A FUNCTION TO CHECK THE STATUS OF AN HTTP REQUEST FOR AVAILABILITY OF USABLE JSON DATA
function checkStatus(pageNum) {
  const currentUrl = `${showsApiFormat}${pageNum}`; // determine the TVMaze shows api endpoint
  return fetch(currentUrl)
    .then((response) => response.json())
    .then(([data]) => {
      if (!data) {
        // if there was no usable json data fetched (or last shows page on the TVMaze.com site was reached)...
        // ...report a "FAIL" status to the calling code
        return "FAIL";
      }
      // if the request returned usable json data, report an "OK" status to the calling code
      return "OK";
    });
}

// THIS FUNCTION RUNS DURING INITIAL SHOWS PAGE CREATION OR WHENEVER PAGES ARE SKIPPED
function updatePageTrackers() {
  const pages = document.querySelectorAll(".page-link");
  currentPage = firstPage = pages[0];
  lastPage = pages[pages.length - 1];
}

// THIS FUNCTION IS CALLED WHEN A USER CLICKS ON A DIRECT SHOW PAGE LINK
async function openPage(pageNum) {
  const showData = await getShowsPageData(pageNum);
  if (showData) {
    const pages = document.querySelectorAll(".page-link");
    currentPage = document.getElementById(`page-${pageNum}`); // update currentPage
    firstPage = pages[0];
    lastPage = pages[pages.length - 1];
    return makePageForShows(showData); // fill the page with contents
  }
}

// this function runs every time the fetch api is called to fetch a show's page data
function makePageForShows(showsData) {
  // make page ready for new collection of shows
  clearPage();
  // function makePageForShows(showsData) {
  showsData = extractShowsData(showsData);
  //create shows content that is going to be desplayed on the page
  const showsPageContent = createShowsContent(showsData);
  // add previously created page contents onto the page for display
  appendShowsItems(showsPageContent);
  // creat event listeners for applicable page components
  createEventListeners("shows");
  // set initial styling for some of the page components
  setInitialStyling("shows");
  // finally, update the information about the number of shows that are on display
  updateDisplayInfo();
  return true;
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

// this function runs when the ">" page navigator is clicked
function openPrevPage() {
  const pageNum = getPageNumber("P"); // previous page to open
  openPage(pageNum); // open the previous page
  totalPages--;
  startingPage = parseInt(firstPage.textContent) - 1;
  removeNavigators();
  createPagesNavigator(maxPagesToCreate);
  if (currentPage === firstPage) {
    // if the very beginning of show pages is reached, remove the unnecessary page navigators
    shiftPages("R"); // shift pages to the right
  }
}
// this function runs when the ">" page navigator is clicked
function openNextPage() {
  const pageNum = getPageNumber("N"); // next page to open
  openPage(pageNum); // open the next page
  totalPages++;
  startingPage = parseInt(firstPage.textContent) + 1;
  removeNavigators();
  createPagesNavigator(maxPagesToCreate);
  if (currentPage === lastPage) {
    // if the very last of show pages is reached, remove the unnecessary page navigators
    shiftPages("L"); // shift pages to the left
  }
}

// this function runs when the "<<" page navigator is clicked. It enables skipping pages back by...
// ...maxPagesToCreate number of pages (maximum)
async function skipPagesBackward() {
  const currentPageNum = parseInt(currentPage.textContent); // what page is being displayed?
  let pageNum = currentPageNum - maxPagesToCreate; // determine the show page to fetch data for
  // update counter
  if (pageNum > 1) {
    // if that page is page-2 or any one of higher order
    startingPage = totalPages = pageNum;
  } else {
    // if skipping pages brings us back to page number 1
    pageNum = 1; // there is no page number that starts with a 0 or any negative value
    // reset relevant counters
    startingPage = 1;
    totalPages = 0;
  }
  const showData = await getShowsPageData(pageNum); // check the status of the http request for json data
  if (showData[0]) {
    removeNavigators();
    makePageForShows(showData);
    const numPages = await checkForMorePages(pageNum);
    createPagesNavigator(numPages);
  }
}

// this function runs when the ">>" page navigator is clicked. It enables skipping pages forward by...
// ...maxPagesToCreate number of pages (maximum)
async function skipPagesForward() {
  const pageNum = totalPages + 1; // value of the last page on display
  const showData = await getShowsPageData(pageNum); // check the status of the http request for json data
  startingPage = totalPages + 1; // update startingPage
  if (showData[0]) {
    removeNavigators();
    makePageForShows(showData);
    const numPages = await checkForMorePages(pageNum);
    createPagesNavigator(numPages);
  }
}

// this function returns the previous or next page number required to navigate to
function getPageNumber(which) {
  const currentPageNum = parseInt(currentPage.textContent);
  if (which === "N") {
    return currentPageNum + 1; // next page
  }
  return currentPageNum - 1; // previous page
}

// this function is called when the current page on display is on either end of the navigation display
async function shiftPages(direction) {
  const currentPageNum = parseInt(currentPage.textContent);
  // if the current page on display is the right most one...
  if (direction === "L") {
    // if shift direction is to the left and...
    const notLastPage = await checkStatus(currentPageNum + 1); // check if there is more page on TVMaze.com
    if (!notLastPage) {
      // if there is no more shows page on TVMaze.com
      removeNavigators("R"); //remove the right side navigators (">", and ">>")
    }
  }
  // if shift direction is to the right and...
  if (currentPageNum === 2) {
    // if the currentPage is page-2
    removeNavigators("L"); //remove the left side navigators ("<<", and "<")
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
  getAllEpisodes(selectedShow, showsList); // fetch all episodes data for a selected show
}

// this function performs different actions (e.g. search show, select show)
function searchShows(event) {
  const keyword = event.target.value.toLowerCase(); // get the keyword(s) entered in the search box and
  const currentList = search(keyword); // get the list of shows matching the search result
  updateSelector(currentList, "shows"); // update the shows selector options
  updateDisplayInfo(); // update the information
}