// backend/local.js
require('dotenv').config();
// console.log("ACCESS KEY: ", process.env.AWS_ACCESS_KEY_ID);

const AWS = require('aws-sdk');

const { v4: uuidv4 } = require('uuid');
const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');

const PORT = process.env.PORT || 3001;
const { CognitoUserPool, CognitoUser, AuthenticationDetails, CognitoUserAttribute } = require('amazon-cognito-identity-js');

const SECRET_KEY = 'iamcurrentlyinamilanhotelroom';

app.use(express.json());
app.use(cors());

const poolData = {
  UserPoolId: "us-east-1_OsxpFQc4G",
  ClientId: "5d1301df0ffvu92a3ceq9b5kv"
};

AWS.config.update({
  region: 'us-east-1', // Update to your region
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Set these in your environment variables
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY // Set these in your environment variables
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const userPool = new CognitoUserPool(poolData);


//HELPER FUNCTON FOR GETTING NUMBER OF ENTRIES
const getManagedAppsSize = async (username) => {
  const params = {
    TableName: 'klucz-ai-passwordTestTable',
    Key: {
      username: username
    }
  };
  try {
    const data = await dynamoDb.get(params).promise();
    // console.log("GETS HERE: ", data);
    if (data.Item && data.Item['managed-apps']) {
      // console.log("YES IT EXISTS: ", data.Item['managed-apps'].Object.length);
      managed_apps = data.Item['managed-apps'];
      const managedAppsSize = Object.keys(managed_apps[0]).length;
      // console.log("APP SIZE: ", managedAppsSize);
      return managedAppsSize;
    } else {
      return 0; // Return 0 if "managed-apps" does not exist or is empty
    }
  } catch (err) {
    console.error('Error retrieving item:', err);
    throw err;
  }
};

//AUTHENTICATES THE USER ATTEMPTING TO LOG, CHECKS FOR NEW OR RETURNING
app.post('/api/authenticate', async (req, res) => {
  const { Username, Password } = req.body;
  const user = new CognitoUser({ Username, Pool: userPool });
  const authDetails = new AuthenticationDetails({ Username, Password });
  var new_user = true;

  user.authenticateUser(authDetails, {
    onSuccess: (result) => {
      user.getSession(async (err, session) => {
        if (err) {
          res.status(400).json({ message: 'Failed to get session' });
        } else {
          const token = jwt.sign({username: Username}, SECRET_KEY, {expiresIn: '1h'});
          // const tokenDecoded = jwt.verify(token, SECRET_KEY);
          // console.log("SERVER SIDE TOKEN DECODED: ", tokenDecoded);

          const num_entries = await getManagedAppsSize(Username);
          // console.log("NUM ENTRIES:   ", num_entries);
          if(num_entries != 0){
            new_user = false;
          }
          // console.log("NEW USER", new_user);
          res.status(200).json([session, token, new_user]);
        }
      });
    },
    onFailure: (err) => {
      res.status(400).json({ message: err.message || 'Authentication failed' });
    },
    newPasswordRequired: (userAttributes) => {
      res.status(200).json(userAttributes);
    }
  });
});


//HELPER FUNCTION FOR GET SESSION REQUEST
const getSession = (user) => {
  return new Promise((resolve, reject) => {
    user.getSession((err, session) => {
      if (err) {
        reject(err);
      } else {
        resolve(session);
      }
    });
  });
};


//FETCHES THE SESSION
app.get('/api/getSession', async (req, res) => {
  const user = userPool.getCurrentUser();
  if (user) {
    try {
      const session = await getSession(user);
      res.status(200).json(session);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  } else {
    res.status(401).json({ message: 'User not logged in' });
  }
});


//DECODES TOKEN, LOGS OUT USER
app.post('/api/logout', async (req, res) => {
  console.log(req.headers);
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try{
    // console.log("GETS HERE");
    const decoded = jwt.verify(token, SECRET_KEY);
    const username = decoded.username;
    // console.log("token user: ", username);
    const userData = {
      Username: username,
      Pool: userPool
    };
    const cognitoUser = new CognitoUser(userData);
    
    cognitoUser.signOut({
      onSuccess: (result) => {
        console.log('Successfully signed out:', result);
        res.status(200).json({ message: 'Logged out successfully' });
      },
      onFailure: (err) => {
        console.error('Sign out failed:', err);
        res.status(500).json({ message: 'Failed to log out' });
      }
    });

  }catch(err){
    console.error('Token verification failed:', err);
    return res.status(401).json({ message: 'Invalid token' });
  }
});


//RESPONSE FOR CREATING A NEW ACCOUNT, ADDS USERNAME TO DB
app.post('/api/create-account', (req, res) => {
  // console.log("reaches here");
  const { username, password, email } = req.body;

  const attributeList = [
    new CognitoUserAttribute({ Name: 'email', Value: email })
  ];

  userPool.signUp(username, password, attributeList, null, async (err, result) => {
    if (err) {
      console.error("error creating account: ", err);
      return res.status(400).json({ error: err.message });
    } else {
      console.log('Account created successfully:', result.user);
      // Add entry to DynamoDB
      const params = {
        TableName: 'klucz-ai-passwordTestTable', // Replace with your table name
        Item: {
          username: username, // Partition key
        }
      };

      try {
        await dynamoDb.put(params).promise();
        res.status(200).json({ message: 'Account created and entry added to DynamoDB successfully' });
      } catch (dbError) {
        console.error('Error adding entry to DynamoDB:', dbError);
        res.status(500).json({ error: 'Account created but failed to add entry to DynamoDB' });
      }
    }
  });
});


app.post('/api/add-first-managed', (req, res) => {
  const {selectedApps}  = req.body
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const decoded = jwt.verify(token, SECRET_KEY);
  const username = decoded.username;
  // console.log("Adding the following apps: ", selectedApps, "for user: ", username);
});




app.post('/api/get-password-info', async (req, res) => {
  // console.log("AT LEAST GETS HERE");
  // console.log("HEADERS: ", req.headers);
  const token = req.headers.authorization?.split(' ')[1];
  // console.log("TOKEN", token);
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  const decoded = jwt.verify(token, SECRET_KEY);
  const username = decoded.username;

  const params = {
    TableName: 'klucz-ai-passwordTestTable', 
    Key: {
      username: username, 
    }
  };

  try{
    const data = await dynamoDb.get(params).promise();
    managed_apps = data.Item['managed-apps'];
    // console.log(managed_apps);
    res.status(200).json(managed_apps);

  } catch (err){
    console.log(err);
  }

});


// app.post('/api/add-new-password', async (req, res) => {
//   const { application, app_user, encryptedPass } = req.body;
//   // console.log(req.body);
//   // console.log("ENC", encryptedPass);
//   // console.log()
//   const token = req.headers.authorization?.split(' ')[1];


//   if (!token) {
//     return res.status(401).json({ message: 'No token provided' });
//   }
//   try {
//     const decoded = jwt.verify(token, SECRET_KEY);
//     const username = decoded.username;

//     const updateParams = {
//       TableName: 'klucz-ai-passwordTestTable',
//       Key: {
//         username: username,
//       },
//       UpdateExpression: 'SET #managedApps[0].#appName = :encryptedPass',
//       ExpressionAttributeNames: {
//         '#managedApps': 'managed-apps',
//         '#appName': application,
//       },
//       ExpressionAttributeValues: {
//         ':encryptedPass': encryptedPass,
//       },
//       ReturnValues: 'UPDATED_NEW',
//     };

//     await dynamoDb.update(updateParams).promise();
//     res.status(200).json({ message: 'New application password added successfully' });

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: 'Internal server error, error adding app to list' });
//   }
// });


// app.post('/api/add-new-password', async (req, res) => {
//   const { application, app_user, encryptedPass } = req.body;
//   // console.log(req.body);
//   // console.log("ENC", encryptedPass);
//   // console.log()
//   const token = req.headers.authorization?.split(' ')[1];


//   if (!token) {
//     return res.status(401).json({ message: 'No token provided' });
//   }
//   try {
//     const decoded = jwt.verify(token, SECRET_KEY);
//     const username = decoded.username;
//     const today = new Date()
//     let formattedDate = today.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit'
//     });

//     const updateParams = {
//       TableName: 'klucz-ai-passwordTestTable',
//       Key: {
//         username: username,
//       },
//       UpdateExpression: 'SET #managedApps[0].#appName = :encryptedPass',
//       ExpressionAttributeNames: {
//         '#managedApps': 'managed-apps',
//         '#appName': application,
//       },
//       ExpressionAttributeValues: {
//         ':encryptedPass': encryptedPass,
//       },
//       ReturnValues: 'UPDATED_NEW',
//     };

//     await dynamoDb.update(updateParams).promise();
//     res.status(200).json({ message: 'New application password added successfully' });

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: 'Internal server error, error adding app to list' });
//   }
// });

