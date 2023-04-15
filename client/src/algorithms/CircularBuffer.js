

//Circular buffer class has a fixed size. When the size is reached, the oldest element is overwritten.


class CircularBuffer {
    constructor(capacity) {
        this.buffer = new Array(capacity);
        this.capacity = capacity;
        this.start = 0;
        this.end = 0;
        this.size = 0;
    }

    push(value) {
        if (this.size === this.capacity) {
            // Buffer is full, overwrite the oldest element
            this.buffer[this.start] = value;
            this.start = (this.start + 1) % this.capacity;
        } else {
            this.buffer[this.end] = value;
            this.size++;
        }
        this.end = (this.end + 1) % this.capacity;
    }

    get(index) {
        if (index < 0 || index >= this.size) {
            throw new Error('Index out of bounds');
        }
        return this.buffer[(this.start + index) % this.capacity];
    }

    getSize() {
        return this.size;
    }

    toArray() {
        if (this.start < this.end) {
            return this.buffer.slice(this.start, this.end);
        } else if (this.start > this.end) {
            return [...this.buffer.slice(this.start), ...this.buffer.slice(0, this.end)];
        } else {
            return [];
        }
    }
    
}

export default CircularBuffer;