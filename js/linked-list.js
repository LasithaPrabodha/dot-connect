class Node {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.next = null;
  }
}

export default class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  append(row, col) {
    const newNode = new Node(row, col);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.length++;
  }

  remove(row, col) {
    if (!this.head) return;

    let current = this.head;
    let prev = null;

    while (current) {
      if (current.row === row && current.col === col) {
        if (prev) {
          prev.next = current.next;
          if (!current.next) {
            this.tail = prev;
          }
        } else {
          this.head = current.next;
          if (!current.next) {
            this.tail = null;
          }
        }
        this.length--;
        break;
      }
      prev = current;
      current = current.next;
    }
  }

  contains(row, col) {
    let current = this.head;
    while (current !== null) {
      if (current.row === row && current.col === col) {
        return true;
      }
      current = current.next;
    }
    return false;
  }
}
