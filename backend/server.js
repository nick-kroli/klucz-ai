// backend/local.js


const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const PORT = process.env.PORT || 3001;
const { CognitoUserPool, CognitoUser, AuthenticationDetails, CognitoUserAttribute } = require('amazon-cognito-identity-js');

const SECRET_KEY = 'iamcurrentlyinamilanhotelroom';

app.use(express.json());
app.use(cors());

const poolData = {
  UserPoolId: "us-east-1_OsxpFQc4G",
  ClientId: "5d1301df0ffvu92a3ceq9b5kv"
};

const userPool = new CognitoUserPool(poolData);

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

app.post('/api/authenticate', async (req, res) => {
  const { Username, Password } = req.body;
  const user = new CognitoUser({ Username, Pool: userPool });
  const authDetails = new AuthenticationDetails({ Username, Password });

  

  user.authenticateUser(authDetails, {
    onSuccess: (result) => {
      user.getSession((err, session) => {
        if (err) {
          res.status(400).json({ message: 'Failed to get session' });
        } else {
          const token = jwt.sign({username: Username}, SECRET_KEY, {expiresIn: '1h'});
          // const tokenDecoded = jwt.verify(token, SECRET_KEY);
          // console.log("SERVER SIDE TOKEN DECODED: ", tokenDecoded);
          res.status(200).json([session, token]);
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


app.post('/api/logout', async (req, res) => {

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try{
    // console.log("GETS HERE");
    const decoded = jwt.verify(token, SECRET_KEY);
    const username = decoded.username;
    console.log("token user: ", username);
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


app.get('/api/resource', (req, res) => {
  res.json({ message: 'Hello from Express.js!' });
  console.log("test GET received")
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
