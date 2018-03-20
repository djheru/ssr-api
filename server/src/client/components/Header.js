import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const Header = ({ auth }) => {
  console.log('auth: ', auth);

  const authButton = (auth) ?
    (
      <a href="/auth/logout">Logout</a>
    ) :
    (
      <a href="/auth/google">Login</a>
    );

  return (
    <nav>
      <div className="nav-wrapper">
      <Link className="brand-logo" to="/">React SSR</Link>
      <ul className="right">
        <li><Link to="/todos">Todos</Link></li>
        <li>{ authButton }</li>
      </ul>
    </div>
    </nav>
  )
};

const mapStateToProps = ({ auth }) => ({ auth });

export default connect(mapStateToProps)(Header);
