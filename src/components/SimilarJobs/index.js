import {IoIosStar} from 'react-icons/io'
import {BsBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'

const SimilarJobs = props => {
  const {similarJob} = props
  const {
    title,
    rating,
    location,
    jobDescription,
    employmentType,
    companyLogoUrl,
  } = similarJob

  return (
    <li className="job similar-job">
      <div className="job-logo-card">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="job-logo"
        />
        <div className="job-logo-text-card">
          <h1 className="job-title similar-title">{title}</h1>
          <p className="ratings job-title similar-title">
            <IoIosStar className="star" />
            {rating}
          </p>
        </div>
      </div>
      <div className="text-card">
        <p className="desc similar-desc">Description</p>
        <p className="para similar-para">{jobDescription}</p>
      </div>
      <div className="job-icons similar-icons">
        <div className="details">
          <MdLocationOn className="icon similar-type" />
          <p className="icon-text">{location}</p>
          <BsBriefcaseFill className="icon similar-type" />
          <p className="icon-text">{employmentType}</p>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobs
