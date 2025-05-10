const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, DeleteCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = 'Events';

class EventDynamo {
  static async create(eventData) {
    const params = {
      TableName: TABLE_NAME,
      Item: {
        id: Date.now().toString(), // Using timestamp as ID
        ...eventData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };

    await docClient.send(new PutCommand(params));
    return params.Item;
  }

  static async getAll() {
    const params = {
      TableName: TABLE_NAME
    };

    const result = await docClient.send(new ScanCommand(params));
    return result.Items;
  }

  static async getByEmail(email) {
    const params = {
      TableName: TABLE_NAME,
      IndexName: 'RegistrationEmailIndex',
      KeyConditionExpression: 'registration.email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    };

    const result = await docClient.send(new QueryCommand(params));
    return result.Items;
  }

  static async delete(id) {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        id: id
      }
    };

    await docClient.send(new DeleteCommand(params));
    return { id };
  }
}

module.exports = EventDynamo; 