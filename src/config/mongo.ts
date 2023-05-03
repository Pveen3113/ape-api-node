import { connect } from "mongoose";

export const initializeMongoDB = async () => {
  await connect(
    "mongodb+srv://Admin:YmkiL5cRDCcGoS1f@hackathon.tzsu8kv.mongodb.net/?retryWrites=true&w=majority"
  );
};
