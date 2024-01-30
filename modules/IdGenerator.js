let nextUserId = 1;

export function getNextId() {
    return nextUserId++
}

export function decreaseId() {
    nextUserId--;
}

export function setId(value) {
  nextUserId = value;
}
