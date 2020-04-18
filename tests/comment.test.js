const request = require('supertest');

const dbHandler = require('./db.handler');
const storyDao = require('../dao/es.story.dao.server');
const commentDao = require('../dao/comment.dao.server');
const role = require('../constants/role');

const app = require('../app');
let server, agent;


describe('End Points for Stories', () => {
    /**
     * connect to the in-memory database before running the tests
     */
    beforeAll(async(done) => {
        await dbHandler.connect();
        server = app.listen(3001,async  (err) => {
            if (err) return done(err);
            agent = request.agent(server); // since the application is already listening, it should use the allocated port
            storyDao.createStory(story1,()=>{console.log("story 1 created")});
            storyDao.createStory(story2,()=>{console.log("story 2 created")});
            setTimeout(done,2000);
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
        story_id: '5e4e197ee1bc5896994d2cb3',
        user_id: 101,
        posted_by: 'rameshRocks123',
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
        sector: ['Buildings and Cities'],
        strategy:['Buildings and Cities'],
        description:'NASA climatte change report',
        comments: [ ],liked_by_users:[],flagged_by_users:[]
    };
    const story2 = {
        story_id: '5e4e197ee1bc5896994d2cb7',
        posted_by: 'rameshRocks123',
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
        sector: ['Food'],
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
        ] ,
          strategy:['Buildings and Cities'],
          description:'NASA climatte change report', liked_by_users:[],flagged_by_users:[]
    };

    const comment1 = {
        user_id : 156,
        content : 'update',
        date : '11/08/2012 04:23 AM',
        user_name: 'testUser'
    };

    const comment2 = {
        user_id : 123,
        content : 'this is test comment',
        date : '11/08/2012 04:23 AM',
        user_name: 'testUser'
    };

    /**
     * Test suite for functionality of comments on Stories
     */
    const failCallback= err=>{console.log(err);expect(false).toBeTruthy();};
    it('can return all the comments in the database', async () => {
        const comments = [comment1, comment2];
        await commentDao.addComment(comment1.user_id, comment1.content, comment1.date,comment1.user_name);
        await commentDao.addComment(comment2.user_id, comment2.content, comment2.date,comment1.user_name);

        const resultComments = await commentDao.findAllComments();
        expect(resultComments.length).toEqual(comments.length);
    });

    it('can create a comment', async () => {
        const resultComment = await commentDao.addComment(comment1.user_id, comment1.content, comment1.date, comment1.user_name);
        expect(resultComment.content.toString()).toEqual(comment1.content.toString());
    });

   it('can delete a comment',async () => {
       const createdComment = await commentDao.addComment(comment2.user_id, comment2.content, comment2.date,comment2.user_name);
       await commentDao.deleteComment(createdComment.comment_id);
       const comments = await commentDao.findAllComments();
       expect(comments.includes(createdComment)).toBe(false);
   });

    it('it can find comment by Id',async () => {
        const createdComment = await commentDao.addComment(comment1.user_id, comment1.content, comment1.date, comment1.user_name);
        const comment = await commentDao.findCommentById(createdComment.comment_id);
        expect(comment.comment_id.toString()).toEqual(createdComment.comment_id.toString());
    });

    describe('POST/', () => {

        it('/v1/stories/story/comment - cannot a comment when story not found', (done) => {
            storyDao.createStory(story1,createdStory=>setTimeout(()=>{
                request(app).post('/v1/stories/story/comment').send({
                                                                        "storyId": "5e4e197ee1bc5896994d2cb9",
                                                                        "userId": 123,
                                                                        "content": "This is test comment",
                                                                        "date": "2011-05-26T07:56:00.123Z",
                                                                        "username": "testUser"
                                                                    })
                    .set('Accept', 'application/json')
                    .expect(403, done);
            },1000),failCallback);
        });

        it('/v1/stories/story/comment - can add a comment when story is found', async (done) => {
            await storyDao.createStory(story1,createdStory=>setTimeout(()=>{
                const story_id = createdStory.story_id;
                request(app).post('/v1/stories/story/comment').send({
                                                    "storyId": story_id,
                                                    "userId": 123,
                                                    "content": "This is test comment",
                                                    "date": "2011-05-26T07:56:00.123Z",
                                                    "username":"testUser"
                                                })
                    .set('Accept', 'application/json')
                    .expect(200, done);
            },1000),failCallback);


        });
    });

    describe('GET/',  () => {

        it('/v1/stories/comment - return all comments', (done) => {
            request(app).get('/v1/stories/comment')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

    });

    describe('DELETE/',  () => {

        it('/v1/stories/story/comment - cannot delete a comment if the userId does not match', (done) => {
            request(app).delete('/v1/stories/story/comment').send({
                "storyId": "5e52f1b01b45c660789837jk",
                "userId": 456,
                "commentId": "5e6db1e7d105af099c922fca",
                "role": role.REGISTERED_USER
            })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(403, done);
        });

        it('/v1/stories/story/comment - user can delete a comment if the comment exists', async (done)  => {
            await storyDao.createStory(story1,createdStory=>setTimeout(()=>{
                const story_id = createdStory.story_id;
                request(app).post('/v1/stories/story/comment').send({
                                                              "storyId": story_id,
                                                              "userId": 123,
                                                              "content": "This is test comment",
                                                              "date": "2011-05-26T07:56:00.123Z",
                                                              "username":"testUser"
                                                                                  })
                    .set('Accept', 'application/json').expect('Content-Type', /application\/json/)
                    .end((err,comment)=>{
                        request(app).delete('/v1/stories/story/comment').send({
                                                              "storyId": story_id,
                                                              "userId": comment.body.user_id,
                                                              "commentId": comment.body.comment_id,
                                                              "role": role.REGISTERED_USER})
                            .expect(200, done);
                    });
            },1000),failCallback);
        });

        it('/v1/stories/story/comment - can delete a comment if moderator', async (done)  => {
            await storyDao.createStory(story2,createdStory=>setTimeout(()=>{
                const story_id = createdStory.story_id;
                request(app).post('/v1/stories/story/comment').send({
                                      "storyId": story_id,
                                      "userId": 123,
                                      "content": "This is test comment",
                                      "date": "2011-05-26T07:56:00.123Z",
                                      "username":"testUser"
                                      }).set('Accept', 'application/json').expect('Content-Type', /application\/json/)
                    .end((err,comment)=>{
                    request(app).delete('/v1/stories/story/comment').send({
                                                  "storyId": story_id,
                                                  "userId": 1,
                                                  "commentId": comment.body.comment_id,
                                                  "role": role.MODERATOR})
                        .expect(200, done);
                });
            },1000),failCallback);
        });

        it('/v1/stories/story/comment - can delete a comment if admin', async (done)  => {
            await storyDao.createStory(story1,createdStory=>setTimeout(()=>{
                const story_id = createdStory.story_id;
                request(app).post('/v1/stories/story/comment').send({
                                                          "storyId": story_id,
                                                          "userId": 123,
                                                          "content": "This is test comment",
                                                          "date": "2011-05-26T07:56:00.123Z",
                                                          "username":"testUser"})
                    .set('Accept', 'application/json').expect('Content-Type', /application\/json/)
                    .end((err,comment)=>{
                        request(app).delete('/v1/stories/story/comment').send({
                                                          "storyId": story_id,
                                                          "userId": 1,
                                                          "commentId": comment.body.comment_id,
                                                          "role": role.ADMIN})
                            .expect(200, done);
                    });
            },1000),failCallback);
        });
    });
});
