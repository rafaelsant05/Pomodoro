import { useEffect } from 'react';
import { Container } from '../../components/Container';
import { CountDown } from '../../components/CountDown';
import { MainForm } from '../../components/MainForm';
import { MainTemplate } from '../../templates/MainTemplate';
import { useAuthContext } from '../../contexts/TaskContext/AuthContext/useAuthContext';

export function Home() {
  const { user } = useAuthContext();

  useEffect(() => {
    document.title = 'Chronos Pomodoro';
  }, []);

  return (
    <MainTemplate>
      <Container>
        {user && (
          <p style={{ textAlign: 'center', marginBottom: '0.5rem', opacity: 0.8 }}>
            Bem-vindo, <strong>{user.name}</strong>!
          </p>
        )}
        <CountDown />
      </Container>
      <Container>
        <MainForm />
      </Container>
    </MainTemplate>
  );
}
