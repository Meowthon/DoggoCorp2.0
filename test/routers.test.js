const request = require('supertest');
const fs = require('fs');
const server = 'http://localhost:3000';
const pool = require('../server/models/databaseModel');

describe('Routes', () => {
  let testUserId;
  let testDogId;

  beforeEach(async () => {
    const testUserResponse = await pool.query(
      'INSERT INTO users (user_name, password, is_owner) VALUES ($1, $2, $3) ' +
        'RETURNING *',
      ['testRoutes', '000', true]
    );
    testUserId = testUserResponse.rows[0].user_id;

    const testDogResponse = await pool.query(
      'INSERT INTO dogs (dog_name, age, weight, breed, owner_id) ' +
        'VALUES ($1, $2, $3, $4, $5) ' +
        'RETURNING *',
      ['Shadow', 2, 10, 'chihuahua', testUserId]
    );
    testDogId = testDogResponse.rows[0].dog_id;
  });

  describe('/fetchDogs/:userId', () => {
    describe('GET', () => {
      it('responds with 200 status and data containing dog info', async () => {
        await request(server)
          .get(`/fetchDogs/${testUserId}`)
          .expect('Content-Type', 'application/json; charset=utf-8')
          .expect(200);

        const dogs = await pool.query('SELECT * FROM dogs WHERE dog_id = $1;', [
          testDogId,
        ]);
        expect(dogs.rows.length).toEqual(1);
        expect(dogs.rows[0].dog_name).toEqual('Shadow');
        expect(dogs.rows[0].age).toEqual(2);
        expect(dogs.rows[0].weight).toEqual('10.00');
        expect(dogs.rows[0].breed).toEqual('chihuahua');
        expect(dogs.rows[0].owner_id).toEqual(testUserId);
      });

      // remove the test data
      afterEach(async () => {
        await pool.query('DELETE FROM dogs WHERE dog_id = $1;', [testDogId]);
        await pool.query('DELETE FROM users WHERE user_id = $1;', [testUserId]);
      });
    });

    describe('/signup', () => {
      describe('POST', () => {
        it('responds with 200 status and new user in db', async () => {
          await request(server)
            .post('/signup')
            .send({
              password: '123',
              username: 'testSignUp',
              watcher: true,
            })
            .expect(200); //this creates a user every time

          const user = await pool.query(
            'SELECT * FROM users WHERE user_name = $1;',
            ['testSignUp']
          );
          expect(user.rows.length).toEqual(1);
          expect(user.rows[0].user_name).toEqual('testSignUp');
          expect(user.rows[0].password).toEqual('123');
          expect(user.rows[0].is_owner).toEqual(false);
        });

        it('responds with 500 if username or password is not inputed', () => {
          return request(server)
            .post('/signup')
            .send({
              username: null,
              password: null,
            })
            .expect(500); //needed to alter columns in database for this to work
        });

        afterAll(async () => {
          await pool.query('DELETE FROM users WHERE user_name = $1;', [
            'testSignUp',
          ]);
        });
      });
    });

    describe('/login/no-oauth', () => {
      describe('POST', () => {
        it('responds with 200 status and successful login', () => {
          return request(server)
            .post('/login/no-oauth')
            .send({
              username: 'test',
              password: 'test',
            })
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200);
        });
      });
    });
  });

  describe('/addDog', () => {
    // Set up some test data

    describe('POST', () => {
      it('responds with 200 status and new dog in db', async () => {
        await request(server)
          .post('/addDog')
          .send({
            name: 'testAddDog',
            age: 2,
            owner_id: testUserId,
            breed: 'chihuahua',
            weight: 10,
          })
          .expect('Content-Type', 'application/json; charset=utf-8')
          .expect(200);

        const dogs = await pool.query(
          'SELECT * FROM dogs WHERE owner_id = $1;',
          [testUserId]
        );
        expect(dogs.rows.length).toEqual(2);
        expect(dogs.rows[1].dog_name).toEqual('testAddDog');
        expect(dogs.rows[1].age).toEqual(2);
        expect(dogs.rows[1].weight).toEqual('10.00');
        expect(dogs.rows[1].breed).toEqual('chihuahua');
        expect(dogs.rows[1].owner_id).toEqual(testUserId);
      });
      it('responds with 500 status when there is an incorrect input', () => {
        return request(server)
          .post('/addDog')
          .send({ name: 'Shadow', age: 'nan', weight: 'nan', owner_id: 2 })
          .expect('Content-Type', 'application/json; charset=utf-8')
          .expect(500); //internal server error
      });
    });
  });

  describe('/deleteDog/:id', () => {
    let testUserId;
    let testDogId;

    describe('POST', () => {
      beforeEach(async () => {
        const testUserResponse = await pool.query(
          'INSERT INTO users (user_name, password, is_owner) VALUES ($1, $2, $3) ' +
            'RETURNING *',
          ['testDelete', '000', true]
        );
        testUserId = testUserResponse.rows[0].user_id;

        const testDogResponse = await pool.query(
          'INSERT INTO dogs (dog_name, age, weight, breed, owner_id) ' +
            'VALUES ($1, $2, $3, $4, $5) ' +
            'RETURNING *',
          ['Shadow', 2, 10, 'chihuahua', testUserId]
        );
        testDogId = testDogResponse.rows[0].dog_id;
      });

      it('responds with 200 status and new dog in db', async () => {
        await request(server)
          .delete(`/deleteDog/${testDogId}`)
          .expect('Content-Type', 'application/json; charset=utf-8')
          .expect(200);

        const dog = await pool.query('SELECT * FROM dogs WHERE dog_id = $1;', [
          testDogId,
        ]);
        expect(dog.rows.length).toEqual(0);
      });

      afterEach(async () => {
        await pool.query('DELETE FROM dogs WHERE dog_id = $1;', [testDogId]);
        await pool.query('DELETE FROM users WHERE user_id = $1;', [testUserId]);
      });
    });
  });

  afterEach(async () => {
    await pool.query('DELETE FROM dogs WHERE owner_id = $1;', [testUserId]);
    await pool.query('DELETE FROM users WHERE user_id = $1;', [testUserId]);
  });
});
