let nextUserId = 1;

function getNextUserId() {
    return nextUserId++
}

function decrementUserId() {
    nextUserId--;
}

function resetUserId() {
  nextUserId = 1;
}

module.exports = {
  getNextUserId,
  decrementUserId,
  resetUserId
}
