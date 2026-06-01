import {
  HistoryIcon,
  HouseIcon,
  MoonIcon,
  SettingsIcon,
  SunIcon,
  LogOutIcon,
} from 'lucide-react';
import styles from './styles.module.css';
import { useState, useEffect } from 'react';
import { RouterLink } from '../RouterLink';
import { useAuthContext } from '../../contexts/TaskContext/AuthContext/useAuthContext';
import { useNavigate } from 'react-router-dom';

type AvailableThemes = 'dark' | 'light';

export function Menu() {
  const { signOut } = useAuthContext();
  const navigate = useNavigate();

  const [theme, setTheme] = useState<AvailableThemes>(() => {
    const storageTheme = (localStorage.getItem('theme') as AvailableThemes) || 'dark';
    return storageTheme;
  });

  const nextThemeIcon = { dark: <SunIcon />, light: <MoonIcon /> };

  function handleThemeChange(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    event.preventDefault();
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  }

  function handleLogout(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    event.preventDefault();
    signOut();
    navigate('/');
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <nav className={styles.menu}>
      <RouterLink className={styles.menuLink} href='/home' aria-label='Ir para a Home' title='Ir para a Home'>
        <HouseIcon />
      </RouterLink>
      <RouterLink className={styles.menuLink} href='/history' aria-label='Ver Historico' title='Ver Historico'>
        <HistoryIcon />
      </RouterLink>
      <RouterLink className={styles.menuLink} href='/settings' aria-label='Configuracoes' title='Configuracoes'>
        <SettingsIcon />
      </RouterLink>
      <a className={styles.menuLink} href='#' aria-label='Mudar Tema' title='Mudar Tema' onClick={handleThemeChange}>
        {nextThemeIcon[theme]}
      </a>
      <a className={styles.menuLink} href='#' aria-label='Sair' title='Sair' onClick={handleLogout}>
        <LogOutIcon />
      </a>
    </nav>
  );
}
