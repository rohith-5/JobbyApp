import {Link} from 'react-router-dom'
import {IoIosStar} from 'react-icons/io'
import {BsBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'

const JobItems = props => {
  const {job} = props
  const {
    id,
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = job

  return (
    <Link to={`/jobs/${id}`} className="link">
      <li className="job">
        <div className="job-logo-card">
          <img src={companyLogoUrl} alt="company logo" className="job-logo" />
          <div className="job-logo-text-card">
            <h1 className="job-title">{title}</h1>
            <p className="ratings job-title">
              <IoIosStar className="star" />
              {rating}
            </p>
          </div>
        </div>
        <div className="job-icons">
          <div className="details">
            <MdLocationOn className="icon" />
            <p className="location">{location}</p>
            <BsBriefcaseFill className="icon" />
            <p className="type">{employmentType}</p>
          </div>
          <p className="job-title">{packagePerAnnum}</p>
        </div>
        <hr />
        <div className="text-card">
          <h1 className="desc">Description</h1>
          <p className="para">{jobDescription}</p>
        </div>
      </li>
    </Link>
  )
}

export default JobItems
