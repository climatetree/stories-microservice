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
        server = app.listen(3000, (err) => {
            if (err) return done(err);
            agent = request.agent(server); // since the application is already listening, it should use the allocated port
            done();
        });
    });

    /**
     * after all the tests clear the database and close the database connection
     */
    afterAll(async(done) => {
        dbHandler.clearDatabase();
        dbHandler.closeDatabase();
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
                comment_id : 1,
                user_id : 156,
                content : 'very informative',
                date : '11/08/2012 04:23 AM'
            },
            {
                comment_id : 2,
                user_id : 64,
                content : 'good post',
                date : '05/02/2018 06:15 PM'
            },
            {
                comment_id : 3,
                user_id : 260,
                content : 'good post',
                date : '07/20/2012 07:24 PM'
            }
        ]
    });

    const story3 = new storyModel({
        story_id: '5e4e197ee1bc5896994d2cb1',
        user_id: 103,
        hyperlink: 'https://abc.isro.gov/climate/',
        rating: 1,
        story_title: 'ISRO ABC Climate change report',
        place_ids: [
            4,
            8,
            5
        ],
        media_type: 'text',
        date: '03/14/2009 11:48 PM',
        solution: [
            'Glass'
        ],
        sector: 'Food',
        comments: [
            {
                comment_id : 4,
                user_id : 156,
                content : 'delete',
                date : '11/08/2012 04:23 AM'
            }
        ]
    });

    const comment1 = {
        story_id: "5e4e197ee1bc5896994d2cb1",
        user_id: 123,
        content: "This is test comment",
        date: "2011-05-26T07:56:00.123Z"
    }

    /**
     * Test suite for functionality of comments on Stories
     */

    it('can create a comment on stories in the database - addComment API', async () => {
        await storyDao.createStory(story1);
        const resultComment = await commentDao.addComment(comment1.user_id, comment1.content, comment1.date);
        // console.log(resultComment.content.toString())
        // console.log("End")
        // console.log(comment1.content.toString())
        expect(resultComment.content.toString()).toEqual(comment1.content.toString());
    });

    // describe('POST/',  () => {

    //     it('/stories - return all stories', function (done) {
    //         request(app).get('/stories')
    //             .set('Accept', 'application/json')
    //             .expect('Content-Type', /json/)
    //             .expect(200, done);
    //     });

    // });

});
