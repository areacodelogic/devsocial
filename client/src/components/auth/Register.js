import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
// actions
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';


import PropTypes from 'prop-types';

const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setformData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  const { name, email, password, password2 } = formData;

  const handleChange = (evt) =>
    setformData({
      ...formData,
      [evt.target.name]: evt.target.value,
    });

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (password !== password2) {
      setAlert("Passwords don't match", 'danger');
    } else {
      register({
        name,
        email,
        password,
      });
    }
  };

  if(isAuthenticated){
    return <Redirect to="/dashboard" />
  }


  return (
    <Fragment>
      <h1 className='large text-primary'>Sign Up</h1>
      <p className='lead'>
        <i className='fas fa-user'>Create your Account</i>
      </p>
      <form className='form' onSubmit={(e) => handleSubmit(e)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Name'
            name='name'
            value={name}
            onChange={(e) => handleChange(e)}
            
          />
        </div>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={(e) => handleChange(e)}
          />
          <small className='form-text'>
            This site uses Gravatar, so if you wat a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            value={password}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Confirm Password'
            name='password2'
            value={password2}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <input type='submit' value='Register' className='btn btn-primary' />
      </form>
      <p className='my-1'>
        Already have an account? <Link to='/login'>Sign In</Link>
      </p>
    </Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  
});

export default connect(mapStateToProps, { setAlert, register })(Register);

// Checked to see if we hit the backend and receive a token test

// const handleSubmit = async (evt) => {
//   evt.preventDefault();
//   if (password !== password2) {
//     console.log('Passwords do not match');
//   } else {
//     const newUser = {
//       name,
//       email,
//       password,
//     };

//     try {
//       const config = {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       };

//       const body = JSON.stringify(newUser);

//       const res = await axios.post('/api/users', body, config);
//       console.log(res.data);
//     } catch (err) {
//       console.error(err.response.data);
//     }
//   }
// };
