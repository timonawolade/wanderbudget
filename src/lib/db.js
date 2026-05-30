// AWS DynamoDB integration for saving & sharing trip itineraries
// Built for the H0: Hack the Zero Stack hackathon (Vercel v0 + AWS Databases)

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { awsCredentialsProvider } from "@vercel/functions/oidc";

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME;
const PARTITION_KEY = process.env.DYNAMODB_TABLE_PARTITION_KEY || "tripId";
const SORT_KEY = process.env.DYNAMODB_TABLE_SORT_KEY || "createdAt";
const REGION = process.env.AWS_REGION;

let docClient = null;

function getClient() {
  if (docClient) return docClient;
  const client = new DynamoDBClient({
    region: REGION,
    credentials: awsCredentialsProvider({
      roleArn: process.env.AWS_ROLE_ARN,
      clientConfig: { region: REGION },
    }),
  });
  docClient = DynamoDBDocumentClient.from(client);
  return docClient;
}

function generateTripId() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < 10; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

export async function saveTrip(tripData) {
  const client = getClient();
  const tripId = generateTripId();
  const createdAt = new Date().toISOString();

  const item = {
    [PARTITION_KEY]: tripId,
    [SORT_KEY]: createdAt,
    plan: tripData.plan,
    budget: tripData.budget,
    currency: tripData.currency,
    currencySymbol: tripData.currencySymbol,
    origin: tripData.origin,
    destination: tripData.destination || "",
    destMode: tripData.destMode,
    style: tripData.style,
    vibes: tripData.vibes || [],
    hasLiveData: Boolean(tripData.hasLiveData),
  };

  await client.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
    })
  );

  return tripId;
}

export async function getTrip(tripId) {
  const client = getClient();

  const res = await client.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "#pk = :pk",
      ExpressionAttributeNames: { "#pk": PARTITION_KEY },
      ExpressionAttributeValues: { ":pk": tripId },
      Limit: 1,
    })
  );

  return res.Items?.[0] || null;
}