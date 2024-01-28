let nextUserId = 1;

export function getNextId() {
    return nextUserId++
}

export function decreaseId() {
    nextUserId--;
}

export function resetId() {
  nextUserId = 1;
}
