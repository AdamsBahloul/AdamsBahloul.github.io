import Container from '../../common/Container/Container';
import styles from './Footer.module.scss';

export default function Footer() {
  return <footer className={styles.footer}><Container><p>© {new Date().getFullYear()} — Personal portfolio</p></Container></footer>;
}
