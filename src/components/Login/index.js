import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

class Login extends Component {
  state = {username: '', password: '', error: '', isError: false}

  onSubmitLogin = async e => {
    e.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      const {history} = this.props

      Cookies.set('jwt_token', data.jwt_token, {expires: 30, path: '/'})
      history.replace('/')
    } else {
      this.setState({error: data.error_msg, isError: true})
    }
  }

  onChangeUsername = e => this.setState({username: e.target.value})

  onChangePassword = e => this.setState({password: e.target.value})

  render() {
    const {username, password, error, isError} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login">
        <form className="login-card" onSubmit={this.onSubmitLogin}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="login-img"
          />
          <label className="label" htmlFor="username">
            USERNAME
          </label>
          <input
            className="input"
            placeholder="Username"
            type="text"
            id="username"
            value={username}
            onChange={this.onChangeUsername}
          />
          <label className="label" htmlFor="password">
            PASSWORD
          </label>
          <input
            className="input"
            placeholder="Password"
            type="password"
            id="password"
            value={password}
            onChange={this.onChangePassword}
          />
          <button type="submit" className="login-btn stretch">
            Login
          </button>
          {isError && <p className="error">*{error}</p>}
        </form>
      </div>
    )
  }
}

export default Login
