var expect = require('expect');

var { generateMessage } = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', () => {
        var res = generateMessage('Server', 'Client');
        expect(res).toInclude({
            from: 'Server',
            text: 'Client'
        });
        expect(res.createdAt).toBeA('number');
    });
});