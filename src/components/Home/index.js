import {Component} from 'react'
import {Link, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import Header from '../Header'

class Home extends Component {
  redirectToJobs = () => {
    const {history} = this.props
    history.replace('/jobs')
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }

    return (
      <>
        <Header />
        <div className="home">
          <h1 className="home-heading">Find The Job That Fits Your Life</h1>
          <p className="home-para">
            Millions of people are searching for jobs, salary information,
            company reviews. Find the job that fits your abilities and
            capabilites.
          </p>
          <Link className="link" to="/jobs">
            <button
              type="button"
              className="login-btn home-btn"
              onClick={this.redirectToJobs}
            >
              Find Jobs
            </button>
          </Link>
        </div>
      </>
    )
  }
}

export default Home
