import mysql from 'mysql';
import config from './config.js';
import fetch from 'node-fetch';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import admin from 'firebase-admin';
import response from 'express';
import { constants } from 'http2';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth'
import { Buffer } from "buffer"
import serviceAccount from './serviceAccountKey.json' assert {type: 'json'};
import { googleAPIKey, placeType } from './googleApiKey.js';



import { createRequire } from "module";
const require = createRequire(import.meta.url);
const multer = require('multer');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});


const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, "client/build")));

const checkAuth = (req, res, next) => {
	const idToken = req.headers.authorization;
	if (!idToken) {
		return res.status(403).send('Unauthorized');
	}
	admin.auth().verifyIdToken(idToken)
		.then(decodedToken => {
			req.user = decodedToken.user_id;
			next();
		}).catch(error => {
			res.status(403).send('Unauthorized');
		});
}

app.post('/api/getAllListings', (req, res) => {

	let connection = mysql.createConnection(config);

	const sql = `SELECT 
    p.*, 
    pic.pictureID,
    pic.image,
    pic.thumbnail,
    l.email as landlordEmail,
    (
        SELECT 
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'reviewID', r.reviewID, 
                    'userID', r.userID, 
                    'username', u.firstName, -- Include username from User table
                    'reviewScore', r.reviewScore, 
                    'reviewDescription', r.reviewDescription
                )
            )
        FROM Review r
        LEFT JOIN student_user u ON r.userID = u.userID -- Join with User table to get username
        WHERE p.postingID = r.postingID
    ) AS reviews
FROM 
    Posting p
LEFT JOIN 
    pictures pic ON p.postingID = pic.postingID AND pic.thumbnail = 1
LEFT JOIN
    landlord_user l ON p.landlordID = l.userID;`



	connection.query(sql, (error, results, fields) => {
		if (error) {
			return console.error(error.message);
		}

		results.forEach(listing => {
			if (listing.image) {
				const base64 = listing.image.toString('base64')
				if (base64.startsWith('/9j')) {
					listing.image = `data:image/jpeg;base64,${base64}`
				} else {
					listing.image = `data:png/jpeg;base64,${base64}`
				}

			}
		})


		let string = JSON.stringify(results);

		res.send({ express: string });
	});
	connection.end();
});

app.post('/api/getAllStudents', (req, res) => {

	let connection = mysql.createConnection(config);

	const sql = `SELECT *, CONCAT('[', extraversion, ',', agreeableness, ',', openness, ',', conscientiousness, ',', emotionalStability, ']') AS personality_scores_array  from student_user`



	connection.query(sql, (error, results, fields) => {
		if (error) {
			return console.error(error.message);
		}
		let string = JSON.stringify(results);
		res.send({ express: string });
	});
	connection.end();
});


app.post('/api/getListingImages', (req, res) => {

	const postingID = req.body.postingID

	let connection = mysql.createConnection(config);

	const sql = `select * from pictures where postingID = ${postingID}`



	connection.query(sql, (error, results, fields) => {
		if (error) {
			return console.error(error.message);
		}

		results.forEach(imageData => {
			const base64 = imageData.image.toString('base64')
			if (base64.startsWith('/9j')) {
				imageData.image = `data:image/jpeg;base64,${base64}`
			} else {
				imageData.image = `data:png/jpeg;base64,${base64}`
			}
		})


		let string = JSON.stringify(results);

		res.send({ express: string });
	});
	connection.end();
});

app.post('/api/getResidentData', checkAuth, (req, res) => {

	const postingID = req.body.postingID

	let connection = mysql.createConnection(config);

	const sql = `SELECT t2.*
	FROM Posting t1
	JOIN landlord_user t2 ON FIND_IN_SET(t2.userID, t1.residents) > 0
	WHERE t1.postingID = ${postingID};
	`

	connection.query(sql, (error, results, fields) => {
		if (error) {
			return console.error(error.message);
		}
		let string = JSON.stringify(results);
		res.send({ express: string });
	});
	connection.end();
});

app.post('/api/getUserCriteria', checkAuth, (req, res) => {

	let connection = mysql.createConnection(config);

	const sql = `SELECT 
    userID,
	lookingFor,
	interests,
    CONCAT('[', extraversion, ',', agreeableness, ',', openness, ',', conscientiousness, ',', emotionalStability, ']') AS personality_scores_array
FROM 
    landlord_user
UNION ALL
SELECT 
    userID,
	lookingFor,
	interests,
    CONCAT('[', extraversion, ',', agreeableness, ',', openness, ',', conscientiousness, ',', emotionalStability, ']') AS personality_scores_array
FROM 
    student_user;
`

	connection.query(sql, (error, results, fields) => {
		if (error) {
			return console.error(error.message);
		}
		let string = JSON.stringify(results);
		res.send({ express: string });
	});
	connection.end();
});


