// utility functions
// http://jsfiddle.net/are207L0/1/
export function isNullOrWhitespace(input) {
  return !input || !input.trim();
}

//https://stackoverflow.com/a/1353711/5844090
export function isValidDate(d) {
  // console.log("isValidDate() is called");
  return d instanceof Date && !isNaN(d); // protect against right click insert emoji
}

export function getTimeStamp() {
  return Math.floor(Date.now() / 1);
}
