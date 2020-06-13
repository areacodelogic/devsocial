import React, { Fragment, useState } from 'react';
import {Link} from 'react-router-dom'

const Login = () => {
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
  
      console.log('success');
    
  };

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

export default Login;
