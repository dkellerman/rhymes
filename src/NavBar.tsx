import React from 'react';
import Link from 'next/link';
import { NavBarWrapper } from './index.styles';

export const NavBar: React.FC = () => {
  return (
    <NavBarWrapper>
      <nav className="split-nav fixed">
        <div className="nav-brand">
          <h3><Link href="/"><a>Songisms</a></Link></h3>
        </div>

        <div className="collapsible">
          <input id="collapsible1" type="checkbox" name="collapsible1" />
          <button>
            <label htmlFor="collapsible1">
              <div className="bar1"></div>
              <div className="bar2"></div>
              <div className="bar3"></div>
            </label>
          </button>
          <div className="collapsible-body">
            <ul className="inline">
              <li><Link href="/"><a>Rhymes</a></Link> &#183;</li>
              <li><Link href="/stats"><a>Stats</a></Link> &#183;</li>
              <li><a href="https://github.com/dkellerman/rhymes" target="_blank">Github</a></li>
            </ul>
          </div>
        </div>
      </nav>
    </NavBarWrapper>
  );
}
