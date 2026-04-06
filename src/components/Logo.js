import React from 'react';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="ghf-logo">
      <span className="ghf-logo-main">Girl&apos;s Have Fun</span>
      <div className="ghf-logo-divider" />
      <div className="ghf-logo-sub-wrap">
        <div className="ghf-logo-dash" />
        <span className="ghf-logo-sub">Paris</span>
        <div className="ghf-logo-dash right" />
      </div>
    </Link>
  );
}
