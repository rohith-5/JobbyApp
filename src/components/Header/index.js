import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import {AiFillHome} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'

class Header extends Component {
  onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = this.props
    history.replace('/login')
  }

  render() {
    return (
      <nav className="nav">
        <Link className="link" to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="nav-img"
          />
        </Link>
        <div className="nav-card">
          <Link className="link" to="/">
            <p className="nav-text">Home</p>
          </Link>
          <Link className="link" to="/jobs">
            <p className="nav-text">Jobs</p>
          </Link>
        </div>
        <button
          className="login-btn nav-btn"
          type="button"
          onClick={this.onClickLogout}
        >
          Logout
        </button>

        <ul className="nav-card-sm">
          <li>
            <Link className="link" to="/">
              <button type="button" className="nav-icon">
                <AiFillHome />
              </button>
            </Link>
          </li>

          <li>
            <Link className="link" to="/jobs">
              <button type="button" className="nav-icon">
                <BsBriefcaseFill />
              </button>
            </Link>
          </li>

          <li>
            <button
              type="button"
              className="nav-icon"
              onClick={this.onClickLogout}
            >
              <FiLogOut />
            </button>
          </li>
        </ul>
      </nav>
    )
  }
}

export default withRouter(Header)
