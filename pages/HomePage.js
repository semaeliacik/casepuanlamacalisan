import React, { useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/router';
import styles from '../src/style.module.css';

const GET_EMPLOYEES = gql`
  query {
    employees {
      id
      firstName
      lastName
      position
      votes
    }
  }
`;

const VOTE_EMPLOYEE = gql`
  mutation VoteEmployee($id: ID!) {
    vote(id: $id) {
      id
      votes
    }
  }
`;

const HomePage = () => {
  const { loading, error, data, refetch } = useQuery(GET_EMPLOYEES);
  const [voteEmployee] = useMutation(VOTE_EMPLOYEE);
  const router = useRouter();

  useEffect(() => {
    refetch();
  }, []);

  const handleVote = async (id) => {
    try {
      await voteEmployee({ variables: { id } });
      refetch();
    } catch (error) {
      console.error('Oy verme hatası:', error);
    }
  };

  const handleEmployeeClick = (id) => {
    router.push(`/employee/${id}`);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const sortedEmployees = [...data.employees];
  sortedEmployees.sort((a, b) => b.votes - a.votes);

  return (
    <div className={styles.myContainer}>
      <h1>Şirket Çalışanları</h1>
      <ul>
        {sortedEmployees.map((employee) => (
          <li className={styles.employeeCard} key={employee.id}>
            <a onClick={() => handleEmployeeClick(employee.id)}>
              <h3 className={styles.employeeName}>{`${employee.firstName} ${employee.lastName}`}</h3>
            </a>
            <p className={styles.employeePosition}>{employee.position}</p>
            <p>Çalışan Toplam Puanı: {employee.votes}</p>
            <button className={styles.voteButton} onClick={() => handleVote(employee.id)}>
              OY VER
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
