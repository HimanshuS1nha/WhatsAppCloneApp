import { connect } from "mongoose";

const connectToDatabase = () => {
  return connect(process.env.DB_URL!);
};

export default connectToDatabase;
