const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const StoryModel = require('../models/story.model.server');

describe('Story endpoints /stories', () => {

    let connection;
   

    // connect with DB
    beforeAll(async () => {
         connection = await mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
        });
    });

    afterAll(async () => {
        await connection.close();
      });

      beforeEach(async () => {
        await StoryModel.deleteMany({});
      });

    it('should create and save a story', async () => {
        const story = {
            story_id : 1,
            user_id : 344,
            hyperlink : "https://climate.isro.gov/help/",
            rating : 2,
            story_title : "News report",
            place_ids : [
                0,
                7
            ],
            media_type : "video",
            date : "11/16/2018 02:01 AM",
            solution : [
                "Solar Farms",
                "Walkable Cities",
                "Insulation"
            ],
            sector : "Food",
            comments : [
                {
                    comment_id : 1,
                    user_id : 29,
                    content : "very informative",
                    date : "04/14/2016 01:53 PM"
                },
                {
                    comment_id : 2,
                    user_id : 282,
                    content : "bad post",
                    date : "09/09/2008 12:27 PM"
                },
                {
                    comment_id : 3,
                    user_id : 394,
                    content : "bad post",
                    date : "08/09/2018 01:06 AM"
                }
            ]

        }

        const validStory = new StoryModel(story);
        const savedStory = await validStory.save();

        // object is is defined after a successful save in mongodb
        expect(savedStory._id).toBeDefined();
        expect(savedStory.user_id).toBe(story.user_id);

    });

    describe('GET /', () => {
        it('should fetch all the stories', async () => {

            const stories = [
                {
                    story_id : 1,
                    user_id : 344,
                    hyperlink : "https://climate.isro.gov/help/",
                    rating : 2,
                    story_title : "News report",
                    place_ids : [
                        0,
                        7
                    ],
                    media_type : "video",
                    date : "11/16/2018 02:01 AM",
                    solution : [
                        "Solar Farms",
                        "Walkable Cities",
                        "Insulation"
                    ],
                    sector : "Food",
                    comments : [
                        {
                            comment_id : 1,
                            user_id : 29,
                            content : "very informative",
                            date : "04/14/2016 01:53 PM"
                        },
                        {
                            comment_id : 2,
                            user_id : 282,
                            content : "bad post",
                            date : "09/09/2008 12:27 PM"
                        },
                        {
                            comment_id : 3,
                            user_id : 394,
                            content : "bad post",
                            date : "08/09/2018 01:06 AM"
                        }
                    ]
        
                },
                {
                    story_id : 2,
                    user_id : 129,
                    hyperlink : "https://un.org/climate/",
                    rating : 3,
                    story_title : "News report",
                    place_ids : [
                        0,
                        1,
                        2
                    ],
                    media_type : "text",
                    date : "10/31/2016 12:33 AM",
                    solution : [
                        "Landfill Methane",
                        "Walkable Cities",
                        "District Heating"
                    ],
                    sector : "Buildings and Cities",
                    comments : [
                        {
                            comment_id : 1,
                            user_id : 285,
                            content : "good post",
                            date : "08/08/2015 02:57 PM"
                        },
                        {
                            comment_id : 2,
                            user_id : 282,
                            content : "very informative",
                            date : "09/12/2015 02:00 AM"
                        },
                        {
                            comment_id : 3,
                            user_id : 315,
                            content : "very informative",
                            date : "02/02/2013 08:31 PM"
                        }
                    ]
                },
                {
                    story_id : 3,
                    user_id : 3,
                    hyperlink : "https://epa.gov/climate/",
                    rating : 5,
                    story_title : "News report",
                    place_ids : [
                        2,
                        3,
                        7
                    ],
                    media_type : "application",
                    date : "06/16/2010 08:01 PM",
                    solution : [
                        "District Heating",
                        "Building Automation",
                        "Solar Farms"
                    ],
                    sector : "Electricity Generation",
                    comments : [
                        {
                            comment_id : 1,
                            user_id : 73,
                            content : "bad post",
                            date : "12/21/2019 10:45 AM"
                        },
                        {
                            comment_id : 2,
                            user_id : 144,
                            content : "very informative",
                            date : "08/04/2012 11:30 PM"
                        },
                        {
                            comment_id : 3,
                            user_id : 386,
                            content : "bad post",
                            date : "02/09/2013 02:59 PM"
                        }
                    ]
                }
            ]
        
            await StoryModel.collection.insertMany(stories);
            const res = await request(app).get('/stories');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(3);
        });

        it('should fetch a particular story', async() => {
            const story = {
                story_id : 1,
                user_id : 344,
                hyperlink : "https://climate.isro.gov/help/",
                rating : 2,
                story_title : "News report",
                place_ids : [
                    0,
                    7
                ],
                media_type : "video",
                date : "11/16/2018 02:01 AM",
                solution : [
                    "Solar Farms",
                    "Walkable Cities",
                    "Insulation"
                ],
                sector : "Food",
                comments : [
                    {
                        comment_id : 1,
                        user_id : 29,
                        content : "very informative",
                        date : "04/14/2016 01:53 PM"
                    },
                    {
                        comment_id : 2,
                        user_id : 282,
                        content : "bad post",
                        date : "09/09/2008 12:27 PM"
                    },
                    {
                        comment_id : 3,
                        user_id : 394,
                        content : "bad post",
                        date : "08/09/2018 01:06 AM"
                    }
                ]
    
            }
    
            const validStory = new StoryModel(story);
            const savedStory = await validStory.save();

           const res = await request(app).get('/stories/story/1');
           expect(res.statusCode).toEqual(200);
           expect(res.body).toHaveProperty('story_id');

        });
    });

    
});

