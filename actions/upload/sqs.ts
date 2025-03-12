
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { v4 as uuid } from 'uuid';

const region = process.env.NEXT_PUBLIC_AWS_REGION;
const accessKeyId = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY;
const queueUrl = process.env.NEXT_PUBLIC_AWS_SQS_URL;
if (!region || !accessKeyId || !secretAccessKey) {
  throw new Error('Missing AWS configuration');
}

const sqsClient = new SQSClient({ 
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
});
interface MessageBody {
    id: string;
    noOfVisa: number;
    [key: string]: string | number;
  }

// Function to send a message to SQS queue
export async function sendMessageToQueue( messageBody:MessageBody) {
  try {
    const params = {
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(messageBody),
      MessageGroupId: 'visa-applications', // Required for FIFO queues
      MessageDeduplicationId: uuid(), // Unique ID for message deduplication
    };
    // Send the message
    const command = new SendMessageCommand(params);
    const response = await sqsClient.send(command);


  

    return response;
  } catch (error) {
    console.error('Error sending message to SQS:', error);
    throw error;
  }
}


