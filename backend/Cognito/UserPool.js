import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: "us-east-1_OsxpFQc4G",
  ClientId: "5d1301df0ffvu92a3ceq9b5kv"
}

export default new CognitoUserPool(poolData)