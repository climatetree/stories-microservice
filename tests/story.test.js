const request = require('supertest');

const dbHandler = require('./db.handler');
const storyDao = require('../dao/story.dao.server');
const storyModel = require('../models/story.model.server');

const app = require('../app');


describe('End Points for Stories', () => {
/**
 * connect to the in-memory database before running the tests
 */
    beforeAll(async() => await dbHandler.connect());

    /**
     * after all the tests clear the database and close the database connection
     */
    afterAll(async() => {
        await dbHandler.clearDatabase();
        await dbHandler.closeDatabase();
    });

    /**
     * Mock data
     */
    const story1 = new storyModel({
        story_id: 1,
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
        comments: [
            {
                comment_id : 1,
                user_id : 264,
                content : "bad post",
                date : "02/03/2009 07:51 PM"
            },
            {
                comment_id : 2,
                user_id : 20,
                content : "very informative",
                date : "03/05/2013 03:01 AM"
            }
        ]
    });

    const story2 = new storyModel({
        story_id: 2,
        user_id: 102,
        hyperlink: 'https://climate.isro.gov/climate/',
        rating: 1,
        story_title: 'ISRO Climate change report',
        place_ids: [
            0,
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

    /**
     * Test suite for stories APIs
     */
    it('can create a new story in the database - createStory API', async () => {
        const resultStory = await storyDao.createStory(story1);
        expect(resultStory).toEqual(story1);
    });

    it('can return all the stories in the database - findAllStories API', async () => {
        const stories = [story1, story2];

        await storyDao.createStory(story1);
        await storyDao.createStory(story2);

        const resultStories = await storyDao.findAllStories();
        expect(resultStories.toString()).toEqual(stories.toString());
    });

    it('can return a story by storyId - findStoryByStoryID API', async () => {
        await storyDao.createStory(story1);
        await storyDao.createStory(story2);

        const resultStory = await storyDao.findStoryByStoryID(story1.story_id);
        expect(resultStory.toString()).toEqual(story1.toString());
    });

    describe('GET/',  () => {

        it('/stories - return all stories', function (done) {
            request(app).get('/stories')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

        it('/stories/story/:storyId - return story by storyId', function (done) {
            request(app).get('/stories/story/1')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

    });
})




