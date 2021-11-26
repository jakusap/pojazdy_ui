export const dateToJSONLocal = (date) => {
  // https://stackoverflow.com/questions/3552461/how-to-format-a-javascript-date#comment62675778_11172083
  var local = new Date(date);
  local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return local.toJSON().slice(0, 10);
};
