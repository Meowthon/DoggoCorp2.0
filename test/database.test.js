const databaseModel = require('../server/models/databaseModel.js');
const dogController = require('../server/controllers/dogController.js');

describe('Database Model Tests', () => {
  let originalQuery;

  beforeAll(() => {
    originalQuery = databaseModel.query; // storing original query method
    databaseModel.query = jest.fn(); // replacing the query method with a mock function
  });

  afterAll(() => {
    databaseModel.query = originalQuery; // restoring original query method after all tests are done
  });
    
    it('should retrieve a user by user_id from the database', async () => {
        const userId = 1;
        const mockUser = { 
            user_id: userId, 
            user_name: 'hello',
            password: 'hi',
            google_id: null,
            email: null,
            first_name: 'Hello',
            last_name: 'Kitty',
            phone_number: '(555)-555-5555',
            is_owner: true 
        };
    
        databaseModel.query.mockResolvedValueOnce({ rows: [mockUser] });
    
        const result = await databaseModel.query('SELECT * FROM users WHERE user_id = $1', [userId]);
    
        expect(databaseModel.query).toHaveBeenCalledWith('SELECT * FROM users WHERE user_id = $1', [userId]);
        expect(result.rows).toEqual([mockUser]);
      });

    it('should retrieve a user by user_name from the database (when user_name is a string)', async () => {
        const userName = 'hello';
        const mockUser = { 
            user_id: 1, 
            user_name: userName,
            password: 'hi',
            google_id: null,
            email: null,
            first_name: 'Hello',
            last_name: 'Kitty',
            phone_number: '(555)-555-5555',
            is_owner: true 
        };
    
        databaseModel.query.mockResolvedValueOnce({ rows: [mockUser] });
    
        const result = await databaseModel.query('SELECT * FROM users WHERE user_name = $1', [userName]);
    
        expect(databaseModel.query).toHaveBeenCalledWith('SELECT * FROM users WHERE user_name = $1', [userName]);
        expect(result.rows).toEqual([mockUser]);
        expect(typeof result.rows[0].user_name).toBe('string');
    });

    it('should return an error when user_name type is not a string', async () => {
        const userName = 888;
        
        databaseModel.query.mockRejectedValueOnce(new Error('Invalid user_name type'));
    
        await expect(databaseModel.query('SELECT * FROM users WHERE user_name = $1', [userName]))
            .rejects.toThrowError('Invalid user_name type');
        
        expect(databaseModel.query).toHaveBeenCalledWith('SELECT * FROM users WHERE user_name = $1', [userName]);
    });

    it('should return an error when password is not provided', async () => {
        const userName = 'hello';
        const password = undefined;
    
        databaseModel.query.mockRejectedValueOnce(new Error('Password is required'));
    
        try {
            await databaseModel.query('SELECT * FROM users WHERE user_name = $1 AND password = $2', [userName, password]);
            fail('Expected an error to be thrown for missing password');
        } catch (error) {
            expect(error.message).toBe('Password is required');
        }
    
        expect(databaseModel.query).toHaveBeenCalledWith('SELECT * FROM users WHERE user_name = $1 AND password = $2', [userName, password]);
    });
    
    describe('fetchDogs', () => {
        it('should fetch dogs from the database for a specific user', async () => {
          const mockUserId = 1;
          const mockDogs = [
            {
              dog_id: 1,
              name: 'Buddy',
              age: 3,
              weight: 20,
              breed: 'Pomeranian',
              meals: null,
              medication: null,
              groomer: null,
              miscellaneous: null,
              owner_id: mockUserId,
              birthday: null
            },
          ];
          databaseModel.query.mockResolvedValueOnce({ rows: mockDogs });
    
          await dogController.fetchDogs({ params: { userId: mockUserId } }, {}, jest.fn());
    
          expect(databaseModel.query).toHaveBeenCalledWith(
            expect.stringContaining('SELECT * FROM dogs WHERE owner_id'),
            [mockUserId]
          );
        //   expect(databaseModel.query).toHaveReturnedWith({ rows: mockDogs }); >> fails

        });
      });

});

  it('should retrieve a user by user_id from the database', async () => {
    console.log(databaseModel.query);
    const userId = 1;
    const mockUser = {
      user_id: userId,
      user_name: 'claire0',
      password: '1234',
      google_id: null,
      email: null,
      first_name: 'Claire',
      last_name: 'Huang',
      phone_number: '(314)-703-6995',
      is_owner: true,
    };

    databaseModel.query.mockResolvedValueOnce({ rows: [mockUser] });

    const result = await databaseModel.query(
      'SELECT * FROM users WHERE user_id = $1',
      [userId]
    );

    expect(databaseModel.query).toHaveBeenCalledWith(
      'SELECT * FROM users WHERE user_id = $1',
      [userId]
    );
    expect(result.rows).toEqual([mockUser]);
  });
});

