import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { ApolloProvider, ApolloClient, InMemoryCache, useQuery, gql } from '@apollo/client';
import styles from '../../src/style.module.css';

const client = new ApolloClient({
  uri: '/api/graphql',
  cache: new InMemoryCache(),
});

const GET_EMPLOYEE = gql`
  query GetEmployee($id: ID!) {
    employee(id: $id) {
      id
      firstName
      lastName
      position
      email
      votes
      address
      phone
    }
  }
`;

const EmployeePage = () => {
  const router = useRouter();
  const { id } = router.query;

  const { loading, error, data, subscribeToMore } = useQuery(GET_EMPLOYEE, {
    variables: { id: id || '' },
  });

  useEffect(() => {
    if (error) {
      // Yönlendirme hatası olduğunda burada uygun bir işlem yapabilirsiniz.
      console.error('Yönlendirme hatası:', error);
    }
  }, [error]);

  useEffect(() => {
    if (data && data.employee) {
      const unsubscribe = subscribeToMore({
        document: GET_EMPLOYEE,
        variables: { id },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          return {
            ...prev,
            employee: subscriptionData.data.employee,
          };
        },
      });

      return () => unsubscribe();
    }
  }, [data, id, subscribeToMore]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const employee = data?.employee;

  return (
    <div className={styles.employeeDetails}>
      <h1>Çalışan Detayları</h1>
      {
        <div>
          <h2 className={styles.employeeName}>{`${employee.firstName} ${employee.lastName}`}</h2>
          <p className={styles.employeePosition}>Pozisyon: {employee.position}</p>
          <p className={styles.employeeEmail}>Email: {employee.email}</p>
          <p className={styles.employeeVotes}>Çalışan Toplam Puanı: {employee.votes}</p>
          <p className={styles.employeeAddress}>Adres: {employee.address}</p>
          <p className={styles.employeePhone}>Telefon: {employee.phone}</p>
        </div>
      }
    </div>
  );
};

const App = () => (
  <ApolloProvider client={client}>
    <EmployeePage />
  </ApolloProvider>
);

export default App;