app.post('/api/getShortlistIDs', checkAuth, (req, res) => {

	let connection = mysql.createConnection(config);
	let userToken = req.user

	//auth.verifyIdToken(userToken)
	//.then((decodedToken) => {
	const uid = req.user;

	const sql = `SELECT postingID FROM Shortlist
		WHERE Shortlist.userID = '${uid}';`;

	connection.query(sql, (error, results, fields) => {
		if (error) {
			let error_string = JSON.stringify(error);
			res.send({ express: error_string })
			return console.error(error.message);
		}
		let string = JSON.stringify(results);
		res.send({ express: string });
	});
	connection.end();
})


app.post('/api/getShortlist', checkAuth, (req, res) => {

	let connection = mysql.createConnection(config);
	let userToken = req.body.userToken

	//auth.verifyIdToken(userToken)
	//.then((decodedToken) => {
	const uid = req.user;

	const sql = `
			SELECT 
				p.*, 
				pic.pictureID,
				pic.image,
				pic.thumbnail,
				(
					SELECT 
						JSON_ARRAYAGG(
							JSON_OBJECT(
								'reviewID', r.reviewID, 
								'userID', r.userID, 
								'username', u.firstName, -- Include username from User table
								'reviewScore', r.reviewScore, 
								'reviewDescription', r.reviewDescription
							)
						)
					FROM Review r
					LEFT JOIN student_user u ON r.userID = u.userID -- Join with User table to get username
					WHERE p.postingID = r.postingID
				) AS reviews
			FROM 
				Posting p
			LEFT JOIN 
				pictures pic ON p.postingID = pic.postingID AND pic.thumbnail = 1
			WHERE
				p.postingID IN (SELECT postingID FROM Shortlist WHERE userID = '${uid}');`;

	connection.query(sql, (error, results, fields) => {
		if (error) {
			let error_string = JSON.stringify(error);
			res.send({ express: error_string })
			return console.error(error.message);
		}
		results.forEach(listing => {
			if (listing.image) {
				const base64 = listing.image.toString('base64')
				if (base64.startsWith('/9j')) {
					listing.image = `data:image/jpeg;base64,${base64}`
				} else {
					listing.image = `data:png/jpeg;base64,${base64}`
				}

			}
		})
		let string = JSON.stringify(results);
		res.send({ express: string });
	});
	connection.end();
})

//gets all postings uploaded by a landlord
app.post('/api/MyListings', checkAuth, (req, res) => {

	let connection = mysql.createConnection(config);

	const uid = req.user;

	const sql = `SELECT 
			p.*, 
			pic.pictureID,
			pic.image,
			pic.thumbnail,
			(
				SELECT 
					JSON_ARRAYAGG(
						JSON_OBJECT(
							'reviewID', r.reviewID, 
							'userID', r.userID, 
							'reviewScore', r.reviewScore, 
							'reviewDescription', r.reviewDescription
						)
					)
				FROM Review r
				WHERE p.postingID = r.postingID
			) AS reviews
		FROM 
			Posting p
		LEFT JOIN 
			pictures pic ON p.postingID = pic.postingID AND pic.thumbnail = 1
		where landlordID = '${uid}'`;

	connection.query(sql, (error, results, fields) => {
		if (error) {
			let error_string = JSON.stringify(error);
			res.send({ express: error_string })
			return console.error(error.message);
		}
		results.forEach(listing => {
			if (listing.image) {
				const base64 = listing.image.toString('base64')
				if (base64.startsWith('/9j')) {
					listing.image = `data:image/jpeg;base64,${base64}`
				} else {
					listing.image = `data:png/jpeg;base64,${base64}`
				}
			}
		})
		let string = JSON.stringify(results);
		res.send({ express: string });
	})
	connection.end();
})

app.post('/api/getMyListingCriteria', checkAuth, (req, res) => {
	let connection = mysql.createConnection(config);

	const uid = req.user;

	let sql = `SELECT u.userID, u.interests, u.lookingFor, CONCAT('[', extraversion, ',', agreeableness, ',', openness, ',', conscientiousness, ',', emotionalStability, ']') AS personality_scores_array
	FROM Posting p
	JOIN landlord_user u ON p.residents LIKE CONCAT('%', u.userID, '%')
	WHERE p.landlordID = '${uid}';`

	connection.query(sql, (error, results, fields) => {
		if (error) {
			let error_string = JSON.stringify(error);
			res.send({ express: error_string })
			return console.error(error.message);
		}
		let string = JSON.stringify(results);
		res.send({ express: string });
	})
	connection.end();


})


