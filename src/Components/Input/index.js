import React from 'react';
import "./style.css";

function Input({ label, value, onChange, placeholder,type }) {
  return (
    <div className='input-wrapper'>
      <p className='label-input'>{label}</p>
      <input
      type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className='custom-input'
      />
    </div>
  );
}

export default Input;