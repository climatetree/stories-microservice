const request = require('supertest');
const http = require('http');

const dbHandler = require('./db.handler');
const storyDao = require('../dao/story.dao.server');
const storyModel = require('../models/story.model.server');

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
        ],
        liked_by_users: []
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
    ],
    liked_by_users: []
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
    ],
    liked_by_users: []
});

const story4 = new storyModel({
    story_id: '5e4e197ee1bc5896994d2cb1',
    user_id: 104,
    hyperlink: 'https://abc.abc.gov/climate/',
    rating: 1,
    story_title: 'ISRO ABC',
    place_ids: [
        9,
		5,
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
			comment_id : 1,
			user_id : 156,
			content : 'update',
			date : '11/08/2012 04:23 AM'
		}
    ],
    liked_by_users: []
});


/**
 * Test suite for stories APIs
 */

it('can return all the stories in the database - findAllStories API', async () => {
    const stories = [story1, story2];
    await storyDao.createStory(story1);
    await storyDao.createStory(story2);

    const resultStories = await storyDao.findAllStories();
    expect(resultStories.toString()).toEqual(stories.toString());

    
    });

it('can create a new story in the database - createStory API', async () => {
    const resultStory = await storyDao.createStory(story1);
    expect(resultStory).toEqual(story1);
});

it('can delete a story from the database - deleteStory API', async () => {
    await storyDao.createStory(story1);
    await storyDao.createStory(story2);
    const createdStory = await storyDao.createStory(story3);
    
    await storyDao.deleteStory(createdStory.story_id)

    const stories = [story1, story2];
    const resultStories = await storyDao.findAllStories();
    expect(resultStories.toString()).toEqual(stories.toString());
});

it('can update a story in the database - updateStory API', async () => {
    const createdStory = await storyDao.createStory(story4);

    await storyDao.updateStory(createdStory.story_id, {story_title: 'updated'});
    story4.story_title = 'updated';

    const resultStory = await storyDao.findStoryByStoryID(createdStory.story_id);
    expect(resultStory.toString()).toEqual(story4.toString());

    await storyDao.deleteStory(createdStory.story_id);
});

it('can return a story by storyId - findStoryByStoryID API', async () => {
    const createdStory = await storyDao.createStory(story1);
    await storyDao.createStory(story2);

    const resultStory = await storyDao.findStoryByStoryID(createdStory.story_id);
    expect(resultStory.toString()).toEqual(story1.toString());
});


it('can find stories by placeID - findStoryByPlaceID API', async () => {
    place_id = 1;
    stories = [story1, story2];
    const resultStories = await storyDao.findStoryByPlaceID(place_id, 20, 1);
    expect(resultStories.toString()).toEqual(stories.toString());
});


it('can find stories by placeID with page and limit- findStoryByPlaceID API', async () => {
    place_id = 1;
    await storyDao.createStory(story1);
    await storyDao.createStory(story2);

    const resultStories = await storyDao.findStoryByPlaceID(place_id, 1, 1);
    expect(resultStories.toString()).toEqual(story1.toString());
    expect(resultStories.length == 1)
 });

it('can find stories by title - findStoryByTitle API', async () => {
    await storyDao.createStory(story1);
    await storyDao.createStory(story2);
    title = "ISRO"
    const resultStories = await storyDao.findStoryByTitle(title, 1, 1);
    expect(resultStories.length == 1);
    expect(resultStories.toString()).toEqual(story2.toString())
});

it('user can like a story - likeStory API', async () => {
    user_id = 1;
    const createdStory = await storyDao.createStory(story1);
    const resultStory = await storyDao.likeStory(createdStory, user_id);
    expect(resultStory.liked_by_users.includes(user_id)).toBeTruthy();
});

it('user can unlike a story - unlikeStory API', async () => {
    user_id = 1;
    const createdStory = await storyDao.createStory(story1);
    const resultLikedStory = await storyDao.likeStory(createdStory, user_id);
    const resultUnlikedStory = await storyDao.unlikeStory(resultLikedStory, user_id);
    expect(resultUnlikedStory.liked_by_users.includes(user_id)).toBeFalsy();

});

it('can find top n recent stories - findTopStories API', async () => {
    await storyDao.createStory(story2);
    await storyDao.createStory(story1);

    const resultStories = await storyDao.findTopStories(3);
    stories = [story1, story2]
    expect(resultStories.toString()).toEqual(stories.toString())
    expect(resultStories.length == 2)
})

    describe('GET/',  () => {

        it('/stories - return all stories', function (done) {
            request(app).get('/stories')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

        it('/stories - return all stories paginated', function (done) {
            request(app).get('/stories?page=1&limit=10')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

        it('/stories/:storyId - return 404 if story not found', function (done) {
        
            request(app).get('/stories/1')
                .set('Accept', 'application/json')
                .expect(404, done);
        });

        it('/stories/title - return story titles paginated', function (done) {
            request(app).get('/stories/title/ISRO?page=1&limit=10')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

        it('/stories/title - return story titles paginated error', function (done) {
            request(app).get('/stories/title/ISRO?page=aaaa&limit=10')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(500, done);
        });

        it('/stories/place - return story by place paginated', function (done) {
            request(app).get('/stories/place/0?page=1&limit=10')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

        it('/stories/place - return story by place paginated error', function (done) {
            request(app).get('/stories/place/0?page=aaaa&limit=10')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(500, done);
        });

    });

    describe('DELETE/', () => {
        it('/stories/delete/:storyId - return 404 if story not found', function (done) {
        
            request(app).delete('/stories/delete/1')
                .set('Accept', 'application/json')
                .expect(404, done);
        });
    });

    describe('PUT/', () => {
        it('/stories/update/:storyId - return 404 if story not found', function (done) {
        
            request(app).delete('/stories/update/1')
                .set('Accept', 'application/json')
                .expect(404, done);
        });

        it('/stories/:storyID/like/:userID - like a story', async (done) => {
            const user_id = 1;
            const createdStory = await storyDao.createStory(story1);
            const story_id = createdStory.story_id;

            request(app).put('/stories/'+story_id+'/like/'+user_id)
                .set('Accept', 'application/json')
                .expect(200, done);
        });

        it('/stories/:storyID/like/:userID - like a story when story not found', async (done) => {
            const user_id = 1;
            const story_id = 90

            request(app).put('/stories/'+story_id+'/like/'+user_id)
                .set('Accept', 'application/json')
                .expect(404, done);
        });

        it('/stories/:storyID/unlike/:userID - unlike a story', async (done) => {
            const user_id = 1;
            const createdStory = await storyDao.createStory(story2);
            const resultLikedStory = await storyDao.likeStory(createdStory, user_id);
            const story_id = resultLikedStory.story_id;
            
            request(app).put('/stories/'+story_id+'/unlike/'+user_id)
                .set('Accept', 'application/json')
                .expect(200, done);
        });

        it('/stories/:storyID/unlike/:userID - unlike a story when userID is not available', async (done) => {
            const user_id = 1;
            const createdStory = await storyDao.createStory(story2);
            const story_id = createdStory.story_id;
            
            request(app).put('/stories/'+story_id+'/unlike/'+user_id)
                .set('Accept', 'application/json')
                .expect(200, done);
        });
    });
});
