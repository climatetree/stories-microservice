const request = require('supertest');

const dbHandler = require('./db.handler');
const storyDao = require('../dao/story.dao.server');
const storyModel = require('../models/story.model.server');
const commentDao = require('../dao/comment.dao.server');

const app = require('../app');
let server, agent;


describe('End Points for Stories', () => {
    /**
     * connect to the in-memory database before running the tests
     */
    beforeAll(async(done) => {
        await dbHandler.connect();
        server = app.listen(3001, (err) => {
            if (err) return done(err);
            agent = request.agent(server); // since the application is already listening, it should use the allocated port
            done();
        });
    });

    /**
     * after all the tests clear the database and close the database connection
     */
    afterAll(async (done) => {
        await dbHandler.clearDatabase();
        await dbHandler.closeDatabase();
        return  server && server.close(done);
    });

    /**
     * Mock data
     */
    const story1 = new storyModel({
        story_id: '5e4e197ee1bc5896994d2cb1',
        user_id: 101,
        hyperlink: 'https://epa.gov/evidence/',
        rating: 1,
        story_title: 'NASA climatte change report',
        place_ids: [
            1,
            2,
            4
        ],
        media_type: 'video',
        date: '2/01/2018 04:12 AM',
        solution: [
            'Smart Thermostats',
            'Landfill Methane',
            'Building Automation'
        ],
        sector: 'Buildings and Cities',
        comments: [ ]
    });
    const story2 = new storyModel({
        story_id: '5e4e197ee1bc5896994d2cb1',
        user_id: 102,
        hyperlink: 'https://climate.isro.gov/climate/',
        rating: 1,
        story_title: 'ISRO Climate change report',
        place_ids: [
            1,
            3,
            5
        ],
        media_type: 'text',
        date: '08/11/2009 11:48 PM',
        solution: [
            'Smart Glass',
            'District Heating',
            'LED Lighting (Household)'
        ],
        sector: 'Food',
        comments: [
            {
                user_id : 156,
                content : 'very informative',
                date : '11/08/2012 04:23 AM'
            },
            {
                user_id : 64,
                content : 'good post',
                date : '05/02/2018 06:15 PM'
            },
            {
                user_id : 260,
                content : 'good post',
                date : '07/20/2012 07:24 PM'
            }
        ]
    });

    const comment1 = {
        user_id : 156,
        content : 'update',
        date : '11/08/2012 04:23 AM'
    };

    const comment2 = {
        user_id : 123,
        content : 'this is test comment',
        date : '11/08/2012 04:23 AM'
    };

    /**
     * Test suite for functionality of comments on Stories
     */

    it('can return all the comments in the database', async () => {
        const comments = [comment1, comment2];
        await commentDao.addComment(comment1.user_id, comment1.content, comment1.date);
        await commentDao.addComment(comment2.user_id, comment2.content, comment2.date);

        const resultComments = await commentDao.findAllComments();
        expect(resultComments.length).toEqual(comments.length);
    });

    it('can create a comment', async () => {
        await storyDao.createStory(story1);
        const resultComment = await commentDao.addComment(comment1.user_id, comment1.content, comment1.date);
        expect(resultComment.content.toString()).toEqual(comment1.content.toString());
    });

   it('can delete a comment',async () => {
       await storyDao.createStory(story2);
       const createdComment = await commentDao.addComment(comment2.user_id, comment2.content, comment2.date);
       await commentDao.deleteComment(createdComment.comment_id);
       const comments = await commentDao.findAllComments();
       expect(comments.includes(createdComment)).toBe(false);
   });

    it('it can find comment by Id',async () => {
        const createdComment = await commentDao.addComment(comment1.user_id, comment1.content, comment1.date);
        const comment = await commentDao.findCommentById(createdComment.comment_id);
        expect(comment.comment_id.toString()).toEqual(createdComment.comment_id.toString());
    });

    describe('POST/', () => {
        it('/stories/story/comment - cannot a comment when story not found', (done) => {

            request(app).post('/stories/story/comment').send({
                "storyId": "5e4e197ee1bc5896994d2cb1",
                "userId": 123,
                "content": "This is test comment",
                "date": "2011-05-26T07:56:00.123Z"
            })
                .set('Accept', 'application/json')
                .expect(403, done);
        });

        it('/stories/story/comment - can add a comment when story is found', async (done) => {
            const story = await storyDao.findAllStories(1,1).then((story) => story[0]);
            request(app).post('/stories/story/comment').send({
                "storyId": story.story_id,
                "userId": 123,
                "content": "This is test comment",
                "date": "2011-05-26T07:56:00.123Z"
            })
                .set('Accept', 'application/json')
                .expect(200, done);
        });
    });

    describe('GET/',  () => {

        it('/stories/comment - return all comments', (done) => {
            request(app).get('/stories/comment')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

    });

    describe('DELETE/',  () => {

        it('/stories/story/comment - cannot delete a comment if the userId does not match', (done) => {
            request(app).delete('/stories/story/comment').send({
                "storyId": "5e52f1b01b45c660789837de",
                "userId": 456,
                "commentId": "5e6db1e7d105af099c922fca"
            })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(403, done);
        });

        it('/stories/story/comment - can delete a comment if the comment exists', async (done)  => {
            const createdComment = await commentDao.addComment(comment2.user_id, comment2.content, comment2.date);
            const story = await storyDao.findAllStories(1,1).then((story) => {
                if(story){
                    story[0].comments.push(createdComment);
                    return story[0];
                }
            });
            request(app).delete('/stories/story/comment').send({
                "storyId": story.story_id,
                "userId": comment2.user_id,
                "commentId": story.comments[0].comment_id
            })
                .expect(200, done);
        });

    });
});
