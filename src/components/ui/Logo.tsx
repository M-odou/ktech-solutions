import Image from 'next/image';
import logo from '../../../public/brand/logo-ktech.png';
import logoWhite from '../../../public/brand/logo-ktech-white.png';

/**
 * Logo officiel : version blanche en thème sombre, version couleur en thème clair.
 * Les deux sont rendues ; le CSS (`[data-theme]`) n'affiche que la bonne, sans flash.
 */
export function Logo({ priority = false, className = '' }: { priority?: boolean; className?: string }) {
  return (
    <span className={`logo ${className}`}>
      <Image src={logoWhite} alt="KTech Solutions" className="logo-on-dark" priority={priority} sizes="160px" />
      <Image src={logo} alt="" aria-hidden="true" className="logo-on-light" priority={priority} sizes="160px" />
    </span>
  );
}
