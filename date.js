module.exports = getDate()

function getDate() {
  let today = new Date();
  let options = {
    day: "2-digit",
    weekday: "long",
    month: "long",
    year: "numeric"
  }
  let formatedtoday = today.toLocaleDateString("en-US", options)

  return formatedtoday;
}
