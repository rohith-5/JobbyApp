import {Component} from 'react'
import Cookies from 'js-cookie'
import {IoIosStar} from 'react-icons/io'
import {BsBriefcaseFill, BsBoxArrowUpRight} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

import Header from '../Header'
import SimilarJobs from '../SimilarJobs'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobDetails: [],
    similarJobs: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()
      const jobDetails = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        lifeAtCompany: {
          description: data.job_details.life_at_company.description,
          imageUrl: data.job_details.life_at_company.image_url,
        },
        location: data.job_details.location,
        rating: data.job_details.rating,
        title: data.job_details.title,
        packagePerAnnum: data.job_details.package_per_annum,
        skills: data.job_details.skills.map(each => ({
          imageUrl: each.image_url,
          name: each.name,
        })),
      }
      const similarJobs = data.similar_jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))

      this.setState({
        jobDetails,
        similarJobs,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onRetryJobDetails = () => {
    this.getJobDetails()
  }

  renderFailure = () => (
    <div className="job-failure">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="job-failure-img"
      />
      <h1 className="failure-text">Oops! Something Went Wrong</h1>
      <p className="para">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="login-btn"
        onClick={this.onRetryJobDetails}
      >
        Retry
      </button>
    </div>
  )

  renderSuccess = () => {
    const {jobDetails, similarJobs} = this.state
    const {lifeAtCompany} = jobDetails

    return (
      <>
        <div className="job details-card">
          <div className="job-logo-card">
            <img
              src={jobDetails.companyLogoUrl}
              alt="job details company logo"
              className="job-logo"
            />
            <div className="job-logo-text-card">
              <h1 className="job-title">{jobDetails.title}</h1>
              <p className="ratings job-title">
                <IoIosStar className="star" />
                {jobDetails.rating}
              </p>
            </div>
          </div>
          <div className="job-icons">
            <div className="details">
              <MdLocationOn className="icon" />
              <p className="location">{jobDetails.location}</p>
              <BsBriefcaseFill className="icon" />
              <p className="type">{jobDetails.employmentType}</p>
            </div>
            <p className="job-title">{jobDetails.packagePerAnnum}</p>
          </div>
          <hr />
          <div className="text-card">
            <div className="visit-card">
              <h1 className="desc details-desc">Description</h1>
              <a href={jobDetails.companyWebsiteUrl} className="visit">
                Visit <BsBoxArrowUpRight />
              </a>
            </div>
            <p className="para details-para">{jobDetails.jobDescription}</p>
          </div>
          <div className="skills-card">
            <h1 className="desc details-desc">Skills</h1>
            <ul className="skills">
              {jobDetails.skills.map(each => {
                const {name, imageUrl} = each

                return (
                  <li key={name} className="skill">
                    <img src={imageUrl} alt={name} className="skill-img" />
                    <p className="para details-para">{name}</p>
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="text-card">
            <p className="desc details-desc">Life at Company</p>
            <div className="life-card">
              <p className="para details-para">{lifeAtCompany.description}</p>
              <img
                src={lifeAtCompany.imageUrl}
                alt="life at company"
                className="life-img"
              />
            </div>
          </div>
        </div>
        <div className="similar-card">
          <h1 className="similar-heading">Similar Jobs</h1>
          <ul className="similar-jobs">
            {similarJobs.map(each => (
              <SimilarJobs key={each.id} similarJob={each} />
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderJobDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccess()
      case apiStatusConstants.failure:
        return this.renderFailure()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        <div className="details-container">{this.renderJobDetails()}</div>
      </div>
    )
  }
}

export default JobItemDetails
