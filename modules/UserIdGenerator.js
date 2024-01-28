let nextUserId = 1;

export function getNextUserId() {
    return nextUserId++
}

export function decrementUserId() {
    nextUserId--;
}

export function resetUserId() {
  nextUserId = 1;
}