app.post('/api/add-new-password', async (req, res) => {
  
  const { application, app_user, encryptedPass } = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const uniqueId = uuidv4();
    const decoded = jwt.verify(token, SECRET_KEY);
    const username = decoded.username;
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    // Retrieve the current managed apps for the user
    const getParams = {
      TableName: 'klucz-ai-passwordTestTable',
      Key: { username: username }
    };

    const user = await dynamoDb.get(getParams).promise();

    if (!user.Item) {
      return res.status(404).json({ message: 'User not found' });
    }

    let managedApps = user.Item['managed-apps'] || [];

    // Find the index of the managed-apps entry
    let managedAppEntry = managedApps.find(app => app[application]);

    if (managedAppEntry) {
      // Application exists, append the new account
      managedAppEntry[application].push({
        pass_id: uniqueId,
        username: app_user,
        dateAdded: formattedDate,
        lastChangedDate: formattedDate,
        password: encryptedPass
      });
    } else {
      // Application does not exist, create a new entry
      managedApps[0][application] = [{
        pass_id: uniqueId,
        username: app_user,
        dateAdded: formattedDate,
        lastChangedDate: formattedDate,
        password: encryptedPass
      }];
    }

    // Update the managed-apps attribute in DynamoDB
    const updateParams = {
      TableName: 'klucz-ai-passwordTestTable',
      Key: { username: username },
      UpdateExpression: 'SET #managedApps = :updatedApps',
      ExpressionAttributeNames: {
        '#managedApps': 'managed-apps'
      },
      ExpressionAttributeValues: {
        ':updatedApps': managedApps
      },
      ReturnValues: 'UPDATED_NEW'
    };

    await dynamoDb.update(updateParams).promise();
    res.status(200).json({ message: 'New application password added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error, error adding app to list' });
  }
});


