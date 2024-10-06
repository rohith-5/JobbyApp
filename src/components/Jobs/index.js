import {Component} from 'react'
import Cookies from 'js-cookie'
import {IoSearch} from 'react-icons/io5'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

import Header from '../Header'
import JobItems from '../JobItems'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const profileStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const jobStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    profileDetails: {},
    profileViewStatus: profileStatusConstants.initial,
    jobsList: [],
    jobViewStatus: jobStatusConstants.initial,
    searchInput: '',
    activeEmployeementIds: [],
    activeSalaryId: '',
  }

  componentDidMount() {
    this.getProfile()
    this.getJobs()
  }

  getProfile = async () => {
    this.setState({profileViewStatus: profileStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()
      const updatedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profileDetails: updatedData,
        profileViewStatus: profileStatusConstants.success,
      })
    } else {
      this.setState({profileViewStatus: profileStatusConstants.failure})
    }
  }

  getJobs = async () => {
    this.setState({jobViewStatus: jobStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {searchInput, activeEmployeementIds, activeSalaryId} = this.state
    const url = `https://apis.ccbp.in/jobs?employment_type=${activeEmployeementIds}&minimum_package=${activeSalaryId}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()
      const updatedData = data.jobs.map(each => ({
        id: each.id,
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({
        jobsList: updatedData,
        jobViewStatus: jobStatusConstants.success,
      })
    } else {
      this.setState({jobViewStatus: jobStatusConstants.failure})
    }
  }

  onChangeSalaryId = e => {
    this.setState({activeSalaryId: e.target.id}, this.getJobs)
  }

  onChangeEmployeementId = e => {
    const {activeEmployeementIds} = this.state
    const inputNotInList = activeEmployeementIds.filter(
      each => each === e.target.id,
    )
    if (inputNotInList.length === 0) {
      this.setState(
        prevState => ({
          activeEmployeementIds: [
            ...prevState.activeEmployeementIds,
            e.target.id,
          ],
        }),
        this.getJobs,
      )
    } else {
      const filteredData = activeEmployeementIds.filter(
        each => each !== e.target.id,
      )
      this.setState({activeEmployeementIds: filteredData}, this.getJobs)
    }
  }

  onChangeSearchInput = e => {
    this.setState({searchInput: e.target.value})
  }

  onClickEnterBtn = e => {
    if (e.key === 'Enter') {
      this.getJobs()
    }
  }

  onClickSearchBtn = () => {
    this.getJobs()
  }

  renderLoader = () => (
    <div data-testid="loader" className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onRetryJobs = () => {
    this.getJobs()
  }

  renderJobsFailure = () => (
    <div className="job-failure">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="job-failure-img"
      />
      <h1 className="failure-text">Oops! Something Went Wrong</h1>
      <p className="para">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" className="login-btn" onClick={this.onRetryJobs}>
        Retry
      </button>
    </div>
  )

  renderJobsSuccess = () => {
    const {jobsList} = this.state

    if (jobsList.length === 0) {
      return (
        <div className="job-failure">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            className="job-failure-img"
            alt="no jobs"
          />
          <h1 className="failure-text">No Jobs Found</h1>
          <p className="para">We could not find any jobs. Try other filters</p>
        </div>
      )
    }

    return (
      <ul className="jobs">
        {jobsList.map(each => (
          <JobItems key={each.id} job={each} />
        ))}
      </ul>
    )
  }

  renderJobs = () => {
    const {jobViewStatus} = this.state

    switch (jobViewStatus) {
      case jobStatusConstants.success:
        return this.renderJobsSuccess()
      case jobStatusConstants.failure:
        return this.renderJobsFailure()
      case jobStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  renderSearchBar = () => {
    const {searchInput} = this.state

    return (
      <div className="search-card">
        <input
          type="search"
          placeholder="Search"
          className="search"
          value={searchInput}
          onChange={this.onChangeSearchInput}
          onKeyDown={this.onClickEnterBtn}
        />
        <button
          data-testid="searchButton"
          type="button"
          onClick={this.onClickSearchBtn}
          className="search-icon-card"
        >
          <IoSearch className="search-icon" />
        </button>
      </div>
    )
  }

  renderSalaryRange = () => (
    <div className="employeement-card">
      <h1 className="nav-text">Salary Range</h1>
      <ul className="employees">
        {salaryRangesList.map(each => {
          const {salaryRangeId, label} = each
          console.log(salaryRangeId)

          return (
            <li key={salaryRangeId} className="employee">
              <input
                type="radio"
                name="salary"
                id={salaryRangeId}
                onChange={this.onChangeSalaryId}
              />
              <label htmlFor={salaryRangeId}>{label}</label>
            </li>
          )
        })}
      </ul>
    </div>
  )

  renderEmployeementTypes = () => (
    <>
      <hr className="jobs-hr" />
      <div className="employeement-card">
        <h1 className="nav-text">Type of Employment</h1>
        <ul className="employees">
          {employmentTypesList.map(each => {
            const {employmentTypeId, label} = each
            console.log(employmentTypeId)

            return (
              <li key={employmentTypeId} className="employee">
                <input
                  type="checkbox"
                  id={employmentTypeId}
                  onChange={this.onChangeEmployeementId}
                />
                <label htmlFor={employmentTypeId}>{label}</label>
              </li>
            )
          })}
        </ul>
      </div>
      <hr className="jobs-hr" />
    </>
  )

  onRetryProfile = () => {
    this.getProfile()
  }

  renderProfileFailure = () => (
    <div className="profile-failure">
      <button className="login-btn" type="button" onClick={this.onRetryProfile}>
        Retry
      </button>
    </div>
  )

  renderProfileSuccess = () => {
    const {profileDetails} = this.state
    const {profileImageUrl, name, shortBio} = profileDetails

    return (
      <div className="profile-card">
        <img src={profileImageUrl} alt="profile" className="profile-img" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-role">{shortBio}</p>
      </div>
    )
  }

  renderProfile = () => {
    const {profileViewStatus} = this.state

    switch (profileViewStatus) {
      case profileStatusConstants.success:
        return this.renderProfileSuccess()
      case profileStatusConstants.failure:
        return this.renderProfileFailure()
      case profileStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="search-container-sm">{this.renderSearchBar()}</div>
          <div className="left-card">
            {this.renderProfile()}
            {this.renderEmployeementTypes()}
            {this.renderSalaryRange()}
          </div>

          <div className="right-card">
            <div className="search-container-lg">{this.renderSearchBar()}</div>
            {this.renderJobs()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
