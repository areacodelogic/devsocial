import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addPost } from '../../actions/post';


const PostForm = ({ addPost }) => {
  const [text, setText] = useState('');

  const handleChange = (evt) => setText(evt.target.value)

  const handleSubmit = (evt) => {
    evt.preventDefault();
    addPost({text});
    setText('')
  };

  return (
    <div className='post-form'>
      <div className='post-form-header bg-primary p'>
        <h3>Say Something...</h3>
      </div>

      <form
        className='form my-1'
        onSubmit={(evt) => handleSubmit(evt)}>
        <textarea
          name='text'
          cols='30'
          rows='5'
          placeholder='Create a post'
          value={text}
          onChange={(evt) => handleChange(evt)}
          required></textarea>
        <input type='submit' className='btn btn-dark my-1' value='Submit' />
      </form>
    </div>
  );
};

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired,
};

export default connect(null, { addPost })(PostForm);


// import React, { useState } from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import { addPost } from '../../actions/post';

// const PostForm = ({ addPost }) => {
//   const [text, setText] = useState('');

//   return (
//     <div className='post-form'>
//       <div className='bg-primary p'>
//         <h3>Say Something...</h3>
//       </div>
//       <form
//         className='form my-1'
//         onSubmit={(e) => {
//           e.preventDefault();
//           addPost({ text });
//           setText('');
//         }}>
//         <textarea
//           name='text'
//           cols='30'
//           rows='5'
//           placeholder='Create a post'
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           required
//         />
//         <input type='submit' className='btn btn-dark my-1' value='Submit' />
//       </form>
//     </div>
//   );
// };

// PostForm.propTypes = {
//   addPost: PropTypes.func.isRequired,
// };

// export default connect(null, { addPost })(PostForm);