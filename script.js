
function setup() {
  const allShows = getAllShows();
  makePageForShows(allShows);
}

window.onload = setup;