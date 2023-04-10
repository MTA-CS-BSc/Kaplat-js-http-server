let nextUserId = 1;

function getNextUserId() {
    return nextUserId++
}

module.exports = {
  getNextUserId
}
