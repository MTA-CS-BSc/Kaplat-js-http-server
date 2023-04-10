let nextUserId = 1;

function getNextUserId() {
    return nextUserId++
}

function decrementUserId() {
    nextUserId--;
}

module.exports = {
  getNextUserId,
  decrementUserId
}
