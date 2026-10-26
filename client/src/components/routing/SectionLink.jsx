import { Link, useLocation } from 'react-router-dom';
import { scrollToSection, splitPathAndHash } from '../../utils/scrollToSection.js';

export default function SectionLink({ to, children, className, onClick, ...rest }) {
  const location = useLocation();

  const handleClick = (event) => {
    if (onClick) {
      onClick(event);
    }
    if (event.defaultPrevented) {
      return;
    }

    const { pathname, hash } = splitPathAndHash(to);
    if (!hash) {
      return;
    }

    const currentPath = location.pathname.replace(/\/$/, '') || '/';
    const targetPath = pathname.replace(/\/$/, '') || '/';

    if (targetPath === currentPath) {
      event.preventDefault();
      scrollToSection(hash);
      window.history.replaceState(null, '', `${targetPath}#${hash}`);
    }
  };

  return (
    <Link to={to} className={className} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
