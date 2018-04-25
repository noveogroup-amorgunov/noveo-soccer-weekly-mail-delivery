const assert = require('assert');

describe('Ping', () => {
    it('should return ping', () => {
        const actual = { ping: true };
        const expected = { ping: true };

        assert.deepEqual(actual, expected);
    });
});