app.post('/api/editListing', checkAuth, (req, res) => {

	let connection = mysql.createConnection(config);

	const title = req.body.data.title
	const description = req.body.data.description
	const termLength = req.body.data.termLength
	const price = req.body.data.price
	const address = req.body.data.address
	const postingID = req.body.data.postingID

	let sql = `UPDATE Posting 
	SET title = '${title}', description = '${description}', length = '${termLength}', Price = ${price}, address = '${address}'
	WHERE postingID = ${postingID}`

	connection.query(sql, (error, results, fields) => {
		if (error) {
			let error_string = JSON.stringify(error);
			res.send({ express: error_string })
			return console.error(error.message);
		}
		let string = JSON.stringify("success");
		res.send({ express: string });
	})
	connection.end();




});


app.post('/api/removeListing', checkAuth, (req, res) => {

	let postingID = req.body.postingID
	let landlordID = req.body.landlordID
	let connection = mysql.createConnection(config);
	const uid = req.user;


	let sql = `DELETE FROM Posting
			WHERE Posting.postingID = '${postingID}';`

	if (uid == landlordID) {
		connection.query(sql, (error, results, fields) => {
			if (error) {
				let error_string = JSON.stringify(error);
				res.send({ express: error_string })
				return console.error(error.message);
			}
			let string = JSON.stringify(results);

		})

		sql = `DELETE FROM pictures
				WHERE pictures.postingID = '${postingID}'`;

		connection.query(sql, (error, results, fields) => {
			if (error) {
				let error_string = JSON.stringify(error);
				res.send({ express: error_string })
				return console.error(error.message);
			}
			let string = JSON.stringify(results);

		})

		sql = `DELETE FROM Review
				WHERE Review.postingID = '${postingID}'`;

		connection.query(sql, (error, results, fields) => {
			if (error) {
				let error_string = JSON.stringify(error);
				res.send({ express: error_string })
				return console.error(error.message);
			}
			let string = JSON.stringify(results);
			res.send({ express: string })
		})
		connection.end();
	}
})

app.post('/api/signUp', checkAuth, (req, res) => {

	const role = req.body.user.role
	const email = req.body.user.email
	const firstName = req.body.user.firstName
	const lastName = req.body.user.lastName
	const age = req.body.user.age
	const gender = req.body.user.gender
	const program = req.body.user.program
	const year = req.body.user.year
	const lookingFor = req.body.user.lookingFor
	const interests = req.body.user.interests
	const extraversion = req.body.user.extraversion
	const agreeableness = req.body.user.agreeableness
	const conscientiousness = req.body.user.conscientiousness
	const emotionalStability = req.body.user.emotionalStability
	const openness = req.body.user.openness
	const uid = req.user;

	let connection = mysql.createConnection(config);

	let user_table_destination = ''
	role == "Student" ? user_table_destination = 'student_user' : user_table_destination = 'landlord_user'

	const sql = `INSERT INTO  ${user_table_destination} (email, userID, firstName, lastName, age, gender, program, year, lookingFor, interests, 
		extraversion, agreeableness, conscientiousness, emotionalStability, openness) 
	VALUES ("${email}", "${uid}", "${firstName}", "${lastName}", ${age}, "${gender}", "${program}", '${year}', '${lookingFor}', '${interests}', 
	${extraversion}, ${agreeableness}, ${conscientiousness}, ${emotionalStability}, ${openness} );`;

	connection.query(sql, (error, results, fields) => {
		if (error) {
			let error_string = JSON.stringify(error);
			res.send({ express: error_string })
			return console.error(error.message);
		}
		let string = JSON.stringify(results);
		res.send({ express: string });
	});
	connection.end();
})


app.post('/api/signIn', checkAuth, (req, res) => {

	const userToken = req.body.userToken

	let connection = mysql.createConnection(config);



	//auth.verifyIdToken(userToken)
	//.then((decodedToken) => {
	const uid = req.user;

	let sql = `Select userID, email, password from student_user UNION
	SELECT userID, email, password FROM landlord_user 
	where userID=${uid}"`;

	connection.query(sql, (error, results, fields) => {
		if (error) {
			let error_string = JSON.stringify(error);
			res.send({ express: error_string })
			return console.error(error.message);
		}
		let string = JSON.stringify(results);
		res.send({ express: user });
	});
	connection.end();
})



