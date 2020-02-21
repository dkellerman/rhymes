import React from 'react';
import Link from 'next/link';

type NavBarProps = {
  children?: React.ReactNode;
};

export const NavBar: React.FC<NavBarProps> = ({
  children,
}) => {
  return (
    <header>
      <nav className="split-nav fixed">
        <div className="nav-brand">
          <h3>Rhymes</h3>
        </div>

        <div>
          {children}
        </div>

        <div className="collapsible">
          <input id="collapsible1" type="checkbox" name="collapsible1" />
          <button>
            <label htmlFor="collapsible1">
              <div className="bar1"></div>
              <div className="bar2"></div>
            </label>
          </button>
          <div className="collapsible-body">
            <ul className="inline">
              <li><Link href="/stats"><a>Stats</a></Link> &#183;</li>
              <li><a href="https://github.com/dkellerman/rhymes" target="_blank">Github</a></li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
