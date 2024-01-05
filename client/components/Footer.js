import React from 'react';
import dogSit from '../../assets/Sitting.gif';
import dogJump from '../../assets/Jumping.gif';
import grass from '../../assets/grass_w_less_dirt.png';
import grassOverflow from '../../assets/grass_repeat.png';
import '../stylesheets/Footers.css';

const Footers = () => {
  return (
    <div>
      <div
        className='footer'
        style={{ backgroundImage: `url(${grass}), url(${grassOverflow})` }}
      >
        <img src={dogSit} alt='Walking Dog' className='dog sit' />
        <img src={dogJump} alt='Jump Dog' className='dog jump' />
      </div>
    </div>
  );
};

export default Footers;