app.post('/api/delete-password', async (req, res) => {
  const { pass_id, application } = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  // console.log("do you get in?, received ", pass_id, "and", application);
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const username = decoded.username;
    // console.log('receives user: ', username);
    // Retrieve the current managed apps for the user

    const getParams = {
      TableName: 'klucz-ai-passwordTestTable',
      Key: { username: username }
    };

    const user = await dynamoDb.get(getParams).promise();

    if (!user.Item) {
      return res.status(404).json({ message: 'User not found' });
    }

    let managedApps = user.Item['managed-apps'] || [];

    // Find the application entry
    let managedAppEntry = managedApps[0][application];

    if (!managedAppEntry) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Find the index of the password entry to be deleted
    const passwordIndex = managedAppEntry.findIndex(entry => entry.pass_id === pass_id);

    if (passwordIndex === -1) {
      return res.status(404).json({ message: 'Password entry not found' });
    }

    // Remove the password entry
    managedAppEntry.splice(passwordIndex, 1);

    // If the application has no more passwords, remove the entire application entry
    if (managedAppEntry.length === 0) {
      delete managedApps[0][application];
    }

    // Update the managed-apps attribute in DynamoDB
    const updateParams = {
      TableName: 'klucz-ai-passwordTestTable',
      Key: { username: username },
      UpdateExpression: 'SET #managedApps = :updatedApps',
      ExpressionAttributeNames: {
        '#managedApps': 'managed-apps'
      },
      ExpressionAttributeValues: {
        ':updatedApps': managedApps
      },
      ReturnValues: 'UPDATED_NEW'
    };

    await dynamoDb.update(updateParams).promise();
    res.status(200).json({ message: 'Password entry deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error, error deleting password entry' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

