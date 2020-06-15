import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileEducation = ({
  experience: { school, degree, fieldofstudy, current, to, from, description },
}) => {
  return (
    <Fragment>
      <div>
        <h3 className='text-dark'>{school}</h3>
        <p>
          <Moment format='YYYY/MM/DD'>{from}</Moment> -{' '}
          {!to ? ' Now' : <Moment format='YYYY/MM/DD'>{to}</Moment>}
        </p>
        <p>
          <strong>Degree: </strong> {degree}
        </p>
        <p>
          <strong>Feild of Study: </strong> {fieldofstudy}
        </p>
      </div>
    </Fragment>
  );
};

ProfileEducation.propTypes = {
  education: PropTypes.array.isRequired,
};

export default ProfileEducation;
