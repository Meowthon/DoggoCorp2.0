const pool = require('../models/databaseModel');

const dogController = {};

dogController.addDog = async (req, res, next) => {
  const {
    name,
    age,
    weight,
    breed,
    meals,
    medication,
    groomer,
    miscellaneous,
    owner_id,
  } = req.body;
  // console.log('there was an attempt to create a dog')
  try {
    const result = await pool.query(
      'INSERT INTO dogs (dog_name, age, weight, breed, meals, medication, groomer, miscellaneous, owner_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [
        name,
        age,
        weight,
        breed,
        meals,
        medication,
        groomer,
        miscellaneous,
        owner_id,
      ]
    );
    // Send the inserted dog data back to the client if needed
    res.locals.currentDog = result.rows[0];
    next();
  } catch (error) {
    return next({
      log: `Error happened at middleware dogController.addDog ${error}`,
      message: { error: 'Dog database profile creation error' },
    });
  }
};

// //function to initialize the SQL dog table

// dogController.createDogTable = async (req, res, next) => {
//     counter = 0;
//     try {
//       if(counter=0) {
//         const createDogTableQuery =
//         ` DROP TABLE dogs CREATE TABLE dogs (
//             dog_id INT PRIMARY KEY AUTO_INCREMENT
//             dog_name VARCHAR(255) NOT NULL,
//             dog_schedule VARCHAR(255) NOT NULL,
//             dog_diet VARCHAR(255),
//             dog_info VARCHAR(255),
//             owner_id VARCHAR(255) FOREIGN KEY REFERENCES users(user_id)
//            );`
//         await db.none(this.createDogTableQuery);
//         console.log('Dogs Table created successfully');
//         counter++;
//         next();
//         }
//     } catch (err) {
//         return(next({
//             log: `Error happened at middleware create Dog Table: ${error}`,
//             message: { error: 'Table not created' }}
//           ));
//     }

// }

dogController.fetchDogs = async (req, res, next) => {
  console.log('fetchDogs started');
  // const userId = req.body.ssid;
  // const role = req.body.role;
  // const dogs = [];
  //query text
  const user_id = req.params.userId;
  try {
    // if (role === 'owner') {

    // const user = await pool.query('SELECT * FROM users WHERE google_id = $1', [googleId]);
    //jarod's info hardcoded for presentation
    const response = await pool.query(
      'SELECT * FROM dogs WHERE owner_id = $1;',
      [user_id]
    );
    res.locals.dogs = response.rows;
    console.log(res.locals.dogs);
    return next();
  } catch (error) {
    console.error('Error fetching dogs:', error);
  }
};

module.exports = dogController;