function initializeStoryCollection() {
    const stories = [
        {
            story_id : 1,
            user_id : 344,
            hyperlink : "https://climate.isro.gov/help/",
            rating : 2,
            story_title : "News report",
            place_ids : [
                0,
                7
            ],
            media_type : "video",
            date : "11/16/2018 02:01 AM",
            solution : [
                "Solar Farms",
                "Walkable Cities",
                "Insulation"
            ],
            sector : "Food",
            comments : [
                {
                    comment_id : 1,
                    user_id : 29,
                    content : "very informative",
                    date : "04/14/2016 01:53 PM"
                },
                {
                    comment_id : 2,
                    user_id : 282,
                    content : "bad post",
                    date : "09/09/2008 12:27 PM"
                },
                {
                    comment_id : 3,
                    user_id : 394,
                    content : "bad post",
                    date : "08/09/2018 01:06 AM"
                }
            ]

        },
        {
            story_id : 2,
            user_id : 129,
            hyperlink : "https://un.org/climate/",
            rating : 3,
            story_title : "News report",
            place_ids : [
                0,
                1,
                2
            ],
            media_type : "text",
            date : "10/31/2016 12:33 AM",
            solution : [
                "Landfill Methane",
                "Walkable Cities",
                "District Heating"
            ],
            sector : "Buildings and Cities",
            comments : [
                {
                    comment_id : 1,
                    user_id : 285,
                    content : "good post",
                    date : "08/08/2015 02:57 PM"
                },
                {
                    comment_id : 2,
                    user_id : 282,
                    content : "very informative",
                    date : "09/12/2015 02:00 AM"
                },
                {
                    comment_id : 3,
                    user_id : 315,
                    content : "very informative",
                    date : "02/02/2013 08:31 PM"
                }
            ]
        },
        {
            story_id : 3,
            user_id : 3,
            hyperlink : "https://epa.gov/climate/",
            rating : 5,
            story_title : "News report",
            place_ids : [
                2,
                3,
                7
            ],
            media_type : "application",
            date : "06/16/2010 08:01 PM",
            solution : [
                "District Heating",
                "Building Automation",
                "Solar Farms"
            ],
            sector : "Electricity Generation",
            comments : [
                {
                    comment_id : 1,
                    user_id : 73,
                    content : "bad post",
                    date : "12/21/2019 10:45 AM"
                },
                {
                    comment_id : 2,
                    user_id : 144,
                    content : "very informative",
                    date : "08/04/2012 11:30 PM"
                },
                {
                    comment_id : 3,
                    user_id : 386,
                    content : "bad post",
                    date : "02/09/2013 02:59 PM"
                }
            ]
        }
    ]

        return StoryModel.collection.insertMany(stories);


        
}