const request = require('supertest');

const dbHandler = require('./db.handler');
const storyDao = require('../dao/story.dao.server');
const commentDao = require('../dao/comment.dao.server');
const ObjectID = require("bson-objectid");

const app = require('../app');
let server, agent;


describe('End Points for Stories', () => {
    /**
     * connect to the in-memory database before running the tests
     */
    beforeAll(async(done) => {
        await dbHandler.connect();
        server = app.listen(3000, (err) => {
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
    const story1 = {
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
        sector: ['Buildings and Cities'],strategy: ['food'],
        comments: {},liked_by_users:{}
    };
    const story2 = {
        story_id: '5e4e197ee1bc5896994d2cb2',
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
        sector: ['Food'],strategy:['food'],
        comments: {
            "5e786e819a73e5b837ca0820": {
                comment_id: "5e786e819a73e5b837ca0820",
                story_id: '5e4e197ee1bc5896994d2cb2',
                user_id: 156,
                content: 'very informative',
                date: '11/08/2012 04:23 AM'
            },
            "5e786e819a73e5b837ca0821":{
        comment_id:"5e786e819a73e5b837ca0821",
                story_id: '5e4e197ee1bc5896994d2cb2',
            user_id: 64,
            content: 'good post',
            date: '05/02/2018 06:15 PM'},
    "5e786e819a73e5b837ca0822":{
        comment_id:"5e786e819a73e5b837ca0822",
        story_id: '5e4e197ee1bc5896994d2cb2',
            user_id: 260,
            content: 'good post',
            date: '07/20/2012 07:24 PM'
    }
}
    };

    const comment1 = {
        comment_id:"5e786e819a73e5b837ca0823",
        story_id:"5e786e819a73e5b837ca0899",
        user_id : 156,
        content : 'update',
        date : '11/08/2012 04:23 AM'
    };

    const comment2 = {
        comment_id:"5e786e819a73e5b837ca0824",
        story_id:"5e786e819a73e5b837ca0898",
        user_id : 123,
        content : 'this is test comment',
        date : '11/08/2012 04:23 AM'
    };

    /**
     * Test suite for functionality of comments on Stories
     */

    it('can return all the comments in the database', async () => {
        const comments = [comment1, comment2];
        await commentDao.insertComment(comment1);
        await commentDao.insertComment(comment2);

        const resultComments = await commentDao.findAllComments();
        expect(resultComments.length).toEqual(comments.length);
    });

    it('can create a comment', async () => {
        story1.story_id=ObjectID().str;
        await storyDao.createStory(story1);
        comment1.story_id=story1.story_id;
        const resultComment = await commentDao.insertComment(comment1);
        expect(resultComment.content.toString()).toEqual(comment1.content.toString());
    });

   it('can delete a comment',async () => {
       await storyDao.createStory(story2);
       const createdComment = await commentDao.insertComment(comment2);
       await commentDao.deleteComment(createdComment.comment_id);
       const comments = await commentDao.findAllComments();
       expect(comments.includes(createdComment)).toBe(false);
   });

    it('it can find comment by Id',async () => {
        comment1.comment_id=ObjectID().str;
        const createdComment = await commentDao.insertComment(comment1);
        const comment = await commentDao.findCommentByCommentID(createdComment.comment_id);
        expect(comment[0].comment_id.toString()).toEqual(createdComment.comment_id.toString());
    });

    describe('POST/', () => {
        it('/stories/story/comment - cannot a comment when story not found', (done) => {

            request(app).post('/stories/story/comment').send({
                "story_id": "5e4e197ee1bc5896994d2cb1",
                "user_id": 123,
                "content": "This is test comment",
                "date": "2011-05-26T07:56:00.123Z"
            })
                .set('Accept', 'application/json')
                .expect(404, done);
        });

        it('/stories/story/comment - can add a comment when story is found', async (done) => {
            storyDao.createStory(story1);
            const story = await storyDao.findAllStories(1,1).then((story) => story[0]);
            request(app).post('/stories/story/comment').send({
                "story_id": story.story_id,
                "user_id": 123,
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
                "story_id": "5e52f1b01b45c660789837de",
                "user_id": 456,
                "commentId": "5e6db1e7d105af099c922fca"
            })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404, done);
        });

        it('/stories/story/comment - can delete a comment if the comment exists', async (done)  => {
            comment2.comment_id=ObjectID().str;
            await commentDao.insertComment(comment2);
            story1.story_id=ObjectID().str;
            await storyDao.createStory(story1);
            story1.comments[comment2.comment_id]=comment2;
            await storyDao.updateComments(story1.story_id,story1.comments);
            request(app).delete('/stories/story/comment').send({
                "story_id": story1.story_id,
                "user_id": comment2.user_id,
                "comment_id": comment2.comment_id
            })
                .expect(200, done);
        });

    });
});