app.post('/api/getUser', checkAuth, (req, res) => {

	let connection = mysql.createConnection(config);

	const uid = req.user;

	let sql = `select * from (
				SELECT 
					'Student' AS userRole,
					userID,
					firstName,
					lastName
				FROM 
					student_user
				union
				select 
					'Landlord' AS userRole,
					userID,
					firstName,
					lastName
				FROM 
					landlord_user
					) as data
					where userID = '${uid}'
			`;

	connection.query(sql, (error, results, fields) => {
		if (error) {
			let error_string = JSON.stringify(error);
			res.send({ express: error_string })
			return console.error(error.message);
		}
		let string = JSON.stringify(results);
		res.send({ express: string });
	});
	connection.end();
})


//configure multer for image upload
const storage = multer.memoryStorage();
const upload = multer();
app.use(upload.array('pictures'));

app.post('/api/uploadPostingData', checkAuth, (req, res) => {
	const uid = req.user
	const title = req.body.title
	const description = req.body.description
	const termLength = req.body.termLength
	const semester = req.body.semester
	const price = req.body.price
	const address = req.body.address
	const residents = req.body.residents
	const map = req.body.placesMap

	const images = req.files;

	let connection = mysql.createConnection(config);


	// Insert posting metadata
	const postDataSQL = `INSERT INTO Posting (Price, length, landlordID, description, semester, title, address, residents, map)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
	const postDataValues = [price, termLength, uid, description, semester, title, address, residents, map];

	connection.query(postDataSQL, postDataValues, (postError, postResults) => {
		if (postError) {
			console.error('Error saving posting metadata:', postError);
			res.status(500).send(postError);
		} else {
			const postingID = postResults.insertId; // Get the auto-generated postingID

			// Insert picture data with the retrieved postingID
			let isFirstImage = true; //tells first image as thumbnail
			for (const image of images) {
				const imageBuffer = image.buffer;
				const thumbnail = isFirstImage ? true : false;
				const pictureSQL = `INSERT INTO pictures (postingID, image, thumbnail) VALUES (?, ?, ?)`;
				const pictureValues = [postingID, imageBuffer, thumbnail];

				connection.query(pictureSQL, pictureValues, (pictureError, pictureResults) => {
					if (pictureError) {
						console.error('Error saving image:', pictureError);
						res.status(500).send(pictureError);
					} else {
						console.log('Image saved successfully');
					}
				});
				isFirstImage = false;
			}
		}

	});
	let results = JSON.stringify('success');
	res.status(200).send({ express: results })
});

app.post('/api/addResident', checkAuth, (req, res) => {

	const email = req.body.email

	let connection = mysql.createConnection(config);
	let sql = `select userID, firstName, lastName, email from landlord_user where email="${email}"`

	connection.query(sql, (error, results, fields) => {
		if (error) {
			let error_string = JSON.stringify(error);
			res.send({ express: error_string })
			return console.error(error.message);
		}
		let string = JSON.stringify(results);
		res.send({ express: string });
	});
	connection.end();



})




app.post('/api/addToShortlist', checkAuth, (req, res) => {

	const postingID = req.body.data.postingID


	let connection = mysql.createConnection(config);

	const uid = req.user;
	const sql = `insert into Shortlist (userID, postingID) values ('${uid}', '${postingID}')`;

	connection.query(sql, (error, results, fields) => {
		if (error) {
			let error_string = JSON.stringify(error);
			res.send({ express: error_string })
			return console.error(error.message);
		}
		let string = JSON.stringify(results);
		res.send({ express: string });
	});
	connection.end();
})

app.post('/api/removeFromShortlist', checkAuth, (req, res) => {

	const userToken = req.body.data.userToken
	const postingID = req.body.data.postingID

	let connection = mysql.createConnection(config);

	//auth.verifyIdToken(userToken)
	//.then((decodedToken) => {
	const uid = req.user;

	const sql = `DELETE FROM Shortlist
			WHERE postingID = ${postingID}`;

	connection.query(sql, (error, results, fields) => {
		if (error) {
			let error_string = JSON.stringify(error);
			res.send({ express: error_string })
			return console.error(error.message);
		}
		let string = JSON.stringify(results);
		res.send({ express: string });
	});
	connection.end();
})


app.post('/api/postReview', checkAuth, (req, res) => {

	const userToken = req.body.userToken
	const postingID = req.body.postingID
	const reviewScore = req.body.rating
	const reviewDescription = req.body.description

	let connection = mysql.createConnection(config);

	const uid = req.user;

	const sql = `insert into Review (userID, postingID, reviewScore, reviewDescription)
			values ('${uid}','${postingID}', '${reviewScore}', '${reviewDescription}')`;

	connection.query(sql, (error, results, fields) => {
		if (error) {
			let error_string = JSON.stringify(error);
			res.send({ express: error_string })
			return console.error(error.message);
		}
		let string = JSON.stringify(results);
		res.send({ express: string });
	});
	connection.end();
})

app.post('/api/postingSwiped', checkAuth, (req, res) => {

	const postingID = req.body.postingID
	const uid = req.user;

	let connection = mysql.createConnection(config);

	const sql = `insert into student_swipes (studentID, postingID)
			values ('${uid}','${postingID}')`;

	connection.query(sql, (error, results, fields) => {
		if (error) {
			let error_string = JSON.stringify(error);
			res.send({ express: error_string })
			return console.error(error.message);
		}
		let string = JSON.stringify(results);
		res.send({ express: string });
	});
	connection.end();
})

app.post('/api/studentSwiped', checkAuth, (req, res) => {

	const studentID = req.body.studentID
	const uid = req.user;

	let connection = mysql.createConnection(config);

	const sql = `insert into landlord_swipes (landlordID, studentID)
			values ('${uid}','${studentID}')`;

	connection.query(sql, (error, results, fields) => {
		if (error) {
			let error_string = JSON.stringify(error);
			res.send({ express: error_string })
			return console.error(error.message);
		}
		let string = JSON.stringify(results);
		res.send({ express: string });
	});
	connection.end();
})

app.post('/api/getListingSwipes', checkAuth, (req, res) => {

	const uid = req.user;

	let connection = mysql.createConnection(config);

	const sql = `SELECT postingID
	FROM student_swipes
	WHERE studentID = '${uid}';`;

	connection.query(sql, (error, results, fields) => {
		if (error) {
			let error_string = JSON.stringify(error);
			res.send({ express: error_string })
			return console.error(error.message);
		}
		let string = JSON.stringify(results);
		res.send({ express: string });
	});
	connection.end();
})

app.post('/api/getStudentSwipes', checkAuth, (req, res) => {

	const uid = req.user;

	let connection = mysql.createConnection(config);

	const sql = `SELECT *
	FROM landlord_swipes
	WHERE landlordID = '${uid}';`;

	connection.query(sql, (error, results, fields) => {
		if (error) {
			let error_string = JSON.stringify(error);
			res.send({ express: error_string })
			return console.error(error.message);
		}
		let string = JSON.stringify(results);
		res.send({ express: string });
	});
	connection.end();
})

app.post('/api/getLandlordMatches', checkAuth, (req, res) => {

	const uid = req.user;

	let connection = mysql.createConnection(config);

	const sql = `SELECT DISTINCT l.landlordID, s.studentID
	FROM Posting p
	INNER JOIN student_swipes s ON p.postingID = s.postingID
	INNER JOIN landlord_swipes l ON p.landlordID = l.landlordID AND l.studentID = s.studentID
	where l.landlordID = '${uid}';`

	connection.query(sql, (error, results, fields) => {
		if (error) {
			let error_string = JSON.stringify(error);
			res.send({ express: error_string })
			return console.error(error.message);
		}
		let string = JSON.stringify(results);
		res.send({ express: string });
	});
	connection.end();
})

app.post('/api/getStudentMatches', checkAuth, (req, res) => {

	const uid = req.user;

	let connection = mysql.createConnection(config);

	const sql = `SELECT
    p.postingID 
FROM
    student_swipes ss
JOIN
    landlord_swipes ls ON ss.studentID = ls.studentID
JOIN
    Posting p ON ss.postingID = p.postingID
WHERE
    ss.studentID = '${uid}'
    AND EXISTS (
        SELECT 1
        FROM landlord_swipes ls2
        WHERE ls2.studentID = ss.studentID
          AND ls2.landlordID = p.landlordID
    );`


	connection.query(sql, (error, results, fields) => {
		if (error) {
			let error_string = JSON.stringify(error);
			res.send({ express: error_string })
			return console.error(error.message);
		}
		let string = JSON.stringify(results);
		res.send({ express: string });
	});
	connection.end();
})



app.listen(port, () => console.log(`Listening on port ${port}`)); //for the dev version
