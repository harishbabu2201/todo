import React, { useState } from 'react';
import '../css/style.css';

const Pages = ({ setFilter }) => {
  const [isSelected, setIsSelected] = useState('All');

  const handleClick = (filter) => {
    setIsSelected(filter);
    setFilter(filter);
  };

  return (
    <div className='container mt-3'>
      <div>
        <div className="btn-group" role="group" aria-label="Basic outlined example">
          <button
            type="button"
            className={`btn btn-outline-success ${isSelected === 'All' ? 'active' : ''}`}
            onClick={() => handleClick('All')}
          >
            All
          </button>
          <button
            type="button"
            className={`btn btn-outline-success ${isSelected === 'Completed' ? 'active' : ''}`}
            onClick={() => handleClick('Completed')}
          >
            Completed
          </button>
          <button
            type="button"
            className={`btn btn-outline-success ${isSelected === 'Incomplete' ? 'active' : ''}`}
            onClick={() => handleClick('Incomplete')}
          >
            Incomplete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pages;
