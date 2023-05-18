

class CircularBuffer2D {
    constructor(capacity) {
        this.buffer = new Array(capacity);
        this.capacity = capacity;
        this.start = 0;
        this.end = 0;
        this.size = 0;
        this.cachedArray = [];
        this.cacheInvalidated = false;
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
        this.cacheInvalidated = true; // Add this line
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
        if (this.cachedArray && !this.cacheInvalidated) {
            return this.cachedArray;
        }

        if (this.start < this.end) {
            this.cachedArray = this.buffer.slice(this.start, this.end);
        } 
        else if (this.start > this.end) {
            this.cachedArray = [...this.buffer.slice(this.start), ...this.buffer.slice(0, this.end)];
        } 
        else {
            this.cachedArray = [];
        }

        this.cacheInvalidated = false;
        return this.cachedArray;
    }
}

export default CircularBuffer2D
