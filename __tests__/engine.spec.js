describe('Engine', () => {
    let engine = require('../index');
    let answersMock = {
        type: 'chore',
        scope: 'buildspec',
        subject: 'This is a test message',
        body: '',
        isBreaking: false,
        needDeployment: true,
        isIssueAffected: true,
        issues: 'fix #Issue01'
    };

    let cz = {
        prompt: jest.fn()
    };

    beforeEach(() => {
        cz.prompt.mockReset();
    });

    test('should not add [skip-ci] to commit message head if user said no (default) to skip deployment', (done) => { 
        cz.prompt.mockReturnValue(Promise.resolve(answersMock));
        engine.prompter(cz, (commitMessage) => {
            expect(commitMessage).toMatchSnapshot();
            expect(/\[skip-ci\]/g.test(commitMessage)).toBeFalsy();
            done();
        });
    });

    test('should add [skip-ci] to commit message head if user said yes to skip deployment', (done) => { 
        cz.prompt.mockReturnValue(Promise.resolve({
            ...answersMock,
            needDeployment: false
        }));
        engine.prompter(cz, (commitMessage) => {
            expect(commitMessage).toMatchSnapshot();
            expect(/\[skip-ci\]/g.test(commitMessage)).toBeTruthy();
            done();
        });
    });
});