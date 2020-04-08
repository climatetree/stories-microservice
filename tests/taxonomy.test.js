const request = require('supertest');

const dbHandler = require('./db.handler');
const taxonomyDao = require('../dao/taxonomy.dao.server');
const taxonomyModel=require('../models/taxonomy.model.server');

const app = require('../app');
let server, agent;


describe('End Points for Stories', () => {
    /**
     * connect to the in-memory database before running the tests
     */
    const t1=new taxonomyModel({strategy:"tmp1",solution:"tmp1",sector:"tmp1"});
    const t2=new taxonomyModel({strategy:"tmp2",solution:"tmp2",sector:"tmp2"});
    const t3=new taxonomyModel({strategy:"tmp3",solution:"tmp3",sector:"tmp3"});

    beforeAll(async (done) => {
        await dbHandler.connect();
        server = app.listen(3002, (err) => {
            if (err) return done(err);
            agent = request.agent(server); // since the application is already listening, it should use the allocated port
            t1.save();t2.save();t3.save();
            done();
        });
    });

    /**
     * after all the tests clear the database and close the database connection
     */
    afterAll(async (done) => {
        await dbHandler.clearDatabase();
        await dbHandler.closeDatabase();
        return server && server.close(done);
    });

    it('can return all the taxonomy in the database', async () => {
        const result = await taxonomyDao.findAllTaxonomy();
        expect(result.length).toEqual(3);
    });

    it('can return the taxonomy by solution in the database', async () => {
        const result = await taxonomyDao.findTaxonomyBySolution("tmp1");
        expect(result.length).toEqual(1);
    });

    it('can return the taxonomy by sector in the database', async () => {
        const result = await taxonomyDao.findTaxonomyBySolution("tmp1");
        expect(result.length).toEqual(1);
    });

    it('can return the taxonomy by strategy in the database', async () => {
        const result = await taxonomyDao.findTaxonomyBySolution("tmp1");
        expect(result.length).toEqual(1);
    });

    describe('GET/',()=>{
        it('/stories/taxonomy can return the taxonomy by solution in the database',  (done) => {
            request(app).get('/stories/taxonomy').set('Accept', 'application/json')
                .expect(200, done);
        });

        it('/stories/taxonomy/solution/:solution can return the taxonomy by solution in the database',  (done) => {
            request(app).get('/stories/taxonomy/solution/tmp1').set('Accept', 'application/json')
                .expect(200, done);
        });

        it('/stories/taxonomy/strategy/:strategy can return the taxonomy by strategy in the database',  (done) => {
            request(app).get('/stories/taxonomy/strategy/tmp1').set('Accept', 'application/json')
                .expect(200, done);
        });

        it('/stories/taxonomy/sector/:sector can return the taxonomy by sector in the database',  (done) => {
            request(app).get('/stories/taxonomy/sector/tmp1').set('Accept', 'application/json')
                .expect(200, done);
        });
    })
});
