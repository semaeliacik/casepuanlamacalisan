const { getGraphQLParameters, processRequest, sendResult } = require("graphql-helix");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { graphqlFaker } = require("graphql-faker");




const mocks = require("../../mocks/employee");

const typeDefs = `
  type Employee {
    id: ID!
    firstName: String
    lastName: String
    image: String
    position: String
    votes: Int
    email: String
    address: String
    phone: String
  }

  type Query {
    employees: [Employee]
    employee(id: ID!): Employee
  }

  type Mutation {
    vote(id: ID!): Employee
  }
`;

const resolvers = {
  Query: {
    employees: () => mocks,
    employee: (_, { id }) => mocks.find((employee) => employee.id === id),
  },
  Mutation: {
    vote: (_, { id }) => {
      const employee = mocks.find((employee) => employee.id === id);
      if (employee) {
        employee.votes += 1;
      }
      return employee;
    },
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

module.exports = async (req, res) => {
  const request = {
    body: req.body,
    headers: req.headers,
    method: req.method,
    query: req.query,
  };

  const { operationName, query, variables } = getGraphQLParameters(request);

  const result = await processRequest({
    operationName,
    query,
    variables,
    request,
    schema,
    execute: graphqlFaker, // Use graphqlFaker as the execution function
  });

  sendResult(result, res);
};
