import React, { Fragment, useState } from 'react';
import {Link, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {login} from '../../actions/auth';


const Login = ({login, isAuthenticated}) => {
  const [formData, setformData] = useState({
  
    email: '',
    password: ''
    
  });

  const { email, password } = formData;

  const handleChange = (evt) =>
    setformData({
      ...formData,
      [evt.target.name]: evt.target.value,
    });

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    login(email, password);
    
  };

  // Redirect if logged in 

  if(isAuthenticated){
    return <Redirect to="/dashboard" />
  }

  return (
    <Fragment>
      <h1 className='large text-primary'>Sign In</h1>
      <p className='lead'>
        <i className='fas fa-user'>Sign into Your Account</i>
      </p>
      <form className='form' onSubmit={(e) => handleSubmit(e)}>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={(e) => handleChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            minLength='6'
            name='password'
            value={password}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <input type='submit' value='Login' className='btn btn-primary' />
      </form>
      <p className='my-1'>
        Don't have an account? <Link to='/register'>Sign Up</Link>
      </p>
    </Fragment>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, {login})(Login);
