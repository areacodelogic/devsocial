import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addComment } from '../../actions/post';

const CommentForm = ({ postId, addComment }) => {
  const [text, setText] = useState('');

  const handleChange = (evt) => setText(evt.target.value);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    addComment(postId, { text });
    setText('');
  };

  return (
    <div className='post-form'>
      <div className='post-form-header bg-primary p'>
        <h3>Leave a Comment</h3>
      </div>

      <form className='form my-1' onSubmit={(evt) => handleSubmit(evt)}>
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

CommentForm.propTypes = {
  addComment: PropTypes.func.isRequired,
};

export default connect(null, { addComment })(CommentForm);
