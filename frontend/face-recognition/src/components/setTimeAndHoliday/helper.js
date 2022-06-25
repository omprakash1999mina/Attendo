// Handling the input values and constaining them to integers
export const handleChangeDay = (event, setNewDays) => {
  const result = event.target.value.replace(/[^0-9 ,]/gi, "");
  setNewDays(result);
};
export const handleChangeDate = (event, setNewDates) => {
  const result = event.target.value.replace(/[^0-9 ,]/gi, "");
  setNewDates(result);
};

// Checking that whether the input is valid according to the constraints
export const inputChecker = (state, maxValue) => {
  const s = state.split(",");
  let d = [];
  for (let i = 0; i < s.length; i++) {
    const length = s[i].trim().length;
    if (s.length != 1) {
      if (length > 2 || length <= 0) {
        return false;
      }
    } else {
      if (length > 2) {
        return false;
      }
    }

    const value = parseInt(s[i].trim(), 10);
    if (s.length != 1) {
      if (value > maxValue || value <= 0) {
        return false;
      } else {
        d.push(value);
      }
    } else {
      if (s[i].trim().length > 0) {
        if (value > maxValue || value <= 0) {
          return false;
        }
      }
    }
  }
  return d;
};
