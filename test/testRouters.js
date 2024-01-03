const request = require('supertest');
const fs = require('fs');
const server = 'http://localhost:3000';

describe('Routes', ()=> {
    describe('/fetchDogs/', ()=>{
        describe('GET', ()=>{
            it('responds with 200 status and text containing users', () => {
                return request(server)
                    .get('/fetchDogs/')
                    .expect('Content-Type', /text\/html/)
                    .expect(200);
            });
        })
    })











})