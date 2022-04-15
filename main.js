class Queue {
  #elements = {};
  #back = 0;
  #front = 0;

  enqueue(element) {
    this.#elements[this.#back] = element;
    this.#back++;
  }

  dequeue() {
    if (this.#front > this.#back) {
      throw new Error("you can't dequeue empty queue");
    }
    const frontElement = this.#elements[this.#front];
    delete this.#elements[this.#front];
    this.#front++;
    return frontElement;
  }

  get length() {
    return this.#back - this.#front;
  }
}

function randInt(n) {
  return Math.floor(Math.random() * n);
}

async function wait(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), milliseconds);
  });
}

class Table {
  #cells;
  #height;
  #width;
  #root;
  #start;
  #end;

  constructor(height, width, root) {
    this.#height = height;
    this.#width = width;
    this.#root = root;
    this.#cells = null;
  }

  draw() {
    const table = document.createElement("div");
    table.style.width = `${this.#width * 20}px`;
    table.style.height = `${this.#height * 20}px`;
    table.classList.add("table");

    this.#cells = [];

    for (let h = 0; h < this.#height; h++) {
      const horizontalCells = [];
      for (let w = 0; w < this.#width; w++) {
        const element = document.createElement("div");
        element.classList.add("cell");
        horizontalCells.push({ element, isVisited: false });
        table.appendChild(element);
      }
      this.#cells.push(horizontalCells);
    }
    this._chooseStartEnd();
    this._colorTransition(this.#start);
    this._colorTransition(this.#end);

    this.#root.appendChild(table);
  }

  async startBfs() {
    await wait(1000);

    const q = new Queue();
    q.enqueue(this.#start);

    while (q.length !== 0) {
      const [h, w] = q.dequeue();
      if (
        h < 0 ||
        h >= this.#height ||
        w < 0 ||
        w >= this.#width ||
        this.#cells[h][w].isVisited
      )
        continue;

      if (h === this.#end[0] && w === this.#end[1]) return;
      this._colorTransition([h, w]);
      this.#cells[h][w].isVisited = true;

      q.enqueue([h, w + 1]);
      q.enqueue([h + 1, w]);
      q.enqueue([h, w - 1]);
      q.enqueue([h - 1, w]);

      await wait(100 / q.length);
    }
  }

  //@TODO: should be selected by user
  _chooseStartEnd() {
    this.#start = [randInt(this.#height), randInt(this.#width)];
    this.#end = [randInt(this.#height), randInt(this.#width)];
  }

  _colorTransition([h, w]) {
    this.#cells[h][w].element.style.backgroundColor = "black";
  }
}

function main() {
  const root = document.querySelector("#root");
  const table = new Table(20, 40, root);
  table.draw();
  table.startBfs();
}

main();
