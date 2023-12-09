import { ApolloServer, gql } from "apollo-server-cloud-functions";
import { connect } from "mongoose";
import { config } from "dotenv";
import Post from "./models/post.js";
config();

const typeDefs = gql`
  type Post {
    title: String!
    content: String!
  }

  type Query {
    posts: [Post]
  }

  type Mutation {
    createPost(title: String!, content: String!): Post
  }
`;

const resolvers = {
  Query: {
    posts: async () => await Post.find(),
  },
  Mutation: {
    createPost: async (
      _: unknown,
      { title, content }: { title: string; content: string }
    ) => {
      try {
        console.log("Received mutation with parameters:", { title, content });

        const post = new Post({ title, content });
        await post.save();

        return post; // Return the created post
      } catch (error) {
        console.error("Error creating post:", error);
        throw new Error("Error creating post");
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
});

const connectionString = process.env.MONGODB_CONNECTION_STRING;
if (!connectionString) {
  throw new Error("MONGODB_CONNECTION_STRING not set");
}

// Connect to MongoDB
connect(connectionString)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

export const graphqlHandler = server.createHandler();
